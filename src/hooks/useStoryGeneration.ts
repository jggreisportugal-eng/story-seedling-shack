import { useState, useCallback } from "react";
import { Story, ThirtyDayModeState, PLAN_MESSAGES } from "@/types/plans";
import { usePlanState } from "./usePlanState";
import { useToast } from "./use-toast";

const STORIES_STORAGE_KEY = "contos-diarios-stories";
const THIRTY_DAY_STORAGE_KEY = "contos-diarios-thirty-day-mode";

// Generate unique ID
const generateId = () => `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useStoryGeneration = () => {
  const { toast } = useToast();
  const {
    userPlan,
    isPremium,
    canGenerateStory,
    getRemainingStories,
    canAccessEroticContent,
    canAccessThirtyDayMode,
    incrementStoryCount,
  } = usePlanState();

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
  }, []);

  // Save story to storage
  const saveStory = useCallback((story: Story) => {
    const stories = getStoredStories();
    stories.unshift(story);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories.slice(0, 100))); // Keep last 100
  }, [getStoredStories]);

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
  }, []);

  // Save 30-day mode state
  const saveThirtyDayModeState = useCallback((state: ThirtyDayModeState | null) => {
    if (state) {
      localStorage.setItem(THIRTY_DAY_STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(THIRTY_DAY_STORAGE_KEY);
    }
  }, []);

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

  // Generate a story
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
      // Simulate story generation (in production, this would call an AI API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const story: Story = {
        id: generateId(),
        title: generatePlaceholderTitle(theme),
        content: generatePlaceholderContent(theme),
        theme,
        createdAt: new Date().toISOString(),
        isAdultContent,
      };

      saveStory(story);
      incrementStoryCount();
      setCurrentStory(story);

      toast({
        title: "Conto gerado!",
        description: PLAN_MESSAGES.STORY_GENERATED,
      });

      return story;
    } catch (error) {
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

// Placeholder content generators (will be replaced with AI generation)
function generatePlaceholderTitle(theme: string): string {
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

  const themesTitles = titles[theme] || titles.default;
  return themesTitles[Math.floor(Math.random() * themesTitles.length)];
}

function generatePlaceholderContent(theme: string): string {
  return `
    Este é um conto de ${theme} gerado especialmente para si.

    A história começa numa manhã de nevoeiro, quando o sol ainda tentava penetrar as nuvens cinzentas que cobriam a cidade antiga. As ruas de pedra brilhavam com a humidade da noite, refletindo as primeiras luzes das montras que começavam a acender.

    Maria caminhava devagar, os passos ecoando no silêncio da madrugada. Tinha nas mãos uma carta amarelada, encontrada entre os pertences da avó que partira há uma semana. Uma carta que mudaria tudo o que ela pensava saber sobre a sua família.

    "Minha querida neta," começava a carta, numa caligrafia elegante e firme, "quando leres estas palavras, já não estarei contigo. Mas há segredos que precisam de ser contados, verdades que guardei durante uma vida inteira..."

    Maria sentou-se no banco de pedra junto à fonte da praça. O coração batia forte enquanto os olhos percorriam cada linha, cada palavra cuidadosamente escolhida. A história da avó era muito mais rica e complexa do que alguma vez imaginara.

    E assim começava uma nova jornada de descoberta.
  `;
}

export default useStoryGeneration;
