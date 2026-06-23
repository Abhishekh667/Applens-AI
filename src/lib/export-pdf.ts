"use client";
import type { AuditReport } from "@/types";

export async function exportReportPdf(report: AuditReport) {
  const el = document.getElementById("report-content");
  if (!el) return;

  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");
  const { listing, audit } = report;

  // ── Capture content at controlled width ──
  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.width = "900px";
  clone.style.maxWidth = "none";
  clone.style.margin = "0 auto";
  clone.style.padding = "0 40px";
  clone.style.position = "fixed";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.zIndex = "-1";
  clone.style.background = "#F8F7F3";

  clone.querySelectorAll<HTMLElement>("[class*='max-w-']").forEach((child) => {
    child.style.maxWidth = "none";
  });
  clone.querySelectorAll<HTMLElement>(".sticky, .fixed, .no-print").forEach((child) => {
    child.remove();
  });

  document.body.appendChild(clone);

  await Promise.all(
    Array.from(clone.querySelectorAll("img"))
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }),
      ),
  );

  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#F8F7F3",
  });

  document.body.removeChild(clone);

  // ── PDF layout ──────────────────────────────────────────
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();   // 595
  const pageH = pdf.internal.pageSize.getHeight();  // 842
  const mx = 28;
  const usableW = pageW - mx * 2;                   // 539

  const bannerH = 72;
  const footerH = 32;
  const gap = 12;

  const ratio = usableW / canvas.width;
  const scaledH = canvas.height * ratio;

  // Page 1: banner top → content → footer
  const contentTopP1 = mx + bannerH + gap;
  // Pages 2+: just gap → content → footer
  const contentTopPn = mx + gap;
  const footerBottom = pageH - mx;
  const footerTop = footerBottom - footerH;

  const contentMaxP1 = footerTop - contentTopP1;   // height for content on page 1
  const contentMaxPn = footerTop - contentTopPn;    // height for content on pages 2+

  // Calculate total pages
  let totalPages = 1;
  let remain = scaledH;
  while (remain > 0) {
    const maxSlice = totalPages === 1 ? contentMaxP1 : contentMaxPn;
    remain -= maxSlice;
    if (remain > 0) totalPages++;
  }

  // ── Draw each page ──
  let srcY = 0;
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (pageNum > 1) pdf.addPage();

    const isFirst = pageNum === 1;
    const maxSlice = isFirst ? contentMaxP1 : contentMaxPn;
    const remaining = scaledH - srcY;
    const sliceH = Math.min(maxSlice, remaining);
    const srcSliceH = (canvas.height / scaledH) * sliceH;
    const contentY = isFirst ? contentTopP1 : contentTopPn;

    // ── Blue banner (first page only) ──
    if (isFirst) {
      pdf.setFillColor(15, 27, 51);
      pdf.rect(0, 0, pageW, bannerH, "F");

      // Left: logo icon + brand name
      pdf.setFillColor(255, 255, 255);
      pdf.circle(48, 34, 13, "F");
      pdf.setFillColor(15, 27, 51);
      pdf.circle(48, 34, 5.5, "F");
      pdf.setFillColor(255, 255, 255);
      pdf.circle(48, 34, 2.5, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text("AppLens AI", 70, 29);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(180, 195, 220);
      pdf.text("App Store Listing Audit Report", 70, 42);

      // Center: date + page count
      const centerX = pageW / 2;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(180, 195, 220);
      const dateStr = new Date(report.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
      pdf.text(dateStr, centerX, 26, { align: "center" });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`Page ${pageNum} of ${totalPages}`, centerX, 40, { align: "center" });

      // Right: score + app name + developer
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text(audit.score.toFixed(1), pageW - mx, 28, { align: "right" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor(180, 195, 220);
      const appName = listing.title.length > 36
        ? listing.title.slice(0, 34) + "…"
        : listing.title;
      pdf.text(appName, pageW - mx, 42, { align: "right" });

      pdf.setFontSize(6);
      pdf.setTextColor(150, 170, 200);
      pdf.text(listing.developer ?? "", pageW - mx, 52, { align: "right" });

      // Accent line under banner
      pdf.setDrawColor(56, 120, 200);
      pdf.setLineWidth(1.5);
      pdf.line(0, bannerH, pageW, bannerH);
    } else {
      // Thin top border for subsequent pages
      pdf.setDrawColor(200, 200, 195);
      pdf.setLineWidth(0.5);
      pdf.line(mx, mx, pageW - mx, mx);
    }

    // ── Content ──
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = srcSliceH;
    const ctx = pageCanvas.getContext("2d")!;
    ctx.drawImage(
      canvas,
      0,
      (canvas.height / scaledH) * srcY,
      canvas.width,
      srcSliceH,
      0,
      0,
      canvas.width,
      srcSliceH,
    );

    pdf.addImage(
      pageCanvas.toDataURL("image/jpeg", 0.92),
      "JPEG",
      mx,
      contentY,
      usableW,
      sliceH,
    );

    pageCanvas.width = 0;
    pageCanvas.height = 0;

    // ── Footer ──
    pdf.setFillColor(245, 244, 240);
    pdf.rect(mx, footerTop, usableW, footerH, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.setTextColor(150, 150, 150);
    pdf.text("AppLens AI — App Store Listing Audit", mx, footerTop + 14);

    pdf.setFontSize(6);
    pdf.setTextColor(170, 170, 170);
    pdf.text(`Generated ${new Date(report.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    })}`, mx, footerTop + 24);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(130, 130, 130);
    pdf.text(`Page ${pageNum} / ${totalPages}`, mx + usableW - 4, footerTop + 20, { align: "right" });

    srcY += maxSlice;
  }

  const safe = listing.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  pdf.save(`applens-audit-${safe}.pdf`);
}
