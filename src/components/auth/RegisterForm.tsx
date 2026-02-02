import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import { Gender } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthContext();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !gender || !birthDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Palavra-passe fraca",
        description: "A palavra-passe deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const result = await signUp(
      email,
      password,
      gender as Gender,
      birthDate.toISOString()
    );

    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo! Vamos escolher os seus géneros favoritos.",
      });
      navigate("/selecionar-contos");
    } else {
      toast({
        title: "Erro no registo",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Calculate max date (must be 18+ years old)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

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
            Criar a sua conta
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Preencha os dados para começar a ler
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
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
                  minLength={6}
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

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="font-body font-medium text-foreground">
                Género
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
                  <SelectTrigger className="pl-10 bg-background border-border focus:border-amber focus:ring-amber">
                    <SelectValue placeholder="Selecione o seu género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Ajuda-nos a personalizar as suas recomendações
              </p>
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="font-body font-medium text-foreground">
                Data de nascimento
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal pl-10 bg-background border-border",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    {birthDate ? (
                      format(birthDate, "d 'de' MMMM 'de' yyyy", { locale: pt })
                    ) : (
                      <span>Selecione a sua data de nascimento</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    disabled={(date) => date > maxDate || date < new Date("1900-01-01")}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={maxDate.getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Tem de ter pelo menos 18 anos para se registar
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber text-amber-foreground font-semibold hover:bg-amber/90 shadow-md shadow-amber/20"
              disabled={isLoading}
            >
              {isLoading ? "A criar conta..." : "Criar conta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
