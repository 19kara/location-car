import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Animations
import { Mail, Lock, User, Phone, Eye, EyeOff, Smartphone, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  
  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  // Si l'utilisateur est déjà connecté, on le redirige vers l'accueil
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Validation du téléphone Togolais
  const validateTGPhone = (num: string) => {
    const clean = num.replace(/\s/g, "");
    return clean.length >= 8; 
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const { error } = await signIn(loginEmail, loginPassword, true);
      if (error) throw error;
      toast.success("Heureux de vous revoir !");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, password } = signupData;

    if (!name || !email || !password) {
      toast.error("Veuillez remplir les champs obligatoires (*)");
      return;
    }

    if (!validateTGPhone(phone)) {
      toast.error("Le numéro de téléphone semble invalide");
      return;
    }

    setLoading(true);
    try {
      // On force la redirection vers localhost:8081 explicitement ici
      const { error } = await signUp(email, password, name, phone);
      
      if (error) throw error;

      toast.success("Compte créé ! Vérifiez votre boîte mail.", {
        description: "Un lien de confirmation vous a été envoyé.",
        duration: 5000,
      });
      setTab("login");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Cercles décoratifs en arrière-plan */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      {/* Bouton Retour */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-semibold text-sm">
        <ArrowLeft className="w-4 h-4" />
        Retour au site
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/30 rotate-3">
            <span className="text-white font-black text-4xl -rotate-3">P</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Parking<span className="text-primary">Togo</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span>Plateforme N°1 au Togo</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-8 md:p-10">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-10 p-1.5 bg-slate-100 rounded-2xl">
              <TabsTrigger value="login" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Connexion</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-xl py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Inscription</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="login">
                <motion.form 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleLogin} 
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 ml-1">VOTRE EMAIL</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 ml-1">MOT DE PASSE</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Checkbox id="rem" />
                      <Label htmlFor="rem" className="text-xs text-slate-500 cursor-pointer">Se souvenir de moi</Label>
                    </div>
                    <button type="button" className="text-xs text-primary font-bold hover:underline">Oublié ?</button>
                  </div>

                  <Button type="submit" className="w-full py-7 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                  </Button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <span className="bg-white px-4">Paiement Partenaire</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant="outline" className="h-14 rounded-xl border-slate-200 hover:bg-slate-50 gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" /> Flooz
                    </Button>
                    <Button type="button" variant="outline" className="h-14 rounded-xl border-slate-200 hover:bg-slate-50 gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary" /> T-Money
                    </Button>
                  </div>
                </motion.form>
              </TabsContent>

              <TabsContent value="signup">
                <motion.form 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSignup} 
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Nom complet *"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Adresse email *"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className={inputClass}
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="Téléphone (ex: 90 00 00 00)"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      className={inputClass}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Mot de passe (min. 6 car.) *"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className={inputClass}
                    />
                  </div>

                  <Button type="submit" className="w-full py-7 rounded-2xl text-lg font-bold mt-4" disabled={loading}>
                    {loading ? "Création..." : "Créer mon compte"}
                  </Button>
                  
                  <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
                    En cliquant, vous acceptez les conditions de <span className="font-bold">ParkingTogo</span>.
                  </p>
                </motion.form>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
        
        <p className="text-center mt-10 text-slate-400 text-xs font-medium">
          © {new Date().getFullYear()} — Maestro Technology Lomé
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;