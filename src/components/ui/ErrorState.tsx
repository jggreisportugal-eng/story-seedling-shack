import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = "Algo correu mal",
  message = "Não foi possível carregar o conteúdo. Por favor, tente novamente.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
        <p className="font-body text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-2 gap-2 border-2 border-border font-semibold hover:border-amber hover:text-amber"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;
