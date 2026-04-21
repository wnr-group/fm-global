// GTM dataLayer event helpers
// All events push to window.dataLayer for Google Tag Manager

type DataLayerEvent = Record<string, unknown> & { event: string };

function push(data: DataLayerEvent) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }
}

// ---------------------------------------------------------------------------
// CTA Clicks
// ---------------------------------------------------------------------------

export function trackCTAClick(label: string, page: string) {
  push({ event: "cta_click", cta_label: label, page });
}

// ---------------------------------------------------------------------------
// Contact Form
// ---------------------------------------------------------------------------

export function trackFormStart(formName: string) {
  push({ event: "form_start", form_name: formName });
}

export function trackFormSubmit(formName: string) {
  push({ event: "form_submit", form_name: formName });
}

export function trackFormSuccess(formName: string) {
  push({ event: "form_success", form_name: formName });
}

export function trackFormError(formName: string, error?: string) {
  push({ event: "form_error", form_name: formName, error_message: error });
}

// ---------------------------------------------------------------------------
// Job Interactions
// ---------------------------------------------------------------------------

export function trackJobView(jobId: string, jobTitle: string, company: string) {
  push({ event: "job_view", job_id: jobId, job_title: jobTitle, company });
}

export function trackJobApply(
  jobId: string,
  jobTitle: string,
  company: string,
  method: string
) {
  push({
    event: "job_apply",
    job_id: jobId,
    job_title: jobTitle,
    company,
    apply_method: method,
  });
}

export function trackJobPDFDownload(
  jobId: string,
  jobTitle: string,
  company: string
) {
  push({
    event: "job_pdf_download",
    job_id: jobId,
    job_title: jobTitle,
    company,
  });
}

// ---------------------------------------------------------------------------
// Certificate Verification
// ---------------------------------------------------------------------------

export function trackCertificateVerify(certificateId: string) {
  push({ event: "certificate_verify", certificate_id: certificateId });
}

export function trackCertificateDownload(certificateId: string) {
  push({ event: "certificate_download", certificate_id: certificateId });
}

export function trackCertificateShare(certificateId: string) {
  push({ event: "certificate_share", certificate_id: certificateId });
}

// ---------------------------------------------------------------------------
// Contact / Outbound Links
// ---------------------------------------------------------------------------

export function trackContactClick(
  type: "email" | "phone" | "whatsapp",
  value: string,
  page: string
) {
  push({ event: "contact_click", contact_type: type, contact_value: value, page });
}

export function trackSocialClick(platform: string, url: string) {
  push({ event: "social_click", platform, url });
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export function trackNavClick(label: string, href: string, location: string) {
  push({ event: "nav_click", nav_label: label, nav_href: href, nav_location: location });
}

// ---------------------------------------------------------------------------
// Scroll Depth
// ---------------------------------------------------------------------------

export function trackScrollDepth(depth: number, page: string) {
  push({ event: "scroll_depth", scroll_percent: depth, page });
}

// ---------------------------------------------------------------------------
// Course Engagement
// ---------------------------------------------------------------------------

export function trackCourseClick(courseId: string, courseTitle: string) {
  push({ event: "course_click", course_id: courseId, course_title: courseTitle });
}

// ---------------------------------------------------------------------------
// PDF / File Downloads
// ---------------------------------------------------------------------------

export function trackFileDownload(fileName: string, fileType: string) {
  push({ event: "file_download", file_name: fileName, file_type: fileType });
}

// ---------------------------------------------------------------------------
// Meta Pixel
// ---------------------------------------------------------------------------

function pixel(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, data);
}

export function trackMetaPageView() {
  pixel("PageView");
}

export function trackMetaLead(formName: string) {
  pixel("Lead", { content_name: formName });
}

export function trackMetaViewContent(name: string, type: string) {
  pixel("ViewContent", { content_name: name, content_type: type });
}

export function trackMetaContact(method: string) {
  pixel("Contact", { contact_method: method });
}

// ---------------------------------------------------------------------------
// TypeScript global augmentation
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    fbq: (type: string, event: string, data?: Record<string, unknown>) => void;
  }
}
