import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, LogOut, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";

const Profile = () => {
  const [user] = useState({
    name: "Maria Santos",
    email: "maria.santos@email.pt",
    isAdultConfirmed: true,
    subscriptionStatus: "active",
    subscriptionEnd: "2024-03-15",
  });

  const handleLogout = () => {
    // Será implementado com Supabase
    console.log("Terminar sessão");
  };

  return (
    <PageContainer>
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              ← Voltar
            </Button>
          </Link>
          <Logo size="sm" />
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
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber/10">
              <User className="h-10 w-10 text-amber" />
            </div>
            <h1 className="font-display text-2xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Dados da conta</CardTitle>
              <CardDescription>Informações da sua conta e subscrição</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator />

              {/* Subscription */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Estado da subscrição</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-amber/10 text-amber hover:bg-amber/20">
                      Ativa
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      até {new Date(user.subscriptionEnd).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Age Confirmation */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Confirmação de maioridade</p>
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
            className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
