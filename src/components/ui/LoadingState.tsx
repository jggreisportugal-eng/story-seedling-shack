import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "A preparar o seu conto…" }: LoadingStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <div className="rounded-full bg-amber/10 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-amber" />
      </div>
      <p className="font-body font-medium text-muted-foreground">{message}</p>
    </motion.div>
  );
};

export default LoadingState;
