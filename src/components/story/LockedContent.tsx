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
      <Card className="border-dashed bg-muted/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-muted p-4">
            <LockKeyhole className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="font-display">{title}</CardTitle>
          <CardDescription className="font-body">{description}</CardDescription>
        </CardHeader>
        {showButton && onUnlock && (
          <CardContent className="text-center">
            <Button
              onClick={onUnlock}
              className="gap-2 bg-amber text-amber-foreground hover:bg-amber/90"
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
