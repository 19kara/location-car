import { Link } from "react-router-dom";
import { Search, ArrowRight, Shield, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion"; // Import de Framer Motion
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/VehicleCard";
import { PartCard } from "@/components/PartCard";
import { vehicles, parts, categories } from "@/data/mockData";
import heroImage from "@/assets/hero-parking.jpg";

// Variantes d'animation pour les conteneurs (Stagger effect)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Délai entre chaque enfant
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Index = () => {
  return (
    <div className="pb-20 md:pb-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={heroImage} alt="Parking automobile Lomé" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-r from-black/80 to-transparent" />
        </motion.div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4"
            >
              🇹🇬 N°1 au Togo
            </motion.span>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4"
            >
              Votre parking automobile de <span className="text-secondary">confiance</span> à Lomé
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-white/80 text-lg mb-8 max-w-lg"
            >
              Achetez, louez ou réservez votre véhicule en quelques clics.
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un modèle (ex: Toyota Rav4)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-black focus:ring-2 focus:ring-secondary outline-none shadow-xl"
                />
              </div>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-lg">
                Rechercher
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.label} variants={itemVariants}>
              <Link
                to="/vehicules"
                className="bg-card rounded-2xl p-6 shadow-xl hover:shadow-2xl border border-border/50 transition-all duration-300 text-center group flex flex-col items-center justify-center h-full"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  {cat.icon}
                </span>
                <p className="font-bold text-foreground">{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat.count} annonces</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Vehicles */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Véhicules populaires</h2>
            <div className="h-1 w-20 bg-secondary mt-2 rounded-full" />
          </div>
          <Link to="/vehicules" className="group text-primary font-bold flex items-center gap-1">
            Tout voir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {vehicles.slice(0, 6).map((v) => (
            <motion.div key={v.id} variants={itemVariants}>
              <VehicleCard vehicle={v} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust / Reassurance */}
      <section className="bg-slate-50 py-16 mt-20">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Shield, title: "Véhicules vérifiés", desc: "Expertise technique complète avant mise en vente", color: "bg-blue-100 text-blue-600" },
              { icon: CreditCard, title: "Paiement sécurisé", desc: "Payez via T-Money, Flooz ou virement bancaire", color: "bg-green-100 text-green-600" },
              { icon: Truck, title: "Service Livraison", desc: "Nous livrons vos pièces détachées à Lomé et partout au Togo", color: "bg-orange-100 text-orange-600" },
            ].map((item) => (
              <motion.div 
                key={item.title} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-4 transition-transform group-hover:rotate-6`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;