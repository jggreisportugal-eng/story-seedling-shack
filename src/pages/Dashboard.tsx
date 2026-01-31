import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, History, User, LogOut, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";
import StoryCard from "@/components/story/StoryCard";
import StoryGenerator from "@/components/story/StoryGenerator";
import ThirtyDayModeCard from "@/components/story/ThirtyDayModeCard";
import PlanLimitBanner from "@/components/plan/PlanLimitBanner";
import UpsellModal from "@/components/modals/UpsellModal";
import { usePlan } from "@/contexts/PlanContext";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName] = useState("Maria");
  const [showUpsell, setShowUpsell] = useState(false);
  
  const {
    isPremium,
    getRemainingStories,
    upgradeToPremium,
  } = usePlan();

  const {
    isGenerating,
    generateStory,
    getStoredStories,
    startThirtyDayMode,
    stopThirtyDayMode,
    getThirtyDayModeState,
    canGenerateStory,
    remainingStories,
  } = useStoryGeneration();

  const thirtyDayState = getThirtyDayModeState();
  const storedStories = getStoredStories();

  // Calculate progress for 30-day mode
  const currentDay = thirtyDayState?.currentDay || 1;
  const totalDays = 30;
  const progress = thirtyDayState?.isActive ? ((currentDay - 1) / totalDays) * 100 : 0;

  // Sample stories (will be replaced with generated ones)
  const sampleStories = [
    {
      id: 1,
      title: "O Segredo do Farol",
      excerpt: "Numa noite de tempestade, a velha guardiã do farol descobre uma carta que mudará tudo...",
      day: 12,
      isAvailable: true,
      isToday: true,
    },
    {
      id: 2,
      title: "Cartas ao Desconhecido",
      excerpt: "Durante anos, ela escreveu cartas que nunca enviou. Até que um dia...",
      day: 11,
      isAvailable: true,
      isToday: false,
    },
  ];

  const handleGenerateStory = async (theme: string, isAdultContent: boolean) => {
    await generateStory(theme, isAdultContent);
  };

  const handleUpgrade = () => {
    setShowUpsell(true);
  };

  const handlePurchase = () => {
    // Simulate upgrade (in production, this would integrate with Hotmart)
    upgradeToPremium();
    setShowUpsell(false);
  };

  return (
    <PageContainer>
      {/* Header - Fundo azul-noite */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Logo variant="light" size="sm" />
          
          <nav className="flex items-center gap-1">
            <Link to="/historico">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Histórico</span>
              </Button>
            </Link>
            <Link to="/perfil">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 space-y-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground">
            Olá, {userName}
          </h1>
          <p className="mt-1 font-body text-muted-foreground">
            Pronta para mais uma história envolvente?
          </p>
        </motion.div>

        {/* Plan Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PlanLimitBanner
            remainingStories={remainingStories}
            isPremium={isPremium}
            onUpgrade={handleUpgrade}
          />
        </motion.div>

        {/* 30-Day Mode Progress (if active) */}
        {thirtyDayState?.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-lg border-2 border-amber/20 bg-gradient-to-r from-amber/5 to-amber/10 p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-amber p-2">
                <BookOpen className="h-5 w-5 text-amber-foreground" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">O seu progresso</p>
                <p className="text-sm text-muted-foreground">
                  Dia {currentDay} de {totalDays}
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-right text-xs font-medium text-amber">
              {Math.round(progress)}% concluído
            </p>
          </motion.div>
        )}

        {/* Story Generator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StoryGenerator
            onGenerate={handleGenerateStory}
            isGenerating={isGenerating}
            canGenerate={canGenerateStory}
            isPremium={isPremium}
            remainingStories={remainingStories}
          />
        </motion.div>

        {/* 30-Day Mode Card (for Premium) */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <ThirtyDayModeCard
              isPremium={isPremium}
              thirtyDayState={thirtyDayState}
              onStart={startThirtyDayMode}
              onStop={stopThirtyDayMode}
            />
          </motion.div>
        )}

        {/* Stories */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground">Os seus contos</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sampleStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <StoryCard
                  title={story.title}
                  excerpt={story.excerpt}
                  day={story.day}
                  totalDays={totalDays}
                  isAvailable={story.isAvailable}
                  isToday={story.isToday}
                  onClick={() => {
                    if (story.isAvailable) {
                      navigate(`/conto/${story.id}`);
                    }
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Upsell Modal */}
      <UpsellModal
        open={showUpsell}
        onClose={() => setShowUpsell(false)}
        onPurchase={handlePurchase}
      />
    </PageContainer>
  );
};

export default Dashboard;
