import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Play, Pause, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { STORY_THEMES, ThirtyDayModeState, PLAN_MESSAGES } from "@/types/plans";

interface ThirtyDayModeCardProps {
  isPremium: boolean;
  thirtyDayState: ThirtyDayModeState | null;
  onStart: (theme: string) => void;
  onStop: () => void;
}

const ThirtyDayModeCard = ({
  isPremium,
  thirtyDayState,
  onStart,
  onStop,
}: ThirtyDayModeCardProps) => {
  const [selectedTheme, setSelectedTheme] = useState("romance");

  if (!isPremium) {
    return (
      <Card className="border-2 border-dashed border-muted bg-muted/10">
        <CardHeader>
          <CardTitle className="font-display text-lg font-bold text-muted-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            30 Dias de Contos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {PLAN_MESSAGES.THIRTY_DAY_PREMIUM_ONLY}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (thirtyDayState?.isActive) {
    const progress = ((thirtyDayState.currentDay - 1) / 30) * 100;
    const themeLabel = STORY_THEMES.general.find(t => t.id === thirtyDayState.mainTheme)?.label || thirtyDayState.mainTheme;

    return (
      <Card className="border-2 border-amber/30 bg-gradient-to-br from-amber/5 to-amber/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber" />
              30 Dias de Contos
            </CardTitle>
            <Badge className="bg-amber text-amber-foreground font-semibold">
              Ativo
            </Badge>
          </div>
          <CardDescription className="text-muted-foreground">
            Tema: <span className="font-semibold text-foreground">{themeLabel}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Dia {thirtyDayState.currentDay} de 30
              </span>
              <span className="text-sm font-bold text-amber">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-amber" />
            <span>{thirtyDayState.storiesGenerated.length} contos gerados</span>
          </div>

          <Button
            onClick={onStop}
            variant="outline"
            className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Pause className="h-4 w-4" />
            Parar modo 30 dias
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber" />
          30 Dias de Contos
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Receba um conto novo todos os dias durante 30 dias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Escolha o tema principal
          </Label>
          <RadioGroup
            value={selectedTheme}
            onValueChange={setSelectedTheme}
            className="grid grid-cols-2 gap-2"
          >
            {STORY_THEMES.general.map((theme) => (
              <div key={theme.id} className="flex items-center space-x-2">
                <RadioGroupItem value={theme.id} id={`thirty-${theme.id}`} />
                <Label
                  htmlFor={`thirty-${theme.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {theme.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onStart(selectedTheme)}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          >
            <Play className="h-4 w-4" />
            Iniciar 30 Dias de Contos
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ThirtyDayModeCard;
