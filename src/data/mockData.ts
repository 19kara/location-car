import type { Vehicle } from "@/components/VehicleCard";
import type { Part } from "@/components/PartCard";

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Corolla 2019",
    price: 7500000,
    image: "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600&q=80",
    year: 2019,
    fuel: "Essence",
    location: "Lomé",
    badge: "Populaire",
  },
  {
    id: "2",
    name: "Honda Civic 2020",
    price: 8200000,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
    year: 2020,
    fuel: "Essence",
    location: "Lomé",
  },
  {
    id: "3",
    name: "Toyota RAV4 2018",
    price: 12000000,
    image: "https://images.unsplash.com/photo-1568844293986-8d0400f3a7b6?w=600&q=80",
    year: 2018,
    fuel: "Diesel",
    location: "Kara",
    badge: "Promo",
  },
  {
    id: "4",
    name: "Nissan Almera 2017",
    price: 4800000,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80",
    year: 2017,
    fuel: "Essence",
    location: "Sokodé",
  },
  {
    id: "5",
    name: "Mercedes C200 2016",
    price: 15500000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
    year: 2016,
    fuel: "Diesel",
    location: "Lomé",
    badge: "Premium",
  },
  {
    id: "6",
    name: "Hyundai Tucson 2021",
    price: 14000000,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80",
    year: 2021,
    fuel: "Essence",
    location: "Lomé",
  },
];

export const parts: Part[] = [
  { id: "1", name: "Plaquettes de frein avant", price: 25000, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80", category: "Freinage", stock: 12 },
  { id: "2", name: "Filtre à huile universel", price: 8000, image: "https://images.unsplash.com/photo-1635784063203-cfee82a1a241?w=400&q=80", category: "Filtres", stock: 25 },
  { id: "3", name: "Batterie 12V 70Ah", price: 55000, image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80", category: "Électrique", stock: 2 },
  { id: "4", name: "Amortisseur arrière", price: 45000, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80", category: "Suspension", stock: 7 },
  { id: "5", name: "Bougies d'allumage (x4)", price: 15000, image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&q=80", category: "Moteur", stock: 18 },
  { id: "6", name: "Courroie de distribution", price: 35000, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80", category: "Moteur", stock: 5 },
];

export const categories = [
  { label: "Berlines", icon: "🚗", count: 24 },
  { label: "SUV / 4x4", icon: "🚙", count: 18 },
  { label: "Pick-up", icon: "🛻", count: 9 },
  { label: "Utilitaires", icon: "🚐", count: 6 },
];
