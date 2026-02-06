import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageContainer from "@/components/layout/PageContainer";
import Logo from "@/components/ui/Logo";
import AdultContentWarning from "@/components/modals/AdultContentWarning";
import { useAuthContext } from "@/contexts/AuthContext";
import { getStoryById } from "@/data/stories";
import { useStoryGeneration } from "@/hooks/useStoryGeneration";

const StoryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdult } = useAuthContext();
  const { getStoredStories } = useStoryGeneration();
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  const [hasConfirmedAge, setHasConfirmedAge] = useState(false);

  // Parse story ID
  const storyId = id || "sample-1";

  // Buscar o conto: primeiro nos gerados, depois nos mockados
  const storyData = useMemo(() => {
    // 1. Buscar nos contos gerados (localStorage)
    const generatedStories = getStoredStories();
    const generatedStory = generatedStories.find(s => s.id === storyId);
    
    if (generatedStory) {
      return {
        ...generatedStory,
        day: generatedStory.day || 1,
        genre: generatedStory.theme || "geral",
      };
    }
    
    // 2. Se não encontrar, buscar nos mockados
    return getStoryById(storyId);
  }, [storyId, getStoredStories]);

  // Se não encontrar o conto, redirecionar para o dashboard
  useEffect(() => {
    if (!storyData) {
      navigate("/dashboard");
    }
  }, [storyData, navigate]);

  if (!storyData) {
    return null;
  }

  // Determinar se é conteúdo adulto
  const isEroticContent = storyData.isAdultContent;

  const story = {
    ...storyData,
  };

  const handleConfirmAge = () => {
    setHasConfirmedAge(true);
    setShowAdultWarning(false);
  };

  // Verificar se precisa de confirmação de idade - APENAS para conteúdo erótico
  if (isEroticContent && !isAdult && !hasConfirmedAge) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center p-4">
          <AdultContentWarning
            open={true}
            onConfirm={handleConfirmAge}
            onCancel={() => navigate(-1)}
          />
        </div>
      </PageContainer>
    );
  }


  return (
    <PageContainer>
      {/* Header - Fundo azul-noite */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="container flex h-14 items-center justify-between px-4">
          <Link to="/dashboard">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          
          <Logo variant="light" size="sm" />
          
          <div className="w-20" /> {/* Spacer para centrar o logo */}
        </div>
      </header>

      {/* Story Content */}
      <main className="container max-w-2xl px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Meta info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Dia {story.day} de 30</span>
            {story.isAdultContent && (
              <Badge className="gap-1 bg-amber/10 text-amber border-amber/50 font-semibold">
                <AlertTriangle className="h-3 w-3" />
                +18
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {story.title}
          </h1>

          {/* Separator */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <div className="h-2 w-2 rounded-full bg-amber" />
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Story text */}
          <div className="prose-story text-foreground">
            {story.content.split('\n\n').map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="mb-6 leading-relaxed"
              >
                {paragraph.trim()}
              </motion.p>
            ))}
          </div>

          {/* Navigation - Apenas voltar ao Dashboard */}
          <div className="flex justify-center pt-8 border-t-2 border-border">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="gap-2 bg-amber text-amber-foreground hover:bg-amber/90 font-semibold shadow-md shadow-amber/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </div>
        </motion.article>
      </main>
    </PageContainer>
  );
};

export default StoryReader;
