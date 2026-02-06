import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Sparkles,
  Infinity,
  Calendar,
  Flame,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface PremiumUpgradeBannerProps {
  onUpgrade: () => void;
}

const PremiumUpgradeBanner = ({ onUpgrade }: PremiumUpgradeBannerProps) => {
  const benefits = [
    {
      icon: Infinity,
      title: "Contos Ilimitados",
      description: "Gere quantos contos quiser, sem limites mensais"
    },
    {
      icon: Flame,
      title: "Conteúdo Adulto",
      description: "Acesso a contos eróticos e romance adulto (+18)"
    },
    {
      icon: Calendar,
      title: "Modo 30 Dias",
      description: "Um conto novo todos os dias durante 30 dias"
    },
  ];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="border-2 border-amber/30 bg-gradient-to-br from-amber/5 via-amber/10 to-amber/5 overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Crown Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber shadow-lg shadow-amber/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Crown className="h-8 w-8 text-amber-foreground" />
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Torne-se Premium
              </h3>
              <p className="text-muted-foreground font-body max-w-md">
                Desbloqueie todo o potencial dos Contos Diários
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="flex flex-col items-center p-4 rounded-lg bg-background/50 border border-border/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center mb-3">
                    <benefit.icon className="h-5 w-5 text-amber" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col items-center space-y-3 pt-2">
              <Button
                onClick={onUpgrade}
                size="lg"
                className="group w-full md:w-auto px-8 bg-amber text-amber-foreground font-bold hover:bg-amber/90 shadow-lg shadow-amber/30"
              >
                <Crown className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Fazer Upgrade para Premium
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Badge variant="outline" className="border-amber/50 text-amber font-semibold px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Oferta Especial
              </Badge>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-amber" />
                Cancele quando quiser • Sem compromisso
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PremiumUpgradeBanner;
