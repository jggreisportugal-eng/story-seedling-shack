import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface UpsellModalProps {
  open: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const UpsellModal = ({ open, onClose, onPurchase }: UpsellModalProps) => {
  const benefits = [
    "Acesso a todos os 30 contos do mês",
    "Leitura ilimitada, sem esperas",
    "Novos contos exclusivos todas as semanas",
    "Histórias cuidadosamente selecionadas",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-gradient-to-br from-amber to-amber/80 p-4">
            <Sparkles className="h-8 w-8 text-amber-foreground" />
          </div>
          <DialogTitle className="font-display text-2xl">
            Desbloqueie todos os contos deste mês
          </DialogTitle>
          <DialogDescription className="font-body">
            Não espere mais. Mergulhe em histórias envolventes todos os dias.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="rounded-full bg-amber/10 p-1">
                <Check className="h-4 w-4 text-amber" />
              </div>
              <span className="font-body text-sm">{benefit}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button
            onClick={onPurchase}
            size="lg"
            className="w-full bg-amber text-amber-foreground hover:bg-amber/90"
          >
            Desbloquear agora
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Talvez mais tarde
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsellModal;
