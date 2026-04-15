import { MapPin, Fuel, Calendar, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export interface Vehicle {
  id: string;
  name: string;
  price: number;
  image: string;
  year: number;
  fuel: string;
  location: string;
  badge?: string;
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { addItem } = useCart();
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {vehicle.badge && (
          <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            {vehicle.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-base mb-1 truncate">{vehicle.name}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{vehicle.year}</span>
          <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5" />{vehicle.fuel}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{vehicle.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-primary font-extrabold text-lg">
            {vehicle.price.toLocaleString("fr-FR")} <span className="text-sm font-semibold">FCFA</span>
          </p>
          <Button size="sm" variant="default" onClick={() => addItem({ id: vehicle.id, name: vehicle.name, price: vehicle.price, image: vehicle.image, type: "vehicle" })}>
            <ShoppingCart className="w-3.5 h-3.5" /> Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
