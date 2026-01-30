import { LockKeyhole, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface StoryCardProps {
  title: string;
  excerpt?: string;
  day: number;
  totalDays: number;
  isAvailable: boolean;
  isToday?: boolean;
  onClick?: () => void;
}

const StoryCard = ({
  title,
  excerpt,
  day,
  totalDays,
  isAvailable,
  isToday = false,
  onClick,
}: StoryCardProps) => {
  const progress = (day / totalDays) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isAvailable ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden transition-all ${
          isToday
            ? "border-amber bg-gradient-to-br from-amber/5 to-amber/10 shadow-lg"
            : isAvailable
            ? "cursor-pointer hover:border-amber/50 hover:shadow-md"
            : "opacity-75"
        }`}
        onClick={isAvailable ? onClick : undefined}
      >
        {isToday && (
          <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-lg bg-amber px-3 py-1">
            <Sparkles className="h-3 w-3 text-amber-foreground" />
            <span className="text-xs font-medium text-amber-foreground">Conto do dia</span>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Dia {day} de {totalDays}</span>
          </div>
          <CardTitle className="font-display text-xl">{title}</CardTitle>
          {excerpt && (
            <CardDescription className="line-clamp-2 font-body">
              {excerpt}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <Progress value={progress} className="h-1.5" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Progresso: {Math.round(progress)}%
              </span>
              {isAvailable ? (
                <Button size="sm" className="bg-amber text-amber-foreground hover:bg-amber/90">
                  Ler agora
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <LockKeyhole className="h-3 w-3" />
                  <span>Disponível em breve</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StoryCard;
