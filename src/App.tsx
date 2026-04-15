import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Vehicules from "./pages/Vehicules";
import Pieces from "./pages/Pieces";
import Reservations from "./pages/Reservations";
import Profil from "./pages/Profil";
import Panier from "./pages/Panier";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVehicules from "./pages/admin/AdminVehicules";
import AdminPieces from "./pages/admin/AdminPieces";
import AdminCommandes from "./pages/admin/AdminCommandes";
import AdminAlertes from "./pages/admin/AdminAlertes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/vehicules" element={<Vehicules />} />
                <Route path="/pieces" element={<Pieces />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/panier" element={<Panier />} />
              </Route>
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="vehicules" element={<AdminVehicules />} />
                <Route path="pieces" element={<AdminPieces />} />
                <Route path="commandes" element={<AdminCommandes />} />
                <Route path="alertes" element={<AdminAlertes />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
