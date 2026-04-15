import { User, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  { icon: ShoppingBag, label: "Mes commandes", count: 3, path: "/reservations" },
  { icon: Heart, label: "Favoris", count: 5 },
  { icon: Settings, label: "Paramètres" },
];

const ProfilPage = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 pb-24 md:pb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">Connectez-vous</h2>
        <p className="text-sm text-muted-foreground mb-6">Accédez à votre profil, commandes et favoris</p>
        <Button asChild>
          <Link to="/auth">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="bg-gradient-hero rounded-2xl p-6 text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-primary-foreground font-bold text-lg">
          {user.user_metadata?.full_name || "Utilisateur"}
        </h2>
        <p className="text-primary-foreground/70 text-sm">{user.email}</p>
        {user.user_metadata?.phone && (
          <p className="text-primary-foreground/70 text-xs mt-1">{user.user_metadata.phone}</p>
        )}
        {isAdmin && (
          <span className="inline-flex items-center gap-1 mt-2 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
            <Shield className="w-3 h-3" /> Administrateur
          </span>
        )}
      </div>

      <div className="space-y-2 mb-6">
        {isAdmin && (
          <Link
            to="/admin"
            className="w-full flex items-center gap-3 bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-secondary" />
            </div>
            <span className="flex-1 font-semibold text-foreground text-sm">Tableau de bord admin</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        )}
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className="w-full flex items-center gap-3 bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="flex-1 font-semibold text-foreground text-sm">{item.label}</span>
            {item.count && (
              <span className="bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {item.count}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <Button variant="outline" className="w-full gap-2 text-accent border-accent/20 hover:bg-accent/10" onClick={handleSignOut}>
        <LogOut className="w-4 h-4" /> Déconnexion
      </Button>
    </div>
  );
};

export default ProfilPage;
