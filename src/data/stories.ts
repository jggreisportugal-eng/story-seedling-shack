export interface Story {
  id: string;
  title: string;
  day: number;
  genre: string;
  isAdultContent: boolean;
  content: string;
}

export const STORIES: Record<string, Story> = {
  "sample-1": {
    id: "sample-1",
    title: "Navegadores",
    day: 1,
    genre: "romance",
    isAdultContent: false,
    content: `
No coração da Península Ibérica, no século XII, a pequena aldeia de Alvor pulsava ao ritmo da natureza. Entre as casas de pedra e os campos verdejantes, vivia Leonor, uma jovem de olhos castanhos profundos e cabelos negros como a noite.

Leonor passava os dias a ajudar a mãe na tecelagem, mas o seu coração ansiava por algo mais. Todas as tardes, subia ao topo da colina que dominava o vale e olhava para o horizonte, imaginando as terras distantes que nunca conheceria.

Foi numa dessas tardes que viu, pela primeira vez, um grupo de cavaleiros a atravessar a aldeia. Entre eles, destacava-se um jovem de porte nobre, com armadura reluzente e um olhar que parecia carregar o peso de mil batalhas.

O destino havia posto em movimento algo que mudaria para sempre a vida de Leonor.
    `
  },
  "sample-2": {
    id: "sample-2",
    title: "Cartas de Amor",
    day: 2,
    genre: "romance",
    isAdultContent: false,
    content: `
O sol começava a esconder-se atrás das colinas de Sintra, tingindo o céu de laranja e rosa, quando Clara encontrou a primeira carta.

Estava escondida entre as páginas de um livro antigo na biblioteca da casa que havia herdado da avó. A letra era elegante, quase artística, e o papel amarelado pelo tempo exalava um perfume suave de lavanda.

"Minha querida desconhecida," começava a carta, "escrevo-te estas palavras sabendo que talvez nunca as leias, mas o meu coração não me deixa em paz enquanto não as colocar no papel..."

Clara sentou-se junto à janela, o coração a bater mais rápido. Quem seria o autor? E para quem eram destinadas aquelas palavras tão belas e melancólicas?

Ao virar a página, encontrou uma data: 15 de Março de 1952. Há mais de setenta anos, alguém havia derramado a sua alma naquelas linhas.

E Clara sabia, no fundo do seu ser, que tinha de descobrir a história por trás daquelas cartas.
    `
  },
  "sample-3": {
    id: "sample-3",
    title: "Terras Desconhecidas",
    day: 3,
    genre: "aventura",
    isAdultContent: false,
    content: `
No coração da Serra da Estrela, onde as montanhas beijam o céu e os rios correm como serpentes prateadas, existe uma lenda antiga sobre uma terra escondida.

Miguel, um jovem cartógrafo de Lisboa, sempre ouvira as histórias contadas pelo avô sobre um vale secreto onde o tempo parecia ter parado. Um lugar onde a natureza reinava suprema e os segredos do passado aguardavam para ser descobertos.

Armado apenas com um mapa antigo, uma bússola e uma determinação inabalável, Miguel iniciou a sua jornada numa manhã de névoa espessa.

Os primeiros dias foram duros. O terreno era acidentado, e mais de uma vez pensou em desistir. Mas algo dentro dele, uma voz que não conseguia ignorar, empurrava-o para a frente.

Foi ao quinto dia, quando já começava a duvidar da própria sanidade, que encontrou a entrada. Uma fenda estreita entre duas rochas gigantes, quase invisível aos olhos desatentos.

O que encontrou do outro lado mudaria não apenas a sua vida, mas a forma como via o mundo.
    `
  },
  "sample-4": {
    id: "sample-4",
    title: "2147: A Nova Terra",
    day: 4,
    genre: "ficcao-cientifica",
    isAdultContent: false,
    content: `
A estação espacial Nova Esperança flutuava serenamente na vastidão do espaço, um marco de aço e vidro contra o pano de fundo infinito das estrelas.

Dentro dela, a Dra. Sofia Mendes observava através da janela panorâmica o planeta azul e verde que se estendia abaixo. Não era a Terra — essa havia sido abandonada há três gerações. Era Kepler-442b, o novo lar da humanidade.

"Relatório de status, Dra. Sofia?" A voz do comandante Chen ecoou pelo comunicador.

"Todos os sistemas operacionais. A atmosfera está estabilizada e os primeiros colonos podem descer amanhã ao amanhecer," respondeu Sofia, os olhos ainda fixos no planeta.

Três anos. Três longos anos desde que deixara tudo para trás para fazer parte desta missão. E agora, finalmente, estava prestes a pisar em solo virgem, a ser uma das primeiras humanas a caminhar sobre um novo mundo.

Mas enquanto preparava o equipamento para a descida, uma leitura estranha nos sensores chamou a sua atenção. Algo que não deveria estar ali. Algo que sugeria que talvez, apenas talvez, não fossem os primeiros a chegar.
    `
  }
};

export const getStoryById = (id: string): Story | null => {
  return STORIES[id] || null;
};

export const getAllStories = (): Story[] => {
  return Object.values(STORIES);
};
