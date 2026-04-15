import jsPDF from "jspdf";
import type { CartItem } from "@/contexts/CartContext";

interface ReceiptData {
  orderId: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: string;
  phone?: string;
  clientName?: string;
  date: Date;
  rentalDays?: number;
}

export function generateReceipt(data: ReceiptData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(0, 122, 61); // primary green
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ParkingTogo", 14, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Votre parking automobile au Togo", 14, 26);
  doc.text(`Reçu N° ${data.orderId}`, 14, 34);
  doc.text(data.date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }), pageWidth - 14, 34, { align: "right" });

  y = 52;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Client:", 14, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.clientName || "Client", 50, y);
  y += 8;

  if (data.phone) {
    doc.setFont("helvetica", "bold");
    doc.text("Téléphone:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(data.phone, 50, y);
    y += 8;
  }

  const methodLabel = data.paymentMethod === "flooz" ? "Flooz (Moov)" : data.paymentMethod === "tmoney" ? "T-Money (Togocel)" : "Sur place";
  doc.setFont("helvetica", "bold");
  doc.text("Paiement:", 14, y);
  doc.setFont("helvetica", "normal");
  doc.text(methodLabel, 50, y);
  y += 14;

  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y - 4, pageWidth - 28, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Article", 16, y + 2);
  doc.text("Qté", 120, y + 2);
  doc.text("Prix unit.", 140, y + 2);
  doc.text("Total", pageWidth - 16, y + 2, { align: "right" });
  y += 12;

  // Items
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  data.items.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    doc.text(item.name, 16, y);
    doc.text(String(item.quantity), 125, y);
    doc.text(`${item.price.toLocaleString("fr-FR")} F`, 140, y);
    doc.text(`${lineTotal.toLocaleString("fr-FR")} F`, pageWidth - 16, y, { align: "right" });
    y += 8;
  });

  // Rental cost line
  if (data.rentalDays && data.rentalDays > 0) {
    y += 2;
    doc.setFont("helvetica", "italic");
    doc.text(`Durée de location : ${data.rentalDays} jour(s)`, 16, y);
    y += 8;
  }

  // Total
  y += 4;
  doc.setDrawColor(0, 122, 61);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TOTAL", 16, y);
  doc.text(`${data.totalPrice.toLocaleString("fr-FR")} FCFA`, pageWidth - 16, y, { align: "right" });

  // Footer
  y = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("ParkingTogo - Lomé, Togo | +228 90 00 00 00 | contact@parkingtogo.com", pageWidth / 2, y, { align: "center" });
  doc.text("Merci pour votre confiance !", pageWidth / 2, y + 5, { align: "center" });

  // Download
  doc.save(`recu-${data.orderId}.pdf`);
}
