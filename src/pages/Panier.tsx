import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
// 1. CHANGEMENT DE L'IMPORT (ton nouveau client propre)
import { supabase } from "@/lib/supabase"; 
import { Trash2, Plus, Minus, ShoppingCart, CreditCard, Smartphone, FileDown, Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { generateReceipt } from "@/lib/generateReceipt";
import { calculateRentalCost, getDailyRate, getDiscountLabel } from "@/lib/rentalCost";

const PanierPage = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("flooz");
  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [rentalDays, setRentalDays] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour le bouton de chargement
  const [lastOrder, setLastOrder] = useState<{ orderId: string; items: typeof items; total: number; method: string; phone: string; days: number; clientName: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    // On récupère les infos du profil
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setClientName(data.full_name);
        if (data?.phone && !phone) setPhone(data.phone);
      });
  }, [user]);

  const vehicleItems = items.filter((i) => i.type === "vehicle");
  const partItems = items.filter((i) => i.type === "part");

  const rentalTotal = vehicleItems.reduce((sum, item) => {
    const days = rentalDays[item.id] || 0;
    return sum + (days > 0 ? calculateRentalCost(item.price, days) : 0);
  }, 0);

  const purchaseTotal = partItems.reduce((s, i) => s + i.price * i.quantity, 0) +
    vehicleItems.filter((v) => !(rentalDays[v.id] > 0)).reduce((s, v) => s + v.price * v.quantity, 0);
  const grandTotal = purchaseTotal + rentalTotal;

  // 2. LOGIQUE DE VALIDATION DE COMMANDE
  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // Validation du téléphone pour le Togo
    if ((paymentMethod === "flooz" || paymentMethod === "tmoney") && !phone) {
      toast.error("Veuillez entrer votre numéro de téléphone pour le paiement mobile");
      return;
    }

    setIsSubmitting(true);
    const orderId = `CMD-${Date.now().toString(36).toUpperCase()}`;
    const totalDays = Object.values(rentalDays).reduce((a, b) => a + b, 0);

    try {
      // Enregistrement dans Supabase (table 'orders')
      const { error } = await supabase
        .from('orders')
        .insert([{
          id_commande: orderId, // Assure-toi que les noms de colonnes correspondent à ta table
          user_id: user?.id,
          client_name: clientName || "Anonyme",
          phone: phone,
          total_price: grandTotal,
          payment_method: paymentMethod,
          status: 'en_attente',
          items: items // Supabase gère le JSONB automatiquement
        }]);

      if (error) throw error;

      // Succès
      setLastOrder({ 
        orderId, 
        items: [...items], 
        total: grandTotal, 
        method: paymentMethod, 
        phone, 
        days: totalDays, 
        clientName 
      });

      const methodLabel = paymentMethod === "flooz" ? "Flooz" : paymentMethod === "tmoney" ? "T-Money" : "sur place";
      toast.success(`Commande ${orderId} enregistrée !`);
      
      if (paymentMethod !== "surplace") {
        toast.info(`Veuillez effectuer le transfert au +228 90 XX XX XX`);
      }

      clearCart();
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!lastOrder) return;
    generateReceipt({
      orderId: lastOrder.orderId,
      items: lastOrder.items,
      totalPrice: lastOrder.total,
      paymentMethod: lastOrder.method,
      phone: lastOrder.phone || undefined,
      clientName: lastOrder.clientName || undefined,
      date: new Date(),
      rentalDays: lastOrder.days,
    });
    toast.success("Reçu téléchargé !");
  };

  // --- RENDU : PANIER VIDE ---
  if (items.length === 0 && !lastOrder) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold mb-2">Votre panier est vide</h1>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link to="/vehicules">Voir les véhicules</Link></Button>
          <Button asChild variant="outline"><Link to="/pieces">Voir les pièces</Link></Button>
        </div>
      </div>
    );
  }

  // --- RENDU : SUCCÈS COMMANDE ---
  if (items.length === 0 && lastOrder) {
    return (
      <div className="container mx-auto px-4 py-12 text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Commande confirmée !</h1>
        <p className="text-muted-foreground mb-4">Référence : <span className="font-mono font-bold text-foreground">{lastOrder.orderId}</span></p>
        
        <div className="bg-slate-50 p-4 rounded-xl mb-6 text-left border border-slate-200">
            <p className="text-sm font-bold mb-2">Instructions de paiement :</p>
            <p className="text-xs text-slate-600 mb-2">
                {lastOrder.method === 'tmoney' 
                    ? "Composez le *145*2*1*90XXXXXX*Montant# pour finaliser." 
                    : lastOrder.method === 'flooz' 
                    ? "Composez le *155*4*1*90XXXXXX*Montant# pour finaliser."
                    : "Rendez-vous à notre parking à Lomé pour le paiement."}
            </p>
            <div className="flex justify-between font-bold text-lg">
                <span>Total à payer :</span>
                <span className="text-primary">{lastOrder.total.toLocaleString()} F</span>
            </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleDownloadReceipt} className="gap-2 w-full py-6 text-lg">
            <FileDown className="w-5 h-5" /> Télécharger mon Reçu PDF
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  // --- RENDU : LE PANIER ---
  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <h1 className="text-xl font-bold text-foreground mb-4">Mon panier ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne de gauche : Articles */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const isVehicle = item.type === "vehicle";
            const days = rentalDays[item.id] || 0;
            const rentalCost = isVehicle && days > 0 ? calculateRentalCost(item.price, days) : 0;
            return (
              <div key={item.id} className="bg-card rounded-xl p-3 shadow-sm border">
                <div className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <p className="text-primary font-bold text-sm">{item.price.toLocaleString()} F</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
                {isVehicle && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                    <Label className="text-xs">Location (jours) :</Label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setRentalDays(prev => ({...prev, [item.id]: parseInt(e.target.value) || 0}))}
                      className="w-16 p-1 border rounded text-center text-sm"
                    />
                    {days > 0 && <span className="ml-auto text-primary font-bold">{rentalCost.toLocaleString()} F</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Colonne de droite : Paiement */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-sm border">
            <h2 className="font-bold mb-3">Mode de paiement</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              <div className="flex items-center space-x-2 border p-3 rounded-lg">
                <RadioGroupItem value="flooz" id="flooz" />
                <Label htmlFor="flooz" className="flex-1 cursor-pointer">Flooz (Moov)</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-lg">
                <RadioGroupItem value="tmoney" id="tmoney" />
                <Label htmlFor="tmoney" className="flex-1 cursor-pointer">T-Money (Togocel)</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-lg">
                <RadioGroupItem value="surplace" id="surplace" />
                <Label htmlFor="surplace" className="flex-1 cursor-pointer">Paiement sur place</Label>
              </div>
            </RadioGroup>

            {(paymentMethod !== "surplace") && (
              <div className="mt-4">
                <Label className="text-xs font-bold">Votre numéro de téléphone</Label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 90 00 00 00"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
            )}
          </div>

          <Button 
            onClick={handleCheckout} 
            disabled={isSubmitting}
            className="w-full py-6 text-lg font-bold"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Traitement...</>
            ) : (
              `Valider (${grandTotal.toLocaleString()} F)`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PanierPage;