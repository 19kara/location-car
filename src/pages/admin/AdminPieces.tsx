import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parts as initialParts } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Part } from "@/components/PartCard";

const AdminPieces = () => {
  const [list, setList] = useState<Part[]>(initialParts);
  const [search, setSearch] = useState("");
  const [editPart, setEditPart] = useState<Part | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const part: Part = {
      id: editPart?.id || String(Date.now()),
      name: fd.get("name") as string,
      price: Number(fd.get("price")),
      image: fd.get("image") as string || "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80",
      category: fd.get("category") as string,
      stock: Number(fd.get("stock")),
    };
    if (editPart?.id) {
      setList(prev => prev.map(p => p.id === part.id ? part : p));
      toast.success("Pièce modifiée");
    } else {
      setList(prev => [...prev, part]);
      toast.success("Pièce ajoutée");
    }
    setDialogOpen(false);
    setEditPart(null);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(p => p.id !== id));
    toast.info("Pièce supprimée");
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-foreground">Gestion des pièces ({list.length})</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditPart(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={() => setEditPart(null)}>
              <Plus className="w-4 h-4" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editPart?.id ? "Modifier" : "Ajouter"} une pièce</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-3">
              <div><Label>Nom</Label><Input name="name" defaultValue={editPart?.name} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Prix (FCFA)</Label><Input name="price" type="number" defaultValue={editPart?.price} required /></div>
                <div><Label>Stock</Label><Input name="stock" type="number" defaultValue={editPart?.stock} required /></div>
              </div>
              <div><Label>Catégorie</Label><Input name="category" defaultValue={editPart?.category} required /></div>
              <div><Label>Image URL</Label><Input name="image" defaultValue={editPart?.image} /></div>
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une pièce..." className="pl-9" />
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-semibold">Pièce</th>
                <th className="p-3 font-semibold hidden sm:table-cell">Catégorie</th>
                <th className="p-3 font-semibold">Stock</th>
                <th className="p-3 font-semibold">Prix</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">{p.category}</td>
                  <td className="p-3">
                    <span className={`font-bold ${p.stock <= 3 ? "text-accent" : p.stock <= 5 ? "text-warning" : "text-success"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-primary">{p.price.toLocaleString("fr-FR")} F</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditPart(p); setDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-accent" onClick={() => handleDelete(p.id)}>
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

export default AdminPieces;
