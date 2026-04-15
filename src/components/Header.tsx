import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Search, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Véhicules", path: "/vehicules" },
  { label: "Pièces", path: "/pieces" },
  { label: "Réservations", path: "/reservations" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-extrabold text-lg">P</span>
          </div>
          <span className="font-extrabold text-xl text-foreground">
            Parking<span className="text-primary">Togo</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Rechercher">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Panier" asChild>
            <Link to="/panier" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          {user ? (
            <Button variant="default" size="sm" className="gap-2" asChild>
              <Link to="/profil">
                <User className="w-4 h-4" />
                {user.user_metadata?.full_name?.split(" ")[0] || "Profil"}
              </Link>
            </Button>
          ) : (
            <Button variant="default" size="sm" className="gap-2" asChild>
              <Link to="/auth">
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card px-4 pb-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block py-3 px-3 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
              <Link to="/panier" onClick={() => setOpen(false)}>
                <ShoppingCart className="w-4 h-4" /> Panier {totalItems > 0 && `(${totalItems})`}
              </Link>
            </Button>
            {user ? (
              <Button variant="default" size="sm" className="flex-1 gap-2" onClick={() => { signOut(); setOpen(false); }}>
                <User className="w-4 h-4" /> Déconnexion
              </Button>
            ) : (
              <Button variant="default" size="sm" className="flex-1 gap-2" asChild>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <LogIn className="w-4 h-4" /> Connexion
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
