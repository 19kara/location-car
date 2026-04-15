import { AlertTriangle, Package, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parts } from "@/data/mockData";
import { orders } from "@/data/mockOrders";

const lowStockParts = parts.filter(p => p.stock <= 5);
const pendingOrders = orders.filter(o => o.status === "pending");

const AdminAlertes = () => (
  <div className="p-4 md:p-6 space-y-4">
    <h1 className="text-xl font-bold text-foreground">Alertes & Notifications</h1>

    <Card className="shadow-card border-accent/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
          <AlertTriangle className="w-4 h-4" /> Stock faible ({lowStockParts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {lowStockParts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune alerte de stock</p>
        ) : lowStockParts.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-accent/5 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${p.stock <= 2 ? "text-accent" : "text-warning"}`}>
              {p.stock} unité{p.stock > 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>

    <Card className="shadow-card border-warning/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-warning">
          <Bell className="w-4 h-4" /> Commandes en attente ({pendingOrders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {pendingOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune commande en attente</p>
        ) : pendingOrders.map(o => (
          <div key={o.id} className="flex items-center justify-between bg-warning/5 rounded-lg p-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{o.id} — {o.client}</p>
              <p className="text-xs text-muted-foreground">{o.items} · {o.date}</p>
            </div>
            <span className="text-sm font-bold text-primary">{o.total.toLocaleString("fr-FR")} F</span>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default AdminAlertes;
