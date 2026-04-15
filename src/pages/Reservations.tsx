import { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Bell, BellRing, Calculator, Plus, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateRentalCost, getDailyRate, getDiscountLabel } from "@/lib/rentalCost";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface Rental {
  id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  daily_rate: number;
  total_cost: number;
  status: "active" | "completed" | "cancelled";
  reminder_24h: boolean;
  notes: string | null;
  created_at: string;
  vehicles?: { name: string; price: number; location: string | null; image: string | null };
}

interface Vehicle {
  id: string;
  name: string;
  price: number;
  location: string | null;
  image: string | null;
}

const ReservationsPage = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // New reservation form
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRentals = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("rentals")
      .select("*, vehicles(name, price, location, image)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des réservations");
      console.error(error);
    } else {
      setRentals(data as Rental[]);
    }
    setLoading(false);
  };

  const fetchVehicles = async () => {
    const { data } = await supabase
      .from("vehicles")
      .select("id, name, price, location, image")
      .eq("status", "available");
    if (data) setVehicles(data);
  };

  useEffect(() => {
    fetchRentals();
    fetchVehicles();
  }, [user]);

  const toggleReminder = async (rental: Rental) => {
    const newVal = !rental.reminder_24h;
    const { error } = await supabase
      .from("rentals")
      .update({ reminder_24h: newVal })
      .eq("id", rental.id);

    if (error) {
      toast.error("Erreur lors de la mise à jour du rappel");
    } else {
      setRentals((prev) =>
        prev.map((r) => (r.id === rental.id ? { ...r, reminder_24h: newVal } : r))
      );
      toast[newVal ? "success" : "info"](
        newVal ? "Rappel activé ! Vous serez notifié 24h avant la fin." : "Rappel désactivé."
      );
    }
  };

  const isEndingSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  };

  const handleCreateReservation = async () => {
    if (!user || !selectedVehicle || !startDate || !endDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const days = differenceInDays(endDate, startDate);
    if (days <= 0) {
      toast.error("La date de fin doit être après la date de début");
      return;
    }

    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    if (!vehicle) return;

    const dailyRate = getDailyRate(vehicle.price);
    const totalCost = calculateRentalCost(vehicle.price, days);

    setSubmitting(true);
    const { error } = await supabase.from("rentals").insert({
      user_id: user.id,
      vehicle_id: selectedVehicle,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      daily_rate: dailyRate,
      total_cost: totalCost,
      notes: notes || null,
    });

    if (error) {
      toast.error("Erreur lors de la création de la réservation");
      console.error(error);
    } else {
      toast.success("Réservation créée avec succès !");
      setDialogOpen(false);
      setSelectedVehicle("");
      setStartDate(undefined);
      setEndDate(undefined);
      setNotes("");
      fetchRentals();
    }
    setSubmitting(false);
  };

  const statusLabel: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-primary/10 text-primary" },
    completed: { label: "Terminée", className: "bg-muted text-muted-foreground" },
    cancelled: { label: "Annulée", className: "bg-destructive/10 text-destructive" },
  };

  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle);
  const previewDays = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const previewCost = selectedVehicleData && previewDays > 0
    ? calculateRentalCost(selectedVehicleData.price, previewDays)
    : 0;
  const previewDaily = selectedVehicleData ? getDailyRate(selectedVehicleData.price) : 0;
  const discountLabel = previewDays > 0 ? getDiscountLabel(previewDays) : null;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Connectez-vous pour voir vos réservations</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-extrabold text-foreground">Mes Réservations</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> Nouvelle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle réservation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Vehicle select */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Véhicule</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} — {v.price.toLocaleString("fr-FR")} FCFA
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start date */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Date de début</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarDays className="w-4 h-4 mr-2" />
                      {startDate ? format(startDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End date */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Date de fin</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarDays className="w-4 h-4 mr-2" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Cost preview */}
              {selectedVehicleData && previewDays > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Estimation du coût</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{previewDaily.toLocaleString("fr-FR")} FCFA/jour × {previewDays} jours</span>
                    <span className="font-bold text-primary text-sm">{previewCost.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  {discountLabel && (
                    <p className="text-xs text-primary font-semibold mt-1">{discountLabel}</p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Notes (optionnel)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informations supplémentaires..."
                  rows={2}
                />
              </div>

              <Button className="w-full" onClick={handleCreateReservation} disabled={submitting}>
                {submitting ? "Création..." : "Confirmer la réservation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Suivez vos réservations et locations</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-card animate-pulse h-40" />
          ))}
        </div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-16">
          <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Aucune réservation pour le moment</p>
          <Button onClick={() => setDialogOpen(true)} className="gap-1">
            <Plus className="w-4 h-4" /> Créer ma première réservation
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rentals.map((r) => {
            const days = differenceInDays(new Date(r.end_date), new Date(r.start_date));
            const endingSoon = isEndingSoon(r.end_date);
            const st = statusLabel[r.status] || statusLabel.active;

            return (
              <div key={r.id} className={`bg-card rounded-xl p-4 shadow-card transition-all ${endingSoon ? "ring-2 ring-warning" : ""}`}>
                {endingSoon && (
                  <div className="flex items-center gap-2 mb-3 bg-warning/10 text-warning rounded-lg px-3 py-2 text-xs font-semibold">
                    <BellRing className="w-4 h-4" />
                    Location se termine dans moins de 24h !
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{r.vehicles?.name || "Véhicule"}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {format(new Date(r.start_date), "dd MMM yyyy", { locale: fr })} → {format(new Date(r.end_date), "dd MMM yyyy", { locale: fr })}
                      </span>
                      {r.vehicles?.location && (
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{r.vehicles.location}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${st.className}`}>
                    {st.label}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Coût de location</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{r.daily_rate.toLocaleString("fr-FR")} FCFA/jour × {days} jours</span>
                    <span className="font-bold text-primary text-sm">{r.total_cost.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>

                {r.notes && (
                  <p className="mt-2 text-xs text-muted-foreground italic">📝 {r.notes}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant={r.reminder_24h ? "default" : "outline"}
                    className="gap-1"
                    onClick={() => toggleReminder(r)}
                    disabled={r.status !== "active"}
                  >
                    {r.reminder_24h ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    {r.reminder_24h ? "Rappel actif" : "Rappel 24h"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
