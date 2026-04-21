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

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    position: "relative",
    width: "100%",
    height: "100%",
  },

  // ── Curve Borders (absolute, drawn first so content sits above) ────
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 450, // adjust if curve looks stretched
  },
  bottomBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 450,
  },

  // ── Content (absolute, layered above borders) ──────────────────────
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 60,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "center",
  },

  // ── Top row: logo center, QR right ────────────────────────────────
  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 70,
    position: "relative",
  },
  logo: {
    width: 80,
    height: 80,
  },
  qrBlock: {
    position: "absolute",
    right: 0,
    top: 0,
    alignItems: "center",
  },
  qrImage: {
    width: 70,
    height: 70,
  },
  qrLabel: {
    fontSize: 7,
    color: "#444444",
    marginTop: 3,
    textAlign: "center",
    width: 100,
  },

  // ── Title ─────────────────────────────────────────────────────────
  certificateTitle: {
    fontSize: 46,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    textAlign: "center",
    letterSpacing: 6,
    marginTop: 10,
    marginBottom: 0,
  },

  // ── "OF COMPLETION" row with decorative lines ─────────────────────
  completionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  redLine: {
    width: 45,
    height: 2,
    backgroundColor: "#c0392b",
    marginHorizontal: 8,
  },
  completionText: {
    fontSize: 12,
    color: "#333333",
    letterSpacing: 4,
    fontFamily: "Helvetica",
  },

  // ── Body text ─────────────────────────────────────────────────────
  certifyText: {
    fontSize: 12,
    color: "#222222",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },

  // ── Recipient name ────────────────────────────────────────────────
  recipientName: {
    fontSize: 52,
    fontFamily: "Times-Roman",
    color: "#111111",
    textAlign: "center",
    marginBottom: 4,
  },
  nameDivider: {
    width: 340,
    height: 2,
    backgroundColor: "#c0392b",
    marginBottom: 12,
  },

  // ── Description ───────────────────────────────────────────────────
  description: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#222222",
    textAlign: "center",
    maxWidth: 600,
    lineHeight: 1.6,
    marginBottom: 16,
  },

  // ── Signature block ───────────────────────────────────────────────
  signatureBlock: {
    alignItems: "center",
    marginTop: 7,
  },
  signatureImage: {
    width: 130,
    height: 40,
    marginBottom: 5,
  },
  signatureLine: {
    width: 130,
    height: 2,
    backgroundColor: "#c0392b",
    marginBottom: 4,
  },
  signatoryName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    textAlign: "center",
  },
  signatoryRole: {
    fontSize: 13,
    color: "#444444",
    textAlign: "center",
    marginTop: 2,
  },
});

export default function CertificatePDF({
  certificate,
  qrCodeDataUrl,
}: Props) {

  const courseDescription = certificate.course_description
    ? `has successfully completed the prescribed course of study and training in ${certificate.course_name.toUpperCase()}. ${certificate.course_description}`
    : `has successfully completed the prescribed course of study and training in ${certificate.course_name.toUpperCase()}.`;


  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* ── Curved Borders rendered FIRST (bottom layer) ── */}
        <Image src="/certificate-top-border.png" style={styles.topBorder} />
        <Image src="/certificate-bottom-border.png" style={styles.bottomBorder} />

        {/* ── Content rendered SECOND (top layer) ── */}
        <View style={styles.content}>

          {/* Top row: logo center + QR right */}
          <View style={styles.topRow}>
            <Image src="/logo-fm-institute-v1.png" style={styles.logo} />
            {qrCodeDataUrl ? (
              <View style={styles.qrBlock}>
                <Image src={qrCodeDataUrl} style={styles.qrImage} />
                <Text style={styles.qrLabel}>certificate no -</Text>
                <Text style={styles.qrLabel}>{certificate.certificate_id}</Text>
              </View>
            ) : null}
          </View>

          {/* CERTIFICATE */}
          <Text style={styles.certificateTitle}>CERTIFICATE</Text>

          {/* OF COMPLETION with red lines */}
          <View style={styles.completionRow}>
            <View style={styles.redLine} />
            <Text style={styles.completionText}>OF COMPLETION</Text>
            <View style={styles.redLine} />
          </View>

          {/* This is to certify that */}
          <Text style={styles.certifyText}>This is to certify that</Text>

          {/* Recipient name */}
          <Text style={styles.recipientName}>{certificate.student_name}</Text>
          <View style={styles.nameDivider} />

          {/* Description */}
          <Text style={styles.description}>{courseDescription}</Text>

          {/* Signature */}
          <View style={styles.signatureBlock}>
            {certificate.signature_url ? (
              <Image src={certificate.signature_url} style={styles.signatureImage} />
            ) : (
              // 2. Fallback space if no signature is present
              <View style={{ height: 80 }} />
            )}
            <View style={styles.signatureLine} />
            <Text style={styles.signatoryName}>
              {certificate.instructor_name ?? "Palani . M"}
            </Text>
            <Text style={styles.signatoryRole}>Training Head</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
