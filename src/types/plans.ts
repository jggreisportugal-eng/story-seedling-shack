// Plan Types and Constants
// All text in European Portuguese (PT-PT)

export type PlanType = "FREE" | "PREMIUM";

export interface UserPlan {
  type: PlanType;
  storiesGeneratedThisMonth: number;
  lastResetDate: string; // ISO date string for monthly reset
  thirtyDayMode?: ThirtyDayModeState;
}

export interface ThirtyDayModeState {
  isActive: boolean;
  startDate: string; // ISO date string
  currentDay: number; // 1-30
  mainTheme: string;
  storiesGenerated: string[]; // Array of story IDs
  lastGenerationDate?: string; // ISO date string
}

export interface Story {
  id: string;
  title: string;
  content: string;
  theme: string;
  createdAt: string;
  day?: number; // For 30-day mode
  isAdultContent: boolean;
  // Future-ready: audio support structure
  audioUrl?: string;
  audioStatus?: "pending" | "generating" | "ready" | "error";
}

// Plan Configuration
export const PLAN_CONFIG = {
  FREE: {
    maxStoriesPerMonth: 5,
    allowEroticContent: false,
    allowThirtyDayMode: false,
    allowAudio: false,
  },
  PREMIUM: {
    maxStoriesPerMonth: Infinity,
    allowEroticContent: true,
    allowThirtyDayMode: true,
    allowAudio: false, // Future-ready, not active yet
  },
} as const;

// Available themes - PT-PT
export const STORY_THEMES = {
  general: [
    { id: "romance", label: "Romance", isPremiumOnly: false },
    { id: "suspense", label: "Suspense", isPremiumOnly: false },
    { id: "fantasia", label: "Fantasia", isPremiumOnly: false },
    { id: "drama", label: "Drama", isPremiumOnly: false },
    { id: "aventura", label: "Aventura", isPremiumOnly: false },
    { id: "misterio", label: "Mistério", isPremiumOnly: false },
    { id: "ficcao-cientifica", label: "Ficção Científica", isPremiumOnly: false },
    { id: "historico", label: "Histórico", isPremiumOnly: false },
  ],
  adult: [
    { id: "erotico", label: "Erótico", isPremiumOnly: true },
    { id: "romance-adulto", label: "Romance Adulto", isPremiumOnly: true },
  ],
} as const;

// Messages - PT-PT
export const PLAN_MESSAGES = {
  FREE_LIMIT_REACHED: "Atingiu o limite mensal do plano gratuito. Faça upgrade para continuar.",
  PREMIUM_REQUIRED: "Esta funcionalidade está disponível apenas para utilizadores Premium.",
  EROTIC_PREMIUM_ONLY: "Conteúdo erótico disponível apenas no plano Premium.",
  THIRTY_DAY_PREMIUM_ONLY: "O modo '30 Dias de Contos' está disponível apenas para utilizadores Premium.",
  STORY_GENERATED: "O seu conto foi gerado com sucesso!",
  DAILY_STORY_READY: "O seu conto diário está pronto para ler.",
  UPGRADE_CTA: "Fazer upgrade para Premium",
} as const;

// Default user plan state
export const getDefaultUserPlan = (): UserPlan => ({
  type: "FREE",
  storiesGeneratedThisMonth: 0,
  lastResetDate: new Date().toISOString().split("T")[0],
});
