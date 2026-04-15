import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vehicles as initialVehicles } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Vehicle } from "@/components/VehicleCard";

const AdminVehicules = () => {
  const [list, setList] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState("");
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = list.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  const emptyVehicle: Vehicle = { id: "", name: "", price: 0, image: "", year: 2024, fuel: "Essence", location: "Lomé" };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const vehicle: Vehicle = {
      id: editVehicle?.id || String(Date.now()),
      name: fd.get("name") as string,
      price: Number(fd.get("price")),
      image: fd.get("image") as string || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
      year: Number(fd.get("year")),
      fuel: fd.get("fuel") as string,
      location: fd.get("location") as string,
    };
    if (editVehicle?.id) {
      setList(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
      toast.success("Véhicule modifié");
    } else {
      setList(prev => [...prev, vehicle]);
      toast.success("Véhicule ajouté");
    }
    setDialogOpen(false);
    setEditVehicle(null);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(v => v.id !== id));
    toast.info("Véhicule supprimé");
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-foreground">Gestion des véhicules ({list.length})</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditVehicle(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={() => setEditVehicle(null)}>
              <Plus className="w-4 h-4" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editVehicle?.id ? "Modifier" : "Ajouter"} un véhicule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-3">
              <div><Label>Nom</Label><Input name="name" defaultValue={editVehicle?.name} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Prix (FCFA)</Label><Input name="price" type="number" defaultValue={editVehicle?.price} required /></div>
                <div><Label>Année</Label><Input name="year" type="number" defaultValue={editVehicle?.year || 2024} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Carburant</Label><Input name="fuel" defaultValue={editVehicle?.fuel || "Essence"} required /></div>
                <div><Label>Localisation</Label><Input name="location" defaultValue={editVehicle?.location || "Lomé"} required /></div>
              </div>
              <div><Label>Image URL</Label><Input name="image" defaultValue={editVehicle?.image} /></div>
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un véhicule..." className="pl-9" />
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-semibold">Véhicule</th>
                <th className="p-3 font-semibold hidden md:table-cell">Année</th>
                <th className="p-3 font-semibold hidden sm:table-cell">Carburant</th>
                <th className="p-3 font-semibold">Prix</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={v.image} alt={v.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-foreground">{v.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{v.year} · {v.fuel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{v.year}</td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">{v.fuel}</td>
                  <td className="p-3 font-bold text-primary">{v.price.toLocaleString("fr-FR")} F</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditVehicle(v); setDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-accent" onClick={() => handleDelete(v.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVehicules;
