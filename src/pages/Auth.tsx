import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular autenticação (será substituído por Supabase)
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isLogin ? "Bem-vindo de volta!" : "Conta criada com sucesso!",
        description: isLogin 
          ? "A redirecionar para a sua área pessoal..." 
          : "Pode agora aceder à sua conta.",
      });
    }, 1500);
  };

  return (
    <PageContainer>
      <div className="flex min-h-screen flex-col bg-primary">
        {/* Secção superior com fundo azul-noite */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Logo variant="light" size="lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 bg-card shadow-2xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="font-display text-2xl font-bold text-foreground">
                  {isLogin ? "Bem-vindo de volta" : "Criar a sua conta"}
                </CardTitle>
                <CardDescription className="font-body text-muted-foreground">
                  {isLogin 
                    ? "Entre para aceder às suas histórias" 
                    : "Preencha os dados para começar a ler"}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-body font-medium text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="o.seu@email.pt"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background border-border focus:border-amber focus:ring-amber"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-body font-medium text-foreground">
                      Palavra-passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
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
                    {isLoading 
                      ? "A processar..." 
                      : isLogin ? "Entrar" : "Criar conta"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? "Ainda não tem conta?" : "Já tem uma conta?"}
                    {" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-semibold text-amber hover:underline"
                    >
                      {isLogin ? "Criar conta" : "Entrar"}
                    </button>
                  </p>
                </div>

                {isLogin && (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    O acesso está disponível apenas para utilizadores com compra ativa
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/"
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              ← Voltar à página inicial
            </Link>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Auth;
