import { useState, useCallback } from "react";
import { Story, ThirtyDayModeState, PLAN_MESSAGES } from "@/types/plans";
import { usePlanState } from "./usePlanState";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

// Funções para gerar chaves únicas por utilizador
const getStoriesStorageKey = (userId: string | undefined) => {
  if (!userId) return "contos-diarios-stories-guest";
  return `contos-diarios-stories-${userId}`;
};

const getThirtyDayStorageKey = (userId: string | undefined) => {
  if (!userId) return "contos-diarios-thirty-day-mode-guest";
  return `contos-diarios-thirty-day-mode-${userId}`;
};

// Generate unique ID
const generateId = () => `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useStoryGeneration = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const userId = user?.id;

  const STORIES_STORAGE_KEY = getStoriesStorageKey(userId);
  const THIRTY_DAY_STORAGE_KEY = getThirtyDayStorageKey(userId);

  const {
    userPlan,
    isPremium,
    canGenerateStory,
    getRemainingStories,
    canAccessEroticContent,
    canAccessThirtyDayMode,
    incrementStoryCount,
  } = usePlanState(userId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  // Get stored stories
  const getStoredStories = useCallback((): Story[] => {
    const stored = localStorage.getItem(STORIES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }, [STORIES_STORAGE_KEY]);

  // Save story to storage
  const saveStory = useCallback((story: Story) => {
    const stories = getStoredStories();
    stories.unshift(story);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories.slice(0, 100)));
  }, [getStoredStories, STORIES_STORAGE_KEY]);

  // Get 30-day mode state
  const getThirtyDayModeState = useCallback((): ThirtyDayModeState | null => {
    const stored = localStorage.getItem(THIRTY_DAY_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }, [THIRTY_DAY_STORAGE_KEY]);

  // Save 30-day mode state
  const saveThirtyDayModeState = useCallback((state: ThirtyDayModeState | null) => {
    if (state) {
      localStorage.setItem(THIRTY_DAY_STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(THIRTY_DAY_STORAGE_KEY);
    }
  }, [THIRTY_DAY_STORAGE_KEY]);

  // Start 30-day mode
  const startThirtyDayMode = useCallback((mainTheme: string): boolean => {
    if (!canAccessThirtyDayMode()) {
      toast({
        title: "Acesso restrito",
        description: PLAN_MESSAGES.THIRTY_DAY_PREMIUM_ONLY,
        variant: "destructive",
      });
      return false;
    }

    const newState: ThirtyDayModeState = {
      isActive: true,
      startDate: new Date().toISOString().split("T")[0],
      currentDay: 1,
      mainTheme,
      storiesGenerated: [],
    };

    saveThirtyDayModeState(newState);
    toast({
      title: "30 Dias de Contos ativado!",
      description: `O seu tema principal: ${mainTheme}. O primeiro conto está a ser preparado.`,
    });
    return true;
  }, [canAccessThirtyDayMode, saveThirtyDayModeState, toast]);

  // Stop 30-day mode
  const stopThirtyDayMode = useCallback(() => {
    saveThirtyDayModeState(null);
    toast({
      title: "Modo desativado",
      description: "O modo '30 Dias de Contos' foi desativado.",
    });
  }, [saveThirtyDayModeState, toast]);

  // ✅ CORRIGIDO: Generate a story chamando a Edge Function rapid-responder
  const generateStory = useCallback(async (theme: string, isAdultContent: boolean = false): Promise<Story | null> => {
    // Check if adult content is allowed
    if (isAdultContent && !canAccessEroticContent()) {
      toast({
        title: "Conteúdo restrito",
        description: PLAN_MESSAGES.EROTIC_PREMIUM_ONLY,
        variant: "destructive",
      });
      return null;
    }

    // Check story limit for free users
    if (!canGenerateStory()) {
      toast({
        title: "Limite atingido",
        description: PLAN_MESSAGES.FREE_LIMIT_REACHED,
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      // ✅ CHAMADA REAL À EDGE FUNCTION rapid-responder
      const { data, error } = await supabase.functions.invoke('rapid-responder', {
        body: {
          theme: theme,
          ageGroup: isAdultContent ? 'adultos' : 'geral',
          style: 'neutro'
        }
      });

      if (error) {
        console.error('Erro ao chamar Edge Function:', error);
        
        // Verificar se é erro de limite
        if (error.message?.includes('Limite mensal')) {
          toast({
            title: "Limite atingido",
            description: "Atingiu o limite de histórias gratuitas este mês. Faça upgrade para Premium!",
            variant: "destructive",
          });
          return null;
        }

        throw error;
      }

      if (!data || !data.success) {
        throw new Error('Resposta inválida da API');
      }

      // ✅ CRIAR HISTÓRIA COM CONTEÚDO REAL DA OPENAI
      const story: Story = {
        id: data.story.id || generateId(),
        title: generateTitleFromContent(data.story.content, theme),
        content: data.story.content,
        theme,
        createdAt: data.story.created_at || new Date().toISOString(),
        isAdultContent,
      };

      saveStory(story);
      incrementStoryCount();
      setCurrentStory(story);

      toast({
        title: "Conto gerado!",
        description: `${data.story.word_count || 500} palavras. ${data.usage.remaining} histórias restantes.`,
      });

      return story;
    } catch (error) {
      console.error('Erro ao gerar história:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o conto. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [canAccessEroticContent, canGenerateStory, incrementStoryCount, saveStory, toast]);

  // Check and generate daily story for 30-day mode
  const checkAndGenerateDailyStory = useCallback(async (): Promise<Story | null> => {
    const thirtyDayState = getThirtyDayModeState();
    
    if (!thirtyDayState || !thirtyDayState.isActive) {
      return null;
    }

    const today = new Date().toISOString().split("T")[0];
    
    // Check if already generated today
    if (thirtyDayState.lastGenerationDate === today) {
      return null;
    }

    // Check if 30 days completed
    if (thirtyDayState.currentDay > 30) {
      stopThirtyDayMode();
      toast({
        title: "Parabéns!",
        description: "Completou os 30 Dias de Contos! Pode iniciar uma nova jornada quando quiser.",
      });
      return null;
    }

    // Generate daily story
    const story = await generateStory(thirtyDayState.mainTheme, false);
    
    if (story) {
      const updatedState: ThirtyDayModeState = {
        ...thirtyDayState,
        currentDay: thirtyDayState.currentDay + 1,
        lastGenerationDate: today,
        storiesGenerated: [...thirtyDayState.storiesGenerated, story.id],
      };
      saveThirtyDayModeState(updatedState);

      // Update story with day number
      story.day = thirtyDayState.currentDay;
    }

    return story;
  }, [generateStory, getThirtyDayModeState, saveThirtyDayModeState, stopThirtyDayMode, toast]);

  return {
    isGenerating,
    currentStory,
    generateStory,
    getStoredStories,
    startThirtyDayMode,
    stopThirtyDayMode,
    getThirtyDayModeState,
    checkAndGenerateDailyStory,
    remainingStories: getRemainingStories(),
    isPremium,
    canGenerateStory: canGenerateStory(),
    userPlan,
  };
};

// ✅ Gerar título inteligente baseado no conteúdo
function generateTitleFromContent(content: string, theme: string): string {
  // Extrair primeira frase ou primeiras palavras como título
  const firstSentence = content.split(/[.!?]/)[0].trim();
  
  if (firstSentence.length > 0 && firstSentence.length < 60) {
    return firstSentence;
  }

  // Fallback para títulos baseados no tema
  const titles: Record<string, string[]> = {
    romance: ["O Encontro Inesperado", "Cartas de Amor", "A Promessa do Farol"],
    suspense: ["Sombras na Noite", "O Segredo da Casa Velha", "A Última Testemunha"],
    fantasia: ["O Reino Perdido", "A Feiticeira da Serra", "Dragões de Cristal"],
    drama: ["Lágrimas Silenciosas", "O Peso do Passado", "Antes do Adeus"],
    aventura: ["A Expedição Impossível", "Terras Desconhecidas", "O Mapa Secreto"],
    misterio: ["O Enigma do Museu", "Pegadas na Areia", "A Chave de Bronze"],
    "ficcao-cientifica": ["2147: A Nova Terra", "Sinais do Espaço", "O Último Androide"],
    historico: ["Lisboa, 1755", "A Corte dos Segredos", "Navegadores"],
    default: ["Um Conto Especial", "A História de Hoje", "Palavras ao Vento"],
  };

  const themeTitles = titles[theme] || titles.default;
  return themeTitles[Math.floor(Math.random() * themeTitles.length)];
}

export default useStoryGeneration;
