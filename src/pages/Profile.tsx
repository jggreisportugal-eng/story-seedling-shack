import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, CheckCircle, Sparkles, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";
import { usePlan } from "@/contexts/PlanContext";
import { PLAN_CONFIG, PLAN_MESSAGES } from "@/types/plans";

const Profile = () => {
  const { userPlan, isPremium, getRemainingStories, upgradeToPremium } = usePlan();
  
  const [user] = useState({
    name: "Maria Santos",
    email: "maria.santos@email.pt",
    isAdultConfirmed: true,
  });

  const handleLogout = () => {
    // Será implementado com Supabase
    console.log("Terminar sessão");
  };

  return (
    <PageContainer>
      {/* Header - Fundo azul-noite */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/dashboard">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              ← Voltar
            </Button>
          </Link>
          <Logo variant="light" size="sm" />
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-lg px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber">
              <User className="h-10 w-10 text-amber-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Profile Details */}
          <Card className="border-2 border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg font-bold text-foreground">
                Dados da conta
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Informações da sua conta e subscrição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Mail className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Subscription */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  {isPremium ? (
                    <Crown className="h-4 w-4 text-amber" />
                  ) : (
                    <Shield className="h-4 w-4 text-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Plano</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={isPremium ? "bg-amber text-amber-foreground font-semibold" : "bg-muted text-muted-foreground font-semibold"}>
                      {isPremium ? "Premium" : "Gratuito"}
                    </Badge>
                    {!isPremium && (
                      <span className="text-xs text-muted-foreground">
                        {getRemainingStories()} contos restantes este mês
                      </span>
                    )}
                  </div>
                </div>
                {!isPremium && (
                  <Button
                    onClick={upgradeToPremium}
                    size="sm"
                    className="bg-amber text-amber-foreground hover:bg-amber/90 font-semibold"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Upgrade
                  </Button>
                )}
              </div>

              <Separator className="bg-border" />

              {/* Age Confirmation */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <CheckCircle className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Confirmação de maioridade</p>
                  <p className="text-sm text-muted-foreground">
                    {user.isAdultConfirmed ? "Confirmado" : "Não confirmado"}
                  </p>
                </div>
                {user.isAdultConfirmed && (
                  <CheckCircle className="h-5 w-5 text-amber" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Terminar sessão
          </Button>
        </motion.div>
      </main>
    </PageContainer>
  );
};

export default Profile;
