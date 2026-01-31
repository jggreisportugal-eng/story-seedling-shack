import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_MESSAGES } from "@/types/plans";

interface PlanLimitBannerProps {
  remainingStories: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

const PlanLimitBanner = ({ remainingStories, isPremium, onUpgrade }: PlanLimitBannerProps) => {
  if (isPremium) {
    return (
      <Card className="border-amber/30 bg-gradient-to-r from-amber/5 to-amber/10">
        <CardContent className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber" />
            <span className="text-sm font-medium text-foreground">Plano Premium</span>
          </div>
          <Badge className="bg-amber text-amber-foreground font-semibold">
            Ilimitado
          </Badge>
        </CardContent>
      </Card>
    );
  }

  const isLimitReached = remainingStories <= 0;

  return (
    <Card className={`border-2 ${isLimitReached ? "border-destructive/50 bg-destructive/5" : "border-border bg-muted/30"}`}>
      <CardContent className="py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            {isLimitReached ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {isLimitReached 
                  ? "Limite atingido" 
                  : `Plano Gratuito`
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {isLimitReached 
                  ? PLAN_MESSAGES.FREE_LIMIT_REACHED
                  : `${remainingStories} ${remainingStories === 1 ? "conto restante" : "contos restantes"} este mês`
                }
              </p>
            </div>
          </div>
          <Button
            onClick={onUpgrade}
            size="sm"
            className="bg-amber text-amber-foreground hover:bg-amber/90 font-semibold shadow-md shadow-amber/20"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            {PLAN_MESSAGES.UPGRADE_CTA}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanLimitBanner;
