import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl sm:text-9xl text-primary/20 mb-4">
          404
        </p>
        <h1 className="font-display text-2xl sm:text-3xl text-foreground mb-4">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Go to homepage
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Contact us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
