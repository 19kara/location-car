export interface Order {
  id: string;
  client: string;
  phone: string;
  items: string;
  total: number;
  payment: "flooz" | "tmoney" | "surplace";
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  date: string;
}

export const orders: Order[] = [
  { id: "CMD-001", client: "Kofi Mensah", phone: "+228 90 12 34 56", items: "Toyota Corolla 2019", total: 7500000, payment: "flooz", status: "confirmed", date: "2026-04-05" },
  { id: "CMD-002", client: "Ama Koffi", phone: "+228 91 23 45 67", items: "Plaquettes de frein ×2", total: 50000, payment: "tmoney", status: "pending", date: "2026-04-06" },
  { id: "CMD-003", client: "Yao Agbeko", phone: "+228 93 45 67 89", items: "Batterie 12V 70Ah", total: 55000, payment: "surplace", status: "delivered", date: "2026-04-03" },
  { id: "CMD-004", client: "Efua Mensah", phone: "+228 90 98 76 54", items: "Honda Civic 2020", total: 8200000, payment: "flooz", status: "pending", date: "2026-04-06" },
  { id: "CMD-005", client: "Kodjo Lawson", phone: "+228 92 11 22 33", items: "Amortisseur arrière ×4", total: 180000, payment: "tmoney", status: "confirmed", date: "2026-04-04" },
  { id: "CMD-006", client: "Akossiwa Degbe", phone: "+228 91 55 66 77", items: "Filtre à huile ×3", total: 24000, payment: "surplace", status: "cancelled", date: "2026-04-01" },
];
