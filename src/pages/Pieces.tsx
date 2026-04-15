import { useState } from "react";
import { Search } from "lucide-react";
import { PartCard } from "@/components/PartCard";
import { parts } from "@/data/mockData";

const cats = ["Tous", "Freinage", "Filtres", "Électrique", "Suspension", "Moteur"];

const PiecesPage = () => {
  const [activeCat, setActiveCat] = useState("Tous");

  const filtered = activeCat === "Tous" ? parts : parts.filter((p) => p.category === activeCat);

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Pièces Détachées</h1>
      <p className="text-sm text-muted-foreground mb-5">Stock mis à jour en temps réel</p>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher une pièce..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCat === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map((p) => (
          <PartCard key={p.id} part={p} />
        ))}
      </div>
    </div>
  );
};

export default PiecesPage;
