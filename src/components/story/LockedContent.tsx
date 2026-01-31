import { LockKeyhole, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LockedContentProps {
  type: "daily-limit" | "future" | "premium";
  onUnlock?: () => void;
}

const LockedContent = ({ type, onUnlock }: LockedContentProps) => {
  const content = {
    "daily-limit": {
      title: "Limite diário atingido",
      description: "Já leu o conto de hoje. Volte amanhã para descobrir uma nova história.",
      showButton: true,
      buttonText: "Desbloquear todos os contos",
    },
    future: {
      title: "Este conto ainda não está disponível",
      description: "Esta história será desbloqueada na data prevista. Aguarde mais um pouco.",
      showButton: false,
      buttonText: "",
    },
    premium: {
      title: "Conteúdo exclusivo",
      description: "Este conto faz parte da coleção premium. Desbloqueie para aceder a todas as histórias.",
      showButton: true,
      buttonText: "Desbloquear agora",
    },
  };

  const { title, description, showButton, buttonText } = content[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-dashed border-muted bg-muted/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-muted p-4">
            <LockKeyhole className="h-8 w-8 text-foreground" />
          </div>
          <CardTitle className="font-display font-bold text-foreground">{title}</CardTitle>
          <CardDescription className="font-body text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        {showButton && onUnlock && (
          <CardContent className="text-center">
            <Button
              onClick={onUnlock}
              className="gap-2 bg-amber text-amber-foreground font-semibold hover:bg-amber/90 shadow-md shadow-amber/20"
            >
              <Unlock className="h-4 w-4" />
              {buttonText}
            </Button>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default LockedContent;
