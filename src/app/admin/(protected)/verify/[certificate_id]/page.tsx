// admin/verify/[certificate_id]/page.tsx
// If someone navigates to /admin/verify/[id], redirect them to the
// public verification page at /verify/[id].

import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ certificate_id: string }>;
}

export default async function AdminVerifyByIdPage({ params }: Props) {
  const { certificate_id } = await params;
  redirect(`/verify/${certificate_id}`);
}
