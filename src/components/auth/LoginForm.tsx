import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, preferences } = useAuthContext();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const result = await signIn(email, password);

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Bem-vindo de volta!",
        description: "A redirecionar para a sua área pessoal...",
      });
      
      // Check if master password was used
      const masterAuth = localStorage.getItem("contos-diarios-master-auth");
      if (masterAuth) {
        // Master auth always goes to dashboard (has mock preferences)
        navigate("/dashboard");
      } else if (preferences && preferences.selected_genres.length > 0) {
        navigate("/dashboard");
      } else {
        navigate("/selecionar-contos");
      }
    } else {
      toast({
        title: "Erro no login",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full max-w-md"
    >
      <Card className="border-0 bg-card shadow-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-display text-2xl font-bold text-foreground">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Entre para aceder às suas histórias
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="login-email" className="font-body font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="o.seu@email.pt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-amber focus:ring-amber"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="login-password" className="font-body font-medium text-foreground">
                Palavra-passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background border-border focus:border-amber focus:ring-amber"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber text-amber-foreground font-semibold hover:bg-amber/90 shadow-md shadow-amber/20"
              disabled={isLoading}
            >
              {isLoading ? "A processar..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            O acesso está disponível apenas para utilizadores com compra ativa
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
