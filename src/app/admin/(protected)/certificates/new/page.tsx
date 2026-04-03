// new/page.tsx
// Minimal server component — renders the CreateCertificateForm client component
// at the route /admin/certificates/new inside the existing admin layout.

import CreateCertificateForm from "@/components/admin/CreateCertificateForm";

export default function NewCertificatePage() {
  return <CreateCertificateForm />;
}
