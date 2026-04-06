"use client";

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Certificate } from "@/types/database";

interface Props {
  certificate: Certificate;
  qrCodeDataUrl: string;
  verificationUrl: string;
}

// Brand: Dark Azure #0f385a (matches globals.css --color-dark-azure)
const PRIMARY = "#0f385a";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    flexDirection: "column",
    fontFamily: "Helvetica",
  },

  // ── Header ────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 12,
  },
  headerDivider: {
    height: 2,
    backgroundColor: PRIMARY,
    marginBottom: 24,
  },
  brandName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
  },
  brandSub: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 3,
  },
  certTypeLabel: {
    fontSize: 9,
    color: "#6b7280",
  },

  // ── Body ──────────────────────────────────────────────────────────
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  smallLabel: {
    fontSize: 8,
    color: "#9ca3af",
    marginBottom: 6,
  },
  recipientName: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },
  courseName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 14,
  },
  divider: {
    width: 220,
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 14,
  },

  // Details row
  detailsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailBlock: {
    alignItems: "center",
    marginHorizontal: 14,
  },
  detailLabel: {
    fontSize: 7,
    color: "#9ca3af",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  courseDescription: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 400,
    lineHeight: 1.5,
    marginTop: 8,
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 12,
  },
  statusText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },

  // ── Footer ────────────────────────────────────────────────────────
  footerDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginTop: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerText: {
    fontSize: 7,
    color: "#9ca3af",
    marginBottom: 2,
  },
  footerBold: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    marginBottom: 2,
  },
  qrBlock: {
    alignItems: "center",
  },
  qrImage: {
    width: 72,
    height: 72,
  },
  qrLabel: {
    fontSize: 6,
    color: "#9ca3af",
    marginTop: 3,
    textAlign: "center",
  },
});

export default function CertificatePDF({ certificate, qrCodeDataUrl }: Props) {
  const issueDate = new Date(certificate.issue_date).toLocaleDateString(
    "en-GB",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  const statusColor =
    certificate.status === "active" ? "#16a34a" : "#dc2626";
  const statusLabel =
    certificate.status === "active" ? "Valid Certificate" : "Revoked";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>FM Global Careers</Text>
            <Text style={styles.brandSub}>
              International Oil &amp; Gas Training &amp; Placement
            </Text>
          </View>
          <View>
            <Text style={styles.certTypeLabel}>Certificate of Completion</Text>
          </View>
        </View>
        <View style={styles.headerDivider} />

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.smallLabel}>THIS IS TO CERTIFY THAT</Text>
          <Text style={styles.recipientName}>{certificate.student_name}</Text>
          <Text style={styles.smallLabel}>HAS SUCCESSFULLY COMPLETED</Text>
          <Text style={styles.courseName}>{certificate.course_name}</Text>
          <View style={styles.divider} />

          {/* Details row */}
          <View style={styles.detailsRow}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>ISSUED ON</Text>
              <Text style={styles.detailValue}>{issueDate}</Text>
            </View>
            {certificate.instructor_name ? (
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>INSTRUCTOR</Text>
                <Text style={styles.detailValue}>
                  {certificate.instructor_name}
                </Text>
              </View>
            ) : null}
            {certificate.duration ? (
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>DURATION</Text>
                <Text style={styles.detailValue}>{certificate.duration}</Text>
              </View>
            ) : null}
            {certificate.lectures_count != null &&
            certificate.lectures_count > 0 ? (
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>LECTURES</Text>
                <Text style={styles.detailValue}>
                  {String(certificate.lectures_count)}
                </Text>
              </View>
            ) : null}
          </View>

          {certificate.course_description ? (
            <Text style={styles.courseDescription}>
              {certificate.course_description}
            </Text>
          ) : null}

          {/* Status badge */}
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor }]}
          >
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerDivider} />
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerBold}>
              Certificate ID: {certificate.certificate_id}
            </Text>
            {certificate.reference_number ? (
              <Text style={styles.footerText}>
                Reference: {certificate.reference_number}
              </Text>
            ) : null}
            <Text style={styles.footerText}>Issued by FM Global Careers</Text>
          </View>
          {qrCodeDataUrl ? (
            <View style={styles.qrBlock}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={qrCodeDataUrl} style={styles.qrImage} />
              <Text style={styles.qrLabel}>Scan to verify</Text>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
