export type Gender = "masculino" | "feminino" | "prefiro_nao_informar";

export interface User {
  id: string;
  email: string;
  gender: Gender;
  birthDate: string; // ISO date string
  createdAt: string;
  isAdult: boolean;
}

export interface UserPreferences {
  userId: string;
  favoriteGenres: string[];
  lastRead?: string;
  updatedAt: string;
}

export const STORY_GENRES = [
  {
    id: "romance",
    title: "Romance",
    description: "Histórias de amor, paixão e relações intensas",
    icon: "Heart",
    adultOnly: false,
  },
  {
    id: "aventura",
    title: "Aventura",
    description: "Jornadas épicas e descobertas emocionantes",
    icon: "Compass",
    adultOnly: false,
  },
  {
    id: "suspense",
    title: "Suspense",
    description: "Mistério, tensão e reviravoltas inesperadas",
    icon: "Eye",
    adultOnly: false,
  },
  {
    id: "ficcao_cientifica",
    title: "Ficção Científica",
    description: "Futuros possíveis e mundos imaginários",
    icon: "Rocket",
    adultOnly: false,
  },
  {
    id: "erotico",
    title: "Erótico",
    description: "Conteúdo sensual e intimidade adulta",
    icon: "Flame",
    adultOnly: true,
  },
] as const;

export type GenreId = typeof STORY_GENRES[number]["id"];
