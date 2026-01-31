import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdultContentWarningProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AdultContentWarning = ({ open, onConfirm, onCancel }: AdultContentWarningProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-2 border-border">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 rounded-full bg-amber/10 p-4">
            <AlertTriangle className="h-6 w-6 text-amber" />
          </div>
          <AlertDialogTitle className="text-center font-display font-bold text-foreground">
            Aviso de conteúdo +18
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center font-body text-muted-foreground">
            Este conto contém conteúdo destinado a adultos. Ao continuar, confirma que tem mais de 18 anos e deseja aceder a este conteúdo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel 
            onClick={onCancel}
            className="border-2 border-border font-semibold hover:border-muted-foreground"
          >
            Voltar atrás
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-amber text-amber-foreground font-semibold hover:bg-amber/90 shadow-md shadow-amber/20"
          >
            Confirmo que sou maior de 18
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdultContentWarning;
