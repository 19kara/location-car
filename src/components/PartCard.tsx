import { Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export interface Part {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export function PartCard({ part }: { part: Part }) {
  const { addItem } = useCart();
  const lowStock = part.stock <= 3;

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={part.image}
          alt={part.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{part.category}</span>
        <h3 className="font-bold text-foreground text-sm mt-0.5 truncate">{part.name}</h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span className={`text-xs font-semibold ${lowStock ? "text-accent" : "text-success"}`}>
            {lowStock ? `Plus que ${part.stock}` : `${part.stock} en stock`}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-primary font-extrabold">
            {part.price.toLocaleString("fr-FR")} <span className="text-xs font-semibold">FCFA</span>
          </p>
          <Button size="sm" variant="outline" onClick={() => addItem({ id: part.id, name: part.name, price: part.price, image: part.image, type: "part" })}>
            <ShoppingCart className="w-3.5 h-3.5" /> Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
