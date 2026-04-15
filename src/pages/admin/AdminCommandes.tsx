import { useState } from "react";
import { Search, CheckCircle, XCircle, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orders as initialOrders, type Order } from "@/data/mockOrders";
import { toast } from "sonner";

const statusConfig: Record<Order["status"], { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "En attente", className: "bg-warning/10 text-warning", icon: Clock },
  confirmed: { label: "Confirmée", className: "bg-primary/10 text-primary", icon: CheckCircle },
  delivered: { label: "Livrée", className: "bg-blue-500/10 text-blue-500", icon: Truck },
  cancelled: { label: "Annulée", className: "bg-accent/10 text-accent", icon: XCircle },
};

const paymentLabels: Record<Order["payment"], string> = {
  flooz: "Flooz",
  tmoney: "T-Money",
  surplace: "Sur place",
};

const AdminCommandes = () => {
  const [list, setList] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Order["status"] | "all">("all");

  const filtered = list
    .filter(o => filter === "all" || o.status === filter)
    .filter(o => o.client.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id: string, status: Order["status"]) => {
    setList(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast.success(`Commande ${id} mise à jour`);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-bold text-foreground">Gestion des commandes ({list.length})</h1>

      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "confirmed", "delivered", "cancelled"] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
            className="text-xs"
          >
            {s === "all" ? "Toutes" : statusConfig[s].label}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par client ou n° commande..." className="pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map(o => {
          const sc = statusConfig[o.status];
          const StatusIcon = sc.icon;
          return (
            <div key={o.id} className="bg-card rounded-xl p-4 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground text-sm">{o.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.className}`}>
                      <StatusIcon className="w-3 h-3 inline mr-0.5" />{sc.label}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-semibold">{o.client}</p>
                  <p className="text-xs text-muted-foreground">{o.phone} · {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-extrabold text-sm">{o.total.toLocaleString("fr-FR")} F</p>
                  <p className="text-[10px] text-muted-foreground">{paymentLabels[o.payment]}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Articles : {o.items}</p>

              {o.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1 flex-1" onClick={() => updateStatus(o.id, "confirmed")}>
                    <CheckCircle className="w-3.5 h-3.5" /> Confirmer
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-accent border-accent/20" onClick={() => updateStatus(o.id, "cancelled")}>
                    <XCircle className="w-3.5 h-3.5" /> Annuler
                  </Button>
                </div>
              )}
              {o.status === "confirmed" && (
                <Button size="sm" variant="outline" className="gap-1" onClick={() => updateStatus(o.id, "delivered")}>
                  <Truck className="w-3.5 h-3.5" /> Marquer livrée
                </Button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucune commande trouvée</p>
        )}
      </div>
    </div>
  );
};

export default AdminCommandes;
