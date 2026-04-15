import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/data/mockData";

const filters = ["Tous", "Berlines", "SUV / 4x4", "Pick-up", "Utilitaires"];

const VehiculesPage = () => {
  const [activeFilter, setActiveFilter] = useState("Tous");

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Catalogue Véhicules</h1>
      <p className="text-sm text-muted-foreground mb-5">Trouvez la voiture idéale parmi notre sélection</p>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Marque, modèle..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </div>
  );
};

export default VehiculesPage;
