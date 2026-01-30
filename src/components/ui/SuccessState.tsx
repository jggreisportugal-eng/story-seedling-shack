import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessStateProps {
  title?: string;
  message?: string;
}

const SuccessState = ({
  title = "Sucesso!",
  message = "A operação foi concluída com êxito.",
}: SuccessStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="rounded-full bg-amber/10 p-3"
      >
        <CheckCircle className="h-8 w-8 text-amber" />
      </motion.div>
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="font-body text-sm text-muted-foreground">{message}</p>
      </div>
    </motion.div>
  );
};

export default SuccessState;
