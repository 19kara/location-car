import { Link, useLocation } from "react-router-dom";
import { Home, Car, Wrench, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const items = [
  { label: "Accueil", path: "/", icon: Home },
  { label: "Véhicules", path: "/vehicules", icon: Car },
  { label: "Pièces", path: "/pieces", icon: Wrench },
  { label: "Panier", path: "/panier", icon: ShoppingCart, showBadge: true },
  { label: "Profil", path: "/profil", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t safe-bottom">
      <div className="flex justify-around items-center h-16 px-1">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-[56px] ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                {item.showBadge && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-accent text-accent-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
