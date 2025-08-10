// src/utils/pdf.ts
import type { PurchaseOrder } from "../types/PurchaseOrderTypes";

type PdfOptions = {
  logoDataUrl?: string;
  currency?: string;
  filePrefix?: string;
};

const fmtMoney = (n: number, currency = "AUD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    Number(n || 0)
  );

const productLabel = (pid: any) =>
  typeof pid === "string" ? pid : pid?.name ?? "";

export async function exportPurchaseOrderPdf(
  order: PurchaseOrder,
  options: PdfOptions = {}
) {
  // Dynamic ESM imports that work with Vite
  const jsPDFMod = await import("jspdf");
  const jsPDF = (jsPDFMod as any).default ?? (jsPDFMod as any).jsPDF;

  const autoTableMod = await import("jspdf-autotable");
  const autoTable =
    (autoTableMod as any).default ?? (autoTableMod as any).autoTable;
  // ^ some builds export default, some export autoTable named—handle both

  const currency = options.currency ?? "AUD";
  const filePrefix = options.filePrefix ?? "PO";

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  let cursorY = 40;

  // Optional logo
  if (options.logoDataUrl) {
    try {
      doc.addImage(options.logoDataUrl, "PNG", marginX, cursorY - 10, 120, 30);
      cursorY += 36;
    } catch {}
  }

  // Header
  doc.setFontSize(16);
  doc.text(`Purchase Order #${order.orderNumber}`, marginX, cursorY);
  cursorY += 10;

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleString()}`,
    marginX,
    (cursorY += 18)
  );

  // Meta
  doc.setTextColor(0);
  const supplier =
    order.supplierName ||
    (typeof order.supplierId === "string"
      ? order.supplierId
      : order.supplierId?.name ?? "");
  doc.text(`Supplier: ${supplier}`, marginX, (cursorY += 16));
  doc.text(`Status: ${order.status}`, marginX, (cursorY += 16));
  doc.text(
    `Total: ${fmtMoney(order.totalAmount, currency)}`,
    marginX,
    (cursorY += 16)
  );
  cursorY += 10;

  // Items
  const items = order.items ?? [];
  const head = [["Product", "Qty", "Unit Price", "Line Total"]];
  const body =
    items.length > 0
      ? items.map((it) => {
          const line = Number(it.quantity) * Number(it.unitPrice);
          return [
            productLabel(it.productId),
            String(it.quantity),
            fmtMoney(Number(it.unitPrice), currency),
            fmtMoney(line, currency),
          ];
        })
      : [["No items found", "", "", ""]];

  // ✅ Call the plugin as a function (don’t use doc.autoTable)
  autoTable(doc, {
    head,
    body,
    startY: cursorY,
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [30, 41, 59] },
    columnStyles: {
      1: { halign: "right", cellWidth: 60 },
      2: { halign: "right", cellWidth: 90 },
      3: { halign: "right", cellWidth: 100 },
    },
    didDrawPage: () => {
      const pageSize = doc.internal.pageSize;
      const footerY = pageSize.getHeight() - 30;
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Generated on ${new Date().toLocaleString()}`, marginX, footerY);
    },
  } as any);

  if (items.length > 0) {
    const finalY = (doc as any).lastAutoTable?.finalY ?? cursorY + 20;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 355, finalY + 24, { align: "right" });
    doc.text(fmtMoney(order.totalAmount, currency), 455, finalY + 24, {
      align: "right",
    });
  }

  doc.save(`${filePrefix}-${order.orderNumber}.pdf`);
}
