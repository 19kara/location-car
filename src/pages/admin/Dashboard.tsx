import { Car, Wrench, ShoppingCart, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { vehicles, parts } from "@/data/mockData";
import { orders } from "@/data/mockOrders";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Véhicules", value: vehicles.length, icon: Car, color: "text-primary" },
  { label: "Pièces en stock", value: parts.reduce((s, p) => s + p.stock, 0), icon: Wrench, color: "text-secondary" },
  { label: "Commandes", value: orders.length, icon: ShoppingCart, color: "text-blue-500" },
  { label: "Revenus", value: `${(orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0) / 1e6).toFixed(1)}M`, icon: DollarSign, color: "text-emerald-500" },
];

const revenueData = [
  { month: "Jan", revenue: 12.5 },
  { month: "Fév", revenue: 8.3 },
  { month: "Mar", revenue: 15.7 },
  { month: "Avr", revenue: 22.1 },
];

const statusData = [
  { name: "En attente", value: orders.filter(o => o.status === "pending").length, color: "hsl(38, 92%, 50%)" },
  { name: "Confirmées", value: orders.filter(o => o.status === "confirmed").length, color: "hsl(156, 72%, 40%)" },
  { name: "Livrées", value: orders.filter(o => o.status === "delivered").length, color: "hsl(210, 70%, 50%)" },
  { name: "Annulées", value: orders.filter(o => o.status === "cancelled").length, color: "hsl(0, 72%, 51%)" },
];

const lowStockParts = parts.filter(p => p.stock <= 5);

const AdminDashboard = () => (
  <div className="p-4 md:p-6 space-y-6">
    <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <p className="text-xl font-extrabold text-foreground">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Revenus mensuels (M FCFA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`${v}M FCFA`, "Revenus"]} />
              <Bar dataKey="revenue" fill="hsl(156, 100%, 24%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" /> Statut des commandes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-6">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-bold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {lowStockParts.length > 0 && (
      <Card className="shadow-card border-warning/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-warning">
            <AlertTriangle className="w-4 h-4" /> Alertes stock faible
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lowStockParts.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-warning/5 rounded-lg p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <span className={`text-sm font-bold ${p.stock <= 2 ? "text-accent" : "text-warning"}`}>
                  {p.stock} restant{p.stock > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

export default AdminDashboard;
