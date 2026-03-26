import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass Supabase entirely for the login page — must be first, before any client init
  if (pathname === "/admin/login") {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — always use getUser(), never getSession() in middleware
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session → redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Session exists → check admin_users table
  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (error || !adminUser) {
    // Authenticated but not an admin → redirect to homepage
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Verified admin → allow through
  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
