export type Movie = {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  description: string;
  poster: string | null;
  heroImage: string | null;
  heroTitle: string;
  heroAccent: string;
};

export const movies: Movie[] = [
  {
    id: 1,
    title: "Godzilla Resurgence",
    genre: "FICÇÃO",
    duration: "01H 59MIN",
    rating: "12 ANOS",
    description:
      "Uma criatura colossal surge inesperadamente em Tóquio, enquanto o governo tenta entender e conter uma ameaça que cresce diante da cidade.",
    poster:
      "/images/movies/posters/godzilla-resurgence.jpg",
    heroImage:
      "/images/movies/banners/godzilla-resurgence.jpg",
    heroTitle: "GODZILLA",
    heroAccent: "RESURGENCE",
  },
  {
    id: 2,
    title: "Homem-Aranha: Através do Aranhaverso",
    genre: "ANIMAÇÃO",
    duration: "02H 20MIN",
    rating: "10 ANOS",
    description:
      "Miles Morales atravessa diferentes dimensões e encontra novas versões do Homem-Aranha enquanto tenta proteger quem ama.",
    poster:
      "/images/movies/posters/homem-aranha-aranhaverso.jpg",
    heroImage:
      "/images/movies/banners/homem-aranha-aranhaverso.jpg",
    heroTitle: "HOMEM-ARANHA",
    heroAccent: "ARANHAVERSO",
  },
  {
    id: 3,
    title: "Guardiões da Galáxia Vol. 3",
    genre: "AÇÃO",
    duration: "02H 30MIN",
    rating: "14 ANOS",
    description:
      "Os Guardiões partem para uma missão que coloca o passado de Rocket no centro de uma última aventura pelo espaço.",
    poster:
      "/images/movies/posters/guardioes-galaxia-3.jpg",
    heroImage:
      "/images/movies/banners/guardioes-galaxia-3.jpg",
    heroTitle: "GUARDIÕES",
    heroAccent: "DA GALÁXIA VOL. 3",
  },
  {
    id: 4,
    title: "La La Land",
    genre: "DRAMA",
    duration: "02H 08MIN",
    rating: "12 ANOS",
    description:
      "Uma atriz e um músico se apaixonam em Los Angeles enquanto tentam equilibrar seus sonhos, carreiras e o relacionamento.",
    poster:
      "/images/movies/posters/la-la-land.jpg",
    heroImage:
      "/images/movies/banners/la-la-land.jpg",
    heroTitle: "LA LA",
    heroAccent: "LAND",
  },
  {
    id: 5,
    title: "Hellraiser",
    genre: "TERROR",
    duration: "02H 01MIN",
    rating: "18 ANOS",
    description:
      "Uma misteriosa caixa abre caminho para uma realidade marcada por criaturas sobrenaturais e desejos que cobram um preço terrível.",
    poster:
      "/images/movies/posters/hellraiser.jpg",
    heroImage:
      "/images/movies/banners/hellraiser.jpg",
    heroTitle: "HELL",
    heroAccent: "RAISER",
  },
  {
    id: 6,
    title: "Alien: Romulus",
    genre: "TERROR",
    duration: "01H 59MIN",
    rating: "16 ANOS",
    description:
      "Um grupo de jovens explora uma estação espacial abandonada e acaba diante de uma ameaça que não deveria ter sido encontrada.",
    poster:
      "/images/movies/posters/alien-romulus.jpg",
    heroImage:
      "/images/movies/banners/alien-romulus.jpg",
    heroTitle: "ALIEN:",
    heroAccent: "ROMULUS",
  },
  {
    id: 7,
    title: "Bingo: O Rei das Manhãs",
    genre: "DRAMA",
    duration: "01H 53MIN",
    rating: "16 ANOS",
    description:
      "Um artista em busca de reconhecimento encontra fama interpretando um palhaço de televisão, mas começa a pagar um preço pessoal pelo sucesso.",
    poster:
      "/images/movies/posters/bingo-rei-das-manhas.jpg",
    heroImage:
      "/images/movies/banners/bingo-rei-das-manhas.jpg",
    heroTitle: "BINGO",
    heroAccent: "O REI DAS MANHÃS",
  },
  {
    id: 8,
    title: "O Exorcista 3",
    genre: "TERROR",
    duration: "01H 50MIN",
    rating: "18 ANOS",
    description:
      "Uma investigação policial se conecta a assassinatos que parecem reproduzir acontecimentos ligados a um antigo caso de possessão.",
    poster:
      "/images/movies/posters/exorcista-3.jpg",
    heroImage:
      "/images/movies/banners/exorcista-3.jpg",
    heroTitle: "O EXORCISTA",
    heroAccent: "3",
  },
  {
    id: 9,
    title: "Star Wars: O Império Contra-Ataca",
    genre: "FICÇÃO",
    duration: "02H 04MIN",
    rating: "LIVRE",
    description:
      "A Rebelião enfrenta novos perigos enquanto Luke continua seu treinamento e a guerra contra o Império se intensifica.",
    poster:
      "/images/movies/posters/star-wars-imperio-contra-ataca.jpg",
    heroImage:
      "/images/movies/banners/star-wars-imperio-contra-ataca.jpg",
    heroTitle: "STAR WARS",
    heroAccent: "O IMPÉRIO CONTRA-ATACA",
  },
  {
    id: 10,
    title: "The Thing",
    genre: "TERROR",
    duration: "01H 49MIN",
    rating: "18 ANOS",
    description:
      "Isolados em uma estação na Antártida, pesquisadores percebem que uma forma de vida desconhecida pode estar entre eles.",
    poster:
      "/images/movies/posters/the-thing.jpg",
    heroImage:
      "/images/movies/banners/the-thing.jpg",
    heroTitle: "THE",
    heroAccent: "THING",
  },
  {
    id: 11,
    title: "Psicose",
    genre: "TERROR",
    duration: "01H 49MIN",
    rating: "14 ANOS",
    description:
      "Uma mulher desaparece após parar em um pequeno motel, iniciando uma história de suspense em torno de um proprietário profundamente perturbado.",
    poster:
      "/images/movies/posters/psicose.jpg",
    heroImage:
      "/images/movies/banners/psicose.jpg",
    heroTitle: "PSI",
    heroAccent: "COSE",
  },
  {
    id: 12,
    title: "FNAF: O Pesadelo Sem Fim",
    genre: "TERROR",
    duration: "01H 49MIN",
    rating: "16 ANOS",
    description:
      "Um segurança começa a trabalhar em uma pizzaria abandonada e descobre que os personagens animatrônicos guardam segredos perigosos.",
    poster:
      "/images/movies/posters/fnaf-pesadelo-sem-fim.jpg",
    heroImage:
      "/images/movies/banners/fnaf-pesadelo-sem-fim.jpeg",
    heroTitle: "FNAF",
    heroAccent: "O PESADELO SEM FIM",
  },
  {
    id: 13,
    title: "O Estranho Mundo de Jack",
    genre: "ANIMAÇÃO",
    duration: "01H 16MIN",
    rating: "LIVRE",
    description:
      "Jack Skellington decide transformar o Natal à sua maneira e acaba colocando sua própria cidade e a celebração em confusão.",
    poster:
      "/images/movies/posters/estranho-mundo-de-jack.jpg",
    heroImage:
      "/images/movies/banners/estranho-mundo-de-jack.jpg",
    heroTitle: "O ESTRANHO",
    heroAccent: "MUNDO DE JACK",
  },
  {
    id: 14,
    title: "Moonlight: Sob a Luz do Luar",
    genre: "DRAMA",
    duration: "01H 51MIN",
    rating: "16 ANOS",
    description:
      "A trajetória de um jovem é acompanhada em diferentes fases da vida, entre identidade, amizade, afeto e as dificuldades de crescer.",
    poster:
      "/images/movies/posters/moonlight.jpg",
    heroImage:
      "/images/movies/banners/moonlight.jpg",
    heroTitle: "MOONLIGHT",
    heroAccent: "SOB A LUZ DO LUAR",
  },
  {
    id: 15,
    title: "Perfect Blue",
    genre: "DRAMA",
    duration: "01H 21MIN",
    rating: "18 ANOS",
    description:
      "Uma jovem artista abandona a música para atuar e começa a perder a distinção entre sua identidade, sua carreira e uma presença que a persegue.",
    poster:
      "/images/movies/posters/perfect-blue.jpg",
    heroImage:
      "/images/movies/banners/perfect-blue.jpg",
    heroTitle: "PERFECT",
    heroAccent: "BLUE",
  },
];

export const featuredMovies = [
  movies[0],
  movies[11],
  movies[14],
];

export const genres = [
  "TODOS",
  "AÇÃO",
  "DRAMA",
  "COMÉDIA",
  "TERROR",
  "FICÇÃO",
  "ANIMAÇÃO",
];