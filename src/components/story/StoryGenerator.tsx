import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { STORY_THEMES, PLAN_MESSAGES } from "@/types/plans";

interface StoryGeneratorProps {
  onGenerate: (theme: string, isAdultContent: boolean) => Promise<void>;
  isGenerating: boolean;
  canGenerate: boolean;
  isPremium: boolean;
  remainingStories: number;
}

const StoryGenerator = ({
  onGenerate,
  isGenerating,
  canGenerate,
  isPremium,
  remainingStories,
}: StoryGeneratorProps) => {
  const [selectedTheme, setSelectedTheme] = useState("romance");

  const allThemes = [
    ...STORY_THEMES.general,
    ...(isPremium ? STORY_THEMES.adult : []),
  ];

  const selectedThemeData = allThemes.find((t) => t.id === selectedTheme);
  const isAdultContent = STORY_THEMES.adult.some((t) => t.id === selectedTheme);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    await onGenerate(selectedTheme, isAdultContent);
  };

  return (
    <Card className="border-2 border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-amber" />
          Gerar novo conto
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Escolha um tema e deixe a magia acontecer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">
            Tema do conto
          </Label>
          <RadioGroup
            value={selectedTheme}
            onValueChange={setSelectedTheme}
            className="grid grid-cols-2 gap-2"
          >
            {STORY_THEMES.general.map((theme) => (
              <div key={theme.id} className="flex items-center space-x-2">
                <RadioGroupItem value={theme.id} id={theme.id} />
                <Label
                  htmlFor={theme.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {theme.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Adult themes - Premium only */}
          {isPremium && (
            <div className="pt-3 border-t border-border">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Conteúdo adulto (+18)
              </Label>
              <RadioGroup
                value={selectedTheme}
                onValueChange={setSelectedTheme}
                className="grid grid-cols-2 gap-2"
              >
                {STORY_THEMES.adult.map((theme) => (
                  <div key={theme.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={theme.id} id={theme.id} />
                    <Label
                      htmlFor={theme.id}
                      className="text-sm font-medium cursor-pointer text-amber"
                    >
                      {theme.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Adult content notice for free users */}
          {!isPremium && (
            <p className="text-xs text-muted-foreground italic">
              {PLAN_MESSAGES.EROTIC_PREMIUM_ONLY}
            </p>
          )}
        </div>

        {/* Generate Button */}
        <motion.div
          whileHover={{ scale: canGenerate ? 1.02 : 1 }}
          whileTap={{ scale: canGenerate ? 0.98 : 1 }}
        >
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full gap-2 bg-amber text-amber-foreground hover:bg-amber/90 font-bold shadow-lg shadow-amber/25 disabled:opacity-50"
            size="lg"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                A gerar o seu conto...
              </>
            ) : !canGenerate ? (
              <>
                <AlertCircle className="h-5 w-5" />
                Limite atingido
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Gerar conto de {selectedThemeData?.label || "Romance"}
              </>
            )}
          </Button>
        </motion.div>

        {/* Remaining stories info */}
        {!isPremium && canGenerate && (
          <p className="text-center text-xs text-muted-foreground">
            {remainingStories} {remainingStories === 1 ? "conto restante" : "contos restantes"} este mês
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StoryGenerator;
