import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { movies as demoMovies } from "../movies";
import { getMovies, type Movie } from "../services/api";
import { COLORS, styles } from "../styles";
type AppMovie = Movie & {
  _source: "demo" | "database";
};

const LOGO_SOURCE = "/images/logo/cineminha.png";
const CUSTOM_FONT_FAMILY = "Terminator";

const demoFeaturedMovies = [
  demoMovies[0],
  demoMovies[11],
  demoMovies[9],
].filter(Boolean);

const genres = [
  "TODOS",
  "AÇÃO",
  "DRAMA",
  "COMÉDIA",
  "TERROR",
  "FICÇÃO",
  "ANIMAÇÃO",
];

function removeAccents(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeText(text: string) {
  return removeAccents(text)
    .toLowerCase()
    .trim();
}

function getMovieId(movie: any, index: number) {
  const id = String(movie?.id ?? index);

  return movie?._source === "demo"
    ? `demo-${id}`
    : id;
}

function getMovieTitle(movie: any) {
  return (
    movie?.title ??
    movie?.name ??
    "Título do Filme"
  );
}

function getMovieGenre(movie: any) {
  if (
    Array.isArray(movie?.genres) &&
    movie.genres.length > 0
  ) {
    return String(movie.genres[0]);
  }

  if (
    Array.isArray(movie?.genre) &&
    movie.genre.length > 0
  ) {
    return String(movie.genre[0]);
  }

  return String(movie?.genre ?? "FILME");
}

function getMovieGenres(movie: any) {
  if (Array.isArray(movie?.genres)) {
    return movie.genres.map((item: any) =>
      String(item)
    );
  }

  if (movie?.genre) {
    return String(movie.genre)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getMovieDuration(movie: any) {
  return String(
    movie?.duration ??
      movie?.runtime ??
      "2H 00"
  );
}

function getMovieRating(movie: any) {
  return String(
    movie?.rating ??
      movie?.ageRating ??
      "+12"
  );
}

function getMovieDescription(movie: any) {
  return String(
    movie?.description ??
      movie?.synopsis ??
      movie?.sinopse ??
      "Confira informações, detalhes e horários deste filme no Cineminha."
  );
}

function getMoviePoster(movie: any) {
  return movie?.poster ?? null;
}

function getMovieHero(movie: any) {
  return (
    movie?.heroImage ??
    movie?.banner ??
    movie?.backdrop ??
    null
  );
}

function splitTitle(title: string) {
  const clean = title.trim();

  if (!clean.includes(" ")) {
    return {
      first: "",
      accent: clean,
    };
  }

  const words = clean.split(" ");
  const accent = words.pop() ?? clean;

  return {
    first: words.join(" "),
    accent,
  };
}

function HoverButton({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress?: () => void;
}) {
  const animation = useRef(
    new Animated.Value(0)
  ).current;

  const animateTo = (value: number) => {
    Animated.timing(animation, {
      toValue: value,
      duration: 260,
      easing: Easing.out(
        Easing.cubic
      ),
      useNativeDriver:
        Platform.OS !== "web",
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY:
              animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -2],
              }),
          },
          {
            scale:
              animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.018],
              }),
          },
        ],
      }}
    >
      <Pressable
        onPress={onPress}
        onHoverIn={() =>
          animateTo(1)
        }
        onHoverOut={() =>
          animateTo(0)
        }
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function NavItem({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const animation = useRef(
    new Animated.Value(
      active ? 1 : 0
    )
  ).current;

  const animateTo = (value: number) => {
    Animated.timing(animation, {
      toValue: value,
      duration: 240,
      easing: Easing.out(
        Easing.cubic
      ),
      useNativeDriver:
        Platform.OS !== "web",
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() =>
        animateTo(1)
      }
      onHoverOut={() =>
        animateTo(
          active ? 1 : 0
        )
      }
      style={styles.navLink}
    >
      <Animated.Text
        style={{
          color: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [
              COLORS.muted,
              COLORS.white,
            ],
          }),
          fontFamily: "monospace",
          fontSize: 8,
          fontWeight: "900",
          letterSpacing: 1.2,
        }}
      >
        {label}
      </Animated.Text>

      <Animated.View
        style={[
          styles.navLinkUnderline,
          {
            opacity: animation,
            transform: [
              {
                scaleX: animation,
              },
            ],
          },
        ]}
      />
    </Pressable>
  );
}

function HudChip({
  label,
  value,
  mobile,
}: {
  label: string;
  value: string;
  mobile?: boolean;
}) {
  return (
    <View
      style={[
        styles.hudChip,
        mobile &&
          styles.hudChipMobile,
      ]}
    >
      <Text
        style={[
          styles.hudChipLabel,
          mobile &&
            styles.hudChipLabelMobile,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.hudChipValue,
          mobile &&
            styles.hudChipValueMobile,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function SessionHud({
  mobile,
}: {
  mobile: boolean;
}) {
  return (
    <View
      style={[
        styles.sessionHud,
        mobile &&
          styles.sessionHudMobile,
      ]}
    >
      <View
        style={[
          styles.sessionHudTop,
          mobile &&
            styles.sessionHudTopMobile,
        ]}
      >
        <View>
          <Text
            style={[
              styles.sessionHudEyebrow,
              mobile &&
                styles.sessionHudEyebrowMobile,
            ]}
          >
            ENCONTRE SUA SESSÃO
          </Text>

          <Text
            style={[
              styles.sessionHudTitle,
              mobile &&
                styles.sessionHudTitleMobile,
            ]}
          >
            Onde e quando você quer
            assistir?
          </Text>
        </View>

        <View
          style={[
            styles.sessionLiveBadge,
            mobile &&
              styles.sessionLiveBadgeMobile,
          ]}
        >
          <View
            style={
              styles.sessionLiveDot
            }
          />

          <Text
            style={[
              styles.sessionLiveText,
              mobile &&
                styles.sessionLiveTextMobile,
            ]}
          >
            SESSÕES DISPONÍVEIS
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.sessionControls,
          mobile &&
            styles.sessionControlsMobile,
        ]}
      >
        <View
          style={[
            styles.sessionControl,
            mobile &&
              styles.sessionControlMobile,
          ]}
        >
          <Text
            style={[
              styles.sessionControlLabel,
              mobile &&
                styles.sessionControlLabelMobile,
            ]}
          >
            LOCAL
          </Text>

          <Text
            style={[
              styles.sessionControlValue,
              mobile &&
                styles.sessionControlValueMobile,
            ]}
          >
            SÃO PAULO
          </Text>

          <Text
            style={[
              styles.sessionControlHint,
              mobile &&
                styles.sessionControlHintMobile,
            ]}
          >
            CIDADE ATUAL
          </Text>
        </View>

        <View
          style={[
            styles.sessionControl,
            mobile &&
              styles.sessionControlMobile,
          ]}
        >
          <Text
            style={[
              styles.sessionControlLabel,
              mobile &&
                styles.sessionControlLabelMobile,
            ]}
          >
            DATA
          </Text>

          <Text
            style={[
              styles.sessionControlValue,
              mobile &&
                styles.sessionControlValueMobile,
            ]}
          >
            HOJE
          </Text>

          <Text
            style={[
              styles.sessionControlHint,
              mobile &&
                styles.sessionControlHintMobile,
            ]}
          >
            PRÓXIMAS SESSÕES
          </Text>
        </View>

        <View
          style={[
            styles.sessionControl,
            mobile &&
              styles.sessionControlMobile,
          ]}
        >
          <Text
            style={[
              styles.sessionControlLabel,
              mobile &&
                styles.sessionControlLabelMobile,
            ]}
          >
            FORMATO
          </Text>

          <Text
            style={[
              styles.sessionControlValue,
              mobile &&
                styles.sessionControlValueMobile,
            ]}
          >
            TODOS
          </Text>

          <Text
            style={[
              styles.sessionControlHint,
              mobile &&
                styles.sessionControlHintMobile,
            ]}
          >
            2D • 3D • IMAX
          </Text>
        </View>

        <View
          style={[
            styles.sessionSearchWrap,
            mobile &&
              styles.sessionSearchWrapMobile,
          ]}
        >
          <Pressable>
            <View
              style={[
                styles.sessionSearchButton,
                mobile &&
                  styles.sessionSearchButtonMobile,
              ]}
            >
              <Text
                style={[
                  styles.sessionSearchText,
                  mobile &&
                    styles.sessionSearchTextMobile,
                ]}
              >
                BUSCAR SESSÕES
              </Text>

              <Text
                style={
                  styles.sessionSearchArrow
                }
              >
                →
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function MovieCard({
  movie,
  width,
  revealed,
  revealDelay,
  customFontReady,
  onLayout,
  onPress,
  mobile,
}: {
  movie: any;
  width: number;
  revealed: boolean;
  revealDelay: number;
  customFontReady: boolean;
  onLayout: (y: number) => void;
  onPress: () => void;
  mobile: boolean;
}) {
  const revealAnimation =
    useRef(
      new Animated.Value(0)
    ).current;

  const hoverAnimation =
    useRef(
      new Animated.Value(0)
    ).current;

  const title = getMovieTitle(
    movie
  );

  const genre = getMovieGenre(
    movie
  );

  const duration =
    getMovieDuration(movie);

  const rating =
    getMovieRating(movie);

  const poster =
    getMoviePoster(movie);

  useEffect(() => {
    if (!revealed) {
      return;
    }

    Animated.timing(
      revealAnimation,
      {
        toValue: 1,
        duration: mobile
          ? 560
          : 720,
        delay: revealDelay,
        easing:
          Easing.out(
            Easing.cubic
          ),
        useNativeDriver:
          Platform.OS !== "web",
      }
    ).start();
  }, [
    revealed,
    revealAnimation,
    revealDelay,
    mobile,
  ]);

  const animateHover = (
    value: number
  ) => {
    Animated.timing(
      hoverAnimation,
      {
        toValue: value,
        duration: 380,
        easing:
          Easing.out(
            Easing.cubic
          ),
        useNativeDriver:
          Platform.OS !== "web",
      }
    ).start();
  };

  const displayHoverTitle =
    customFontReady
      ? removeAccents(
          title
        ).toUpperCase()
      : title.toUpperCase();

  return (
    <Animated.View
      onLayout={(event) => {
        onLayout(
          event.nativeEvent.layout
            .y
        );
      }}
      style={[
        styles.movieCardReveal,
        {
          width,
          opacity:
            revealAnimation,
          transform: [
            {
              translateY:
                revealAnimation.interpolate(
                  {
                    inputRange: [
                      0,
                      1,
                    ],
                    outputRange: [
                      30,
                      0,
                    ],
                  }
                ),
            },
            {
              scale:
                revealAnimation.interpolate(
                  {
                    inputRange: [
                      0,
                      1,
                    ],
                    outputRange: [
                      0.97,
                      1,
                    ],
                  }
                ),
            },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.movieCard,
          mobile &&
            styles.movieCardMobile,
          {
            transform: [
              {
                translateY:
                  hoverAnimation.interpolate(
                    {
                      inputRange: [
                        0,
                        1,
                      ],
                      outputRange: [
                        0,
                        -7,
                      ],
                    }
                  ),
              },
              {
                scale:
                  hoverAnimation.interpolate(
                    {
                      inputRange: [
                        0,
                        1,
                      ],
                      outputRange: [
                        1,
                        1.015,
                      ],
                    }
                  ),
              },
            ],
          },
        ]}
      >
        <Pressable
          onPress={onPress}
          onHoverIn={() =>
            animateHover(1)
          }
          onHoverOut={() =>
            animateHover(0)
          }
        >
          <View
            style={[
              styles.posterContainer,
              mobile &&
                styles.posterContainerMobile,
            ]}
          >
            {poster ? (
              <>
                <Animated.Image
                  source={poster}
                  resizeMode="cover"
                  style={[
                    styles.posterImage,
                    {
                      transform: [
                        {
                          scale:
                            hoverAnimation.interpolate(
                              {
                                inputRange: [
                                  0,
                                  1,
                                ],
                                outputRange: [
                                  1,
                                  1.045,
                                ],
                              }
                            ),
                        },
                      ],
                    },
                  ]}
                />

                <Animated.Image
                  source={poster}
                  resizeMode="cover"
                  pointerEvents="none"
                  style={[
                    styles.posterImage,
                    {
                      opacity:
                        hoverAnimation,
                      transform: [
                        {
                          scale:
                            hoverAnimation.interpolate(
                              {
                                inputRange: [
                                  0,
                                  1,
                                ],
                                outputRange: [
                                  1,
                                  1.045,
                                ],
                              }
                            ),
                        },
                      ],
                      ...(Platform.OS ===
                      "web"
                        ? ({
                            filter:
                              "blur(5px) saturate(1.65)",
                          } as any)
                        : {}),
                    },
                  ]}
                />
              </>
            ) : (
              <View
                style={
                  styles.posterPlaceholder
                }
              >
                <View
                  style={
                    styles.posterColorOne
                  }
                />

                <View
                  style={
                    styles.posterColorTwo
                  }
                />

                <View
                  style={
                    styles.posterIcon
                  }
                >
                  <View
                    style={
                      styles.posterPlay
                    }
                  />
                </View>

                <Text
                  style={
                    styles.posterPlaceholderText
                  }
                >
                  IMAGEM DO FILME
                </Text>
              </View>
            )}

            <LinearGradient
              pointerEvents="none"
              colors={[
                "transparent",
                "rgba(12,6,45,0.05)",
                "rgba(12,6,45,0.94)",
              ]}
              locations={[
                0,
                0.48,
                1,
              ]}
              style={
                styles.posterGradient
              }
            />

            <Animated.View
              pointerEvents="none"
              style={[
                styles.movieHoverOverlay,
                {
                  opacity:
                    hoverAnimation,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.movieHoverCircleOuter,
                  {
                    transform: [
                      {
                        scale:
                          hoverAnimation.interpolate(
                            {
                              inputRange: [
                                0,
                                1,
                              ],
                              outputRange: [
                                0.84,
                                1,
                              ],
                            }
                          ),
                      },
                    ],
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.movieHoverCircle,
                  {
                    transform: [
                      {
                        scale:
                          hoverAnimation.interpolate(
                            {
                              inputRange: [
                                0,
                                1,
                              ],
                              outputRange: [
                                0.72,
                                1,
                              ],
                            }
                          ),
                      },
                    ],
                  },
                ]}
              />

              <View
                style={
                  styles.movieHoverText
                }
              >
                <Text
                  style={[
                    styles.movieHoverTitle,
                    {
                      fontFamily:
                        customFontReady
                          ? CUSTOM_FONT_FAMILY
                          : "Arial",
                      fontSize: 21,
                      lineHeight: 24,
                      fontWeight: "900",
                    },
                  ]}
                >
                  {displayHoverTitle}
                </Text>

                <View
                  style={
                    styles.movieHoverRule
                  }
                />

                <Text
                  style={
                    styles.movieHoverMeta
                  }
                >
                  {genre.toUpperCase()} •{" "}
                  {duration.toUpperCase()}
                </Text>

                <Text
                  style={
                    styles.movieHoverRating
                  }
                >
                  CLASSIFICAÇÃO{" "}
                  {rating.toUpperCase()}
                </Text>
              </View>
            </Animated.View>
          </View>

          <View
            style={[
              styles.movieFooter,
              mobile &&
                styles.movieFooterMobile,
            ]}
          >
            <Text
              style={[
                styles.movieFooterTitle,
                mobile &&
                  styles.movieFooterTitleMobile,
              ]}
            >
              {title}
            </Text>

            <Text
              style={[
                styles.movieFooterMeta,
                mobile &&
                  styles.movieFooterMetaMobile,
              ]}
            >
              {genre.toUpperCase()} •{" "}
              {duration.toUpperCase()} •{" "}
              {rating.toUpperCase()}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  const {
    width,
    height,
  } = useWindowDimensions();

  const scrollRef =
    useRef<ScrollView | null>(
      null
    );

  const [search, setSearch] =
    useState("");

 const [databaseMovies, setDatabaseMovies] =
  useState<Movie[]>([]);

useEffect(() => {
  const loadMovies = () => getMovies()
    .then((data) => {
      const publicados = data.filter((movie) => movie.status === "Publicado");
      setDatabaseMovies(publicados);
    })
    .catch((error) => console.error("Erro ao carregar filmes:", error));
  loadMovies();
  const refresh = setInterval(loadMovies, 30000);
  return () => clearInterval(refresh);
}, []);
// O catálogo do banco é a fonte principal. A lista local só entra como
// contingência quando a API ainda não tem nenhum filme publicado.
const allMovies: AppMovie[] = databaseMovies.length > 0
  ? databaseMovies.map((movie) => ({ ...movie, _source: "database" as const }))
  : demoMovies.map((movie) => ({ ...movie, _source: "demo" as const }));

const databaseFeatured = databaseMovies.filter((movie) => movie.featured);
const featuredMovies: AppMovie[] = databaseMovies.length > 0
  ? (databaseFeatured.length > 0 ? databaseFeatured : databaseMovies.slice(0, 3))
      .map((movie) => ({ ...movie, _source: "database" as const }))
  : demoFeaturedMovies.map((movie) => ({ ...movie, _source: "demo" as const }));
  const [
    searchFocused,
    setSearchFocused,
  ] = useState(false);

  const [
    activeGenre,
    setActiveGenre,
  ] = useState("TODOS");

  const [
    customFontReady,
    setCustomFontReady,
  ] = useState(false);

  const [slide, setSlide] =
    useState(0);

  const [
    previousSlide,
    setPreviousSlide,
  ] = useState(0);

  const [
    revealedMovies,
    setRevealedMovies,
  ] = useState<
    Record<string, boolean>
  >({});

  const revealedMoviesRef =
    useRef<
      Record<string, boolean>
    >({});

  const scrollOffsetRef =
    useRef(0);

  const moviesSectionYRef =
    useRef(0);

  const sessionSectionYRef =
    useRef(0);

  const moviesGridYRef =
    useRef(0);

  const movieLocalPositionsRef =
    useRef<
      Record<string, number>
    >({});

  const movieLayoutReadyRef =
    useRef({
      section: false,
      grid: false,
    });

  const slideProgress =
    useRef(
      new Animated.Value(1)
    ).current;

  const heroMotion =
    useRef(
      new Animated.Value(0)
    ).current;

  const logoGlow =
    useRef(
      new Animated.Value(0.82)
    ).current;

  const ambientOne =
    useRef(
      new Animated.Value(0)
    ).current;

  const ambientTwo =
    useRef(
      new Animated.Value(0)
    ).current;

  const ambientThree =
    useRef(
      new Animated.Value(0)
    ).current;

  const desktop =
    width >= 1100;

  const tablet =
    width >= 700;

  const mobile =
    width < 700;

  const smallMobile =
    width < 390;

  const columns =
    desktop
      ? 5
      : tablet
        ? 3
        : 2;

  const sidePadding =
    desktop
      ? 64
      : tablet
        ? 38
        : 16;

  const gap =
    desktop
      ? 18
      : tablet
        ? 14
        : 10;

  const cardWidth =
    Math.max(
      0,
      (
        width -
        sidePadding * 2 -
        gap *
          (columns - 1)
      ) / columns
    );

  const heroHeight =
    mobile
      ? Math.max(
          620,
          Math.min(
            height * 0.9,
            smallMobile
              ? 700
              : 760
          )
        )
      : Math.max(
          700,
          height
        );
  
  const filteredMovies =
    useMemo(() => {
      const query =
        normalizeText(
          search
        );

      const genreFilter =
        normalizeText(
          activeGenre
        );

     return allMovies.filter((movie: any) => {
          const title =
            normalizeText(
              getMovieTitle(
                movie
              )
            );

          const movieGenreList =
            getMovieGenres(
              movie
            ).map(
              (genre: string) =>
                normalizeText(
                  genre
                )
            );

          const matchesSearch =
            query.length === 0 ||
            title.includes(
              query
            ) ||
            movieGenreList.some(
              (genre) =>
                genre.includes(
                  query
                )
            );

          const matchesGenre =
            activeGenre ===
              "TODOS" ||
            movieGenreList.includes(
              genreFilter
            );

          return (
            matchesSearch &&
            matchesGenre
          );
        }
      );
    }, [
      search,
      activeGenre,
      allMovies,
    ]);
  console.log(
  "TODOS OS FILMES:",
  allMovies.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    source: movie._source,
  }))
);

console.log(
  "FILMES FILTRADOS:",
  filteredMovies.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    source: movie._source,
  }))
);
  /*
   * No mobile, os filmes são reorganizados
   * visualmente em 5 colunas e 3 linhas.
   * Depois agrupamos duas colunas por página.
   *
   * 1ª página: colunas 1 e 2
   * 2ª página: colunas 3 e 4
   * 3ª página: coluna 5
   */
  const mobileMovieColumns =
    useMemo(() => {
      const result: {
        movie: any;
        index: number;
      }[][] = [];

      for (
        let column = 0;
        column < 5;
        column++
      ) {
        const columnItems: {
          movie: any;
          index: number;
        }[] = [];

        for (
          let row = 0;
          row < 3;
          row++
        ) {
          const index =
            row * 5 +
            column;

          if (
            filteredMovies[
              index
            ]
          ) {
            columnItems.push({
              movie:
                filteredMovies[
                  index
                ],
              index,
            });
          }
        }

        if (
          columnItems.length >
          0
        ) {
          result.push(
            columnItems
          );
        }
      }

      return result;
  }, [filteredMovies]);

  const mobileMoviePages =
    useMemo(() => {
      const pages: {
        movie: any;
        index: number;
      }[][][] = [];

      for (
        let i = 0;
        i <
        mobileMovieColumns.length;
        i += 2
      ) {
        pages.push(
          mobileMovieColumns.slice(
            i,
            i + 2
          )
        );
      }

      return pages;
    }, [
      mobileMovieColumns,
    ]);

  const mobileCarouselPageWidth =
    cardWidth * 2 + gap;

  const currentMovie =
    featuredMovies[slide] ??
    featuredMovies[0];

  const oldMovie =
    featuredMovies[
      previousSlide
    ] ??
    featuredMovies[0];

  const currentTitle =
    splitTitle(
      getMovieTitle(
        currentMovie
      )
    );

  const oldTitle =
    splitTitle(
      getMovieTitle(
        oldMovie
      )
    );

  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof document ===
        "undefined"
    ) {
      return;
    }

    const fontId =
      "cineminha-terminator-font";

    let styleElement =
      document.getElementById(
        fontId
      ) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement =
        document.createElement(
          "style"
        );

      styleElement.id = fontId;

      styleElement.textContent = `
        @font-face {
          font-family: "Terminator";
          src: url("/fonts/terminator.otf") format("opentype");
          font-style: normal;
          font-weight: 400;
          font-display: swap;
        }
      `;

      document.head.appendChild(
        styleElement
      );
    }

    const loadFont =
      async () => {
        try {
          if (
            document.fonts
          ) {
            await document.fonts.load(
              '400 32px "Terminator"'
            );
          }

          setCustomFontReady(
            true
          );
        } catch {
          setCustomFontReady(
            false
          );
        }
      };

    loadFont();
  }, []);

  useEffect(() => {
    const heroDuration =
      mobile
        ? 10000
        : 7200;

    const heroLoop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            heroMotion,
            {
              toValue: 1,
              duration:
                heroDuration,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.timing(
            heroMotion,
            {
              toValue: 0,
              duration:
                heroDuration,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),
        ])
      );

    const logoLoop =
      Animated.loop(
        Animated.sequence([
          Animated.delay(
            4200
          ),

          Animated.timing(
            logoGlow,
            {
              toValue: 0.16,
              duration: 420,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.timing(
            logoGlow,
            {
              toValue: 0.92,
              duration: 650,
              easing:
                Easing.out(
                  Easing.ease
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.timing(
            logoGlow,
            {
              toValue: 0.48,
              duration: 220,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.timing(
            logoGlow,
            {
              toValue: 0.82,
              duration: 520,
              easing:
                Easing.out(
                  Easing.ease
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.delay(
            7800
          ),
        ])
      );

    const ambientLoopOne =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            ambientOne,
            {
              toValue: 1,
              duration: 11000,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.timing(
            ambientOne,
            {
              toValue: 0,
              duration: 11000,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),
        ])
      );

    const ambientLoopTwo =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            ambientTwo,
            {
              toValue: 1,
              duration: 15000,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.timing(
            ambientTwo,
            {
              toValue: 0,
              duration: 15000,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),
        ])
      );

    const ambientLoopThree =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            ambientThree,
            {
              toValue: 1,
              duration: 9000,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),

          Animated.timing(
            ambientThree,
            {
              toValue: 0,
              duration: 9000,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver:
                Platform.OS !==
                "web",
            }
          ),
        ])
      );

    heroLoop.start();
    logoLoop.start();
    ambientLoopOne.start();
    ambientLoopTwo.start();
    ambientLoopThree.start();

    return () => {
      heroLoop.stop();
      logoLoop.stop();
      ambientLoopOne.stop();
      ambientLoopTwo.stop();
      ambientLoopThree.stop();
    };
  }, [
    heroMotion,
    logoGlow,
    ambientOne,
    ambientTwo,
    ambientThree,
    mobile,
  ]);

  useEffect(() => {
    if (
      featuredMovies.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        const next =
          (slide + 1) %
          featuredMovies.length;

        setPreviousSlide(
          slide
        );

        setSlide(next);

        slideProgress.setValue(
          0
        );

        Animated.timing(
          slideProgress,
          {
            toValue: 1,
            duration: 1500,
            easing:
              Easing.inOut(
                Easing.ease
              ),
            useNativeDriver:
              Platform.OS !==
              "web",
          }
        ).start();
      }, 7500);

    return () =>
      clearInterval(
        interval
      );
  }, [
    slide,
    slideProgress,
  ]);

  const checkVisibleMovies = (
    currentScroll: number
  ) => {
    if (
      !movieLayoutReadyRef
        .current.section ||
      !movieLayoutReadyRef
        .current.grid
    ) {
      return;
    }

    const trigger =
      currentScroll +
      height *
        (mobile ? 0.95 : 0.9);

    const sectionY =
      moviesSectionYRef.current;

    const gridY =
      moviesGridYRef.current;

    const idsToReveal: string[] =
      [];

    Object.entries(
      movieLocalPositionsRef.current
    ).forEach(
      ([id, localY]) => {
        const absoluteY =
          sectionY +
          gridY +
          localY;

        if (
          absoluteY <= trigger &&
          !revealedMoviesRef.current[
            id
          ]
        ) {
          idsToReveal.push(id);
        }
      }
    );

    if (
      idsToReveal.length ===
      0
    ) {
      return;
    }

    idsToReveal.forEach(
      (id) => {
        revealedMoviesRef.current[
          id
        ] = true;
      }
    );

    setRevealedMovies(
      (previous) => {
        const next = {
          ...previous,
        };

        idsToReveal.forEach(
          (id) => {
            next[id] = true;
          }
        );

        return next;
      }
    );
  };

  const registerMoviePosition =
    (
      id: string,
      localY: number
    ) => {
      movieLocalPositionsRef.current[
        id
      ] = localY;

      checkVisibleMovies(
        scrollOffsetRef.current
      );
    };

  useEffect(() => {
    movieLocalPositionsRef.current =
      {};

    revealedMoviesRef.current =
      {};

    setRevealedMovies({});

    movieLayoutReadyRef.current = {
      section: false,
      grid: false,
    };

    requestAnimationFrame(
      () => {
        movieLayoutReadyRef.current = {
          section: true,
          grid: true,
        };

        checkVisibleMovies(
          scrollOffsetRef.current
        );
      }
    );
  }, [
    filteredMovies.length,
    activeGenre,
  ]);

  const changeSlide = (
    index: number
  ) => {
    if (
      index === slide
    ) {
      return;
    }

    setPreviousSlide(
      slide
    );

    setSlide(index);

    slideProgress.stopAnimation();

    slideProgress.setValue(
      0
    );

    Animated.timing(
      slideProgress,
      {
        toValue: 1,
        duration: 1500,
        easing:
          Easing.inOut(
            Easing.ease
          ),
        useNativeDriver:
          Platform.OS !==
          "web",
      }
    ).start();
  };

 const goToMovie = (movie: any) => {
  const movieId =
    movie._source === "demo"
      ? `demo-${movie.id}`
      : String(movie.id);

  router.push({
    pathname: "/movie/[id]",
    params: { id: movieId },
  });
};
  const goToMovies = () => {
    scrollRef.current?.scrollTo(
      {
        y: Math.max(
          0,
          moviesSectionYRef.current -
            (mobile ? 12 : 10)
        ),
        animated: true,
      }
    );
  };

  const goToSessions = () => {
    scrollRef.current?.scrollTo(
      {
        y: Math.max(
          0,
          sessionSectionYRef.current -
            (mobile ? 12 : 10)
        ),
        animated: true,
      }
    );
  };

  const goHome = () => {
    scrollRef.current?.scrollTo(
      {
        y: 0,
        animated: true,
      }
    );
  };

  const heroMotionStyle = {
    transform: [
      {
        translateX:
          heroMotion.interpolate(
            {
              inputRange: [0, 1],
              outputRange: mobile
                ? [-30, 30]
                : [-22, 22],
            }
          ),
      },
      {
        translateY:
          heroMotion.interpolate(
            {
              inputRange: [0, 1],
              outputRange: mobile
                ? [8, -8]
                : [10, -10],
            }
          ),
      },
      {
        scale:
          heroMotion.interpolate(
            {
              inputRange: [0, 1],
              outputRange: mobile
                ? [1.012, 1.05]
                : [1.01, 1.045],
            }
          ),
      },
    ],
  };

  const renderHeroInfo = (
    movie: any,
    titleParts: {
      first: string;
      accent: string;
    }
  ) => (
    <>
      <View
        style={[
          styles.heroHudRow,
          mobile &&
            styles.heroHudRowMobile,
        ]}
      >
        <View
          style={[
            styles.heroBadge,
            mobile &&
              styles.heroBadgeMobile,
          ]}
        >
          <View
            style={
              styles.heroBadgeDot
            }
          />

          <Text
            style={[
              styles.heroBadgeText,
              mobile &&
                styles.heroBadgeTextMobile,
            ]}
          >
            EM DESTAQUE
          </Text>
        </View>
      </View>

      {titleParts.first ? (
        <Text
          style={[
            styles.heroTitle,
            mobile &&
              styles.heroTitleMobile,
            {
              fontFamily:
                customFontReady
                  ? CUSTOM_FONT_FAMILY
                  : "Arial",
            },
          ]}
        >
          {customFontReady
            ? removeAccents(
                titleParts.first
              ).toUpperCase()
            : titleParts.first.toUpperCase()}
        </Text>
      ) : null}

      <Text
        style={[
          styles.heroTitleAccent,
          mobile &&
            styles.heroTitleAccentMobile,
          {
            fontFamily:
              customFontReady
                ? CUSTOM_FONT_FAMILY
                : "Arial",
          },
        ]}
      >
        {customFontReady
          ? removeAccents(
              titleParts.accent
            ).toUpperCase()
          : titleParts.accent.toUpperCase()}
      </Text>

      <View
        style={[
          styles.heroInfoRow,
          mobile &&
            styles.heroInfoRowMobile,
        ]}
      >
        <HudChip
          mobile={mobile}
          label="GÊNERO"
          value={getMovieGenre(
            movie
          ).toUpperCase()}
        />

        <HudChip
          mobile={mobile}
          label="DURAÇÃO"
          value={getMovieDuration(
            movie
          ).toUpperCase()}
        />

        <HudChip
          mobile={mobile}
          label="CLASSIF."
          value={getMovieRating(
            movie
          ).toUpperCase()}
        />
      </View>

      <Text
        style={[
          styles.heroDescription,
          mobile &&
            styles.heroDescriptionMobile,
        ]}
      >
        {getMovieDescription(
          movie
        )}
      </Text>
    </>
  );

  const backgroundStyleOne = {
    transform: [
      {
        translateX:
          ambientOne.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                -70,
                100,
              ],
            }
          ),
      },
      {
        translateY:
          ambientOne.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                30,
                -90,
              ],
            }
          ),
      },
      {
        scale:
          ambientOne.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                1,
                1.2,
              ],
            }
          ),
      },
    ],
  };

  const backgroundStyleTwo = {
    transform: [
      {
        translateX:
          ambientTwo.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                80,
                -90,
              ],
            }
          ),
      },
      {
        translateY:
          ambientTwo.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                -40,
                90,
              ],
            }
          ),
      },
      {
        scale:
          ambientTwo.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                1.1,
                0.9,
              ],
            }
          ),
      },
    ],
  };

  const backgroundStyleThree = {
    transform: [
      {
        translateX:
          ambientThree.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                35,
                -70,
              ],
            }
          ),
      },
      {
        translateY:
          ambientThree.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                20,
                -50,
              ],
            }
          ),
      },
      {
        scale:
          ambientThree.interpolate(
            {
              inputRange: [0, 1],
              outputRange: [
                0.92,
                1.1,
              ],
            }
          ),
      },
    ],
  };

  const renderMovieCard =
    (
      movie: any,
      index: number,
      rowIndex: number
    ) => {
      const id =
        getMovieId(
          movie,
          index
        );

      return (
        <MovieCard
          key={id}
          movie={movie}
          width={
            cardWidth
          }
          revealed={true}
          revealDelay={
            rowIndex *
            (mobile
              ? 70
              : 90)
          }
          customFontReady={
            customFontReady
          }
          mobile={
            mobile
          }
          onLayout={(
            y
          ) =>
            registerMoviePosition(
              id,
              y
            )
          }
          onPress={() =>
            goToMovie(
              movie
            )
          }
        />
      );
    };
    console.log(
  "COLUNAS:",
  columns,
  "CARD WIDTH:",
  cardWidth
);

console.log(
  "FILME CADASTRADO:",
  filteredMovies.find(
    (movie: any) => movie._source === "database"
  )
);

  return (
    <View
      style={styles.root}
    >
      <View
        pointerEvents="none"
        style={
          styles.background
        }
      >
        <Animated.View
          style={[
            styles.backgroundBlob,
            styles.backgroundPurple,
            backgroundStyleOne,
          ]}
        />

        <Animated.View
          style={[
            styles.backgroundBlob,
            styles.backgroundBlue,
            backgroundStyleTwo,
          ]}
        />

        <Animated.View
          style={[
            styles.backgroundBlob,
            styles.backgroundRed,
            backgroundStyleThree,
          ]}
        />

        <View
          style={
            styles.backgroundGlow
          }
        />

        <View
          style={
            styles.backgroundRingLarge
          }
        />

        <View
          style={
            styles.backgroundRingSmall
          }
        />

        <View
          style={[
            styles.backgroundGridHorizontal,
            {
              top: mobile
                ? 430
                : 460,
            },
          ]}
        />

        <View
          style={[
            styles.backgroundGridHorizontal,
            {
              top: mobile
                ? 1040
                : 1080,
            },
          ]}
        />

        <View
          style={[
            styles.backgroundGridHorizontal,
            {
              top: mobile
                ? 1660
                : 1680,
            },
          ]}
        />

        <View
          style={[
            styles.backgroundGridVertical,
            {
              left: mobile
                ? "22%"
                : "12%",
            },
          ]}
        />

        <View
          style={[
            styles.backgroundGridVertical,
            {
              right: mobile
                ? "22%"
                : "12%",
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.navbarContainer,
          mobile &&
            styles.navbarContainerMobile,
          Platform.OS === "web"
            ? ({
                position:
                  "fixed",
              } as any)
            : {},
        ]}
      >
        <View
          style={[
            styles.navbar,
            mobile &&
              styles.navbarMobile,
          ]}
        >
          <View
            style={
              styles.navbarShine
            }
          />

          <View
            style={
              styles.navbarCorner
            }
          />

          <HoverButton
            onPress={
              goHome
            }
          >
            <View
              style={[
                styles.logoArea,
                mobile &&
                  styles.logoAreaMobile,
              ]}
            >
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.logoGlowOuter,
                  mobile &&
                    styles.logoGlowOuterMobile,
                  {
                    opacity:
                      logoGlow.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],
                          outputRange: [
                            0.015,
                            0.3,
                          ],
                        }
                      ),
                  },
                ]}
              />

              <Animated.View
                pointerEvents="none"
                style={[
                  styles.logoGlowInner,
                  mobile &&
                    styles.logoGlowInnerMobile,
                  {
                    opacity:
                      logoGlow.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],
                          outputRange: [
                            0.06,
                            1,
                          ],
                        }
                      ),
                  },
                ]}
              />

              <Image
                source={
                  LOGO_SOURCE
                }
                resizeMode="contain"
                style={[
                  styles.logo,
                  mobile &&
                    styles.logoMobile,
                ]}
              />
            </View>
          </HoverButton>

          {desktop ? (
            <View
              style={
                styles.navLinks
              }
            >
              <NavItem
                label="INÍCIO"
                active
                onPress={
                  goHome
                }
              />

              <NavItem
                label="FILMES"
                onPress={
                  goToMovies
                }
              />

              <NavItem
                label="SESSÕES"
                onPress={
                  goToSessions
                }
              />
            </View>
          ) : (
            <Pressable
              onPress={
                goToMovies
              }
              style={[
                styles.mobileNavStatus,
                mobile &&
                  styles.mobileNavStatusMobile,
              ]}
            >
              <View
                style={[
                  styles.mobileNavDot,
                  mobile &&
                    styles.mobileNavDotMobile,
                ]}
              />

              <Text
                style={[
                  styles.mobileNavText,
                  mobile &&
                    styles.mobileNavTextMobile,
                ]}
              >
                FILMES
              </Text>
            </Pressable>
          )}

          <View
            style={
              styles.navActions
            }
          >
            {tablet ? (
              <View
                style={[
                  styles.search,
                  searchFocused &&
                    styles.searchFocused,
                ]}
              >
                <TextInput
                  value={
                    search
                  }
                  onChangeText={
                    setSearch
                  }
                  placeholder="O que você quer assistir?"
                  placeholderTextColor={
                    COLORS.mutedDark
                  }
                  onFocus={() =>
                    setSearchFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setSearchFocused(
                      false
                    )
                  }
                  style={
                    styles.searchInput
                  }
                />
              </View>
            ) : null}

            {desktop ? (
              <HoverButton
                onPress={
                  goToMovies
                }
              >
                <View
                  style={
                    styles.ticketButton
                  }
                >
                  <Text
                    style={
                      styles.ticketText
                    }
                  >
                    INGRESSOS
                  </Text>

                  <Text
                    style={
                      styles.ticketArrow
                    }
                  >
                    →
                  </Text>
                </View>
              </HoverButton>
            ) : null}

            <HoverButton
              onPress={() =>
                router.push(
                  "/cadastro"
                )
              }
            >
              <View
                style={[
                  styles.profileButton,
                  mobile &&
                    styles.profileButtonMobile,
                ]}
              >
                <View
                  style={[
                    styles.profileIconCircle,
                    mobile &&
                      styles.profileIconCircleMobile,
                  ]}
                >
                  <View
                    style={[
                      styles.profileIconHead,
                      mobile &&
                        styles.profileIconHeadMobile,
                    ]}
                  />

                  <View
                    style={[
                      styles.profileIconBody,
                      mobile &&
                        styles.profileIconBodyMobile,
                    ]}
                  />
                </View>
              </View>
            </HoverButton>
          </View>
        </View>
      </View>

      <ScrollView
        ref={
          scrollRef
        }
        style={
          styles.scroll
        }
        contentContainerStyle={[
          styles.content,
          {
            flexGrow: 1,
            paddingBottom: 0,
          },
        ]}
        showsVerticalScrollIndicator={
          false
        }
        scrollEventThrottle={
          16
        }
        keyboardShouldPersistTaps="handled"
        onScroll={(
          event
        ) => {
          const y =
            event.nativeEvent
              .contentOffset.y;

          scrollOffsetRef.current =
            y;

          checkVisibleMovies(
            y
          );
        }}
      >
        <View
          style={[
            styles.topHeroSpacer,
            mobile &&
              styles.topHeroSpacerMobile,
          ]}
        />

        <View
          style={[
            styles.hero,
            {
              height:
                heroHeight,
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroImageTransition,
              {
                opacity:
                  slideProgress.interpolate(
                    {
                      inputRange: [
                        0,
                        1,
                      ],
                      outputRange: [
                        1,
                        0,
                      ],
                    }
                  ),
              },
            ]}
          >
            {getMovieHero(
              oldMovie
            ) ? (
              <Animated.Image
                source={
                  getMovieHero(
                    oldMovie
                  )
                }
                resizeMode="cover"
                style={[
                  styles.heroImage,
                  heroMotionStyle,
                ]}
              />
            ) : (
              <View
                style={[
                  styles.heroImage,
                  {
                    backgroundColor:
                      COLORS.background,
                  },
                ]}
              />
            )}
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroImageTransition,
              {
                opacity:
                  slideProgress,
              },
            ]}
          >
            {getMovieHero(
              currentMovie
            ) ? (
              <Animated.Image
                source={
                  getMovieHero(
                    currentMovie
                  )
                }
                resizeMode="cover"
                style={[
                  styles.heroImage,
                  heroMotionStyle,
                ]}
              />
            ) : (
              <View
                style={[
                  styles.heroImage,
                  {
                    backgroundColor:
                      COLORS.background,
                  },
                ]}
              />
            )}
          </Animated.View>

          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(12,6,45,0.94)",
              "rgba(12,6,45,0.70)",
              "rgba(12,6,45,0.28)",
              "transparent",
            ]}
            locations={[
              0,
              0.18,
              0.48,
              1,
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 0,
              y: 1,
            }}
            style={
              styles.heroTopGradient
            }
          />

          <LinearGradient
            pointerEvents="none"
            colors={[
              mobile
                ? "rgba(12,6,45,0.82)"
                : "rgba(12,6,45,0.68)",
              mobile
                ? "rgba(12,6,45,0.40)"
                : "rgba(12,6,45,0.22)",
              "transparent",
            ]}
            locations={[
              0,
              mobile ? 0.52 : 0.48,
              1,
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 0,
            }}
            style={[
              styles.heroSideGradient,
              mobile &&
                styles.heroSideGradientMobile,
            ]}
          />

          <LinearGradient
            pointerEvents="none"
            colors={[
              "transparent",
              "rgba(12,6,45,0.10)",
              mobile
                ? "rgba(12,6,45,0.68)"
                : "rgba(12,6,45,0.55)",
              COLORS.background,
            ]}
            locations={[
              0,
              0.34,
              mobile ? 0.66 : 0.70,
              1,
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 0,
              y: 1,
            }}
            style={
              styles.heroBottomGradient
            }
          />

          <View
            style={[
              styles.heroHudLine,
              mobile &&
                styles.heroHudLineMobile,
            ]}
          />

          <View
            style={[
              styles.heroCornerTopRight,
              mobile &&
                styles.heroCornerTopRightMobile,
            ]}
          />

          <Animated.View
            style={[
              styles.heroContent,
              styles.heroContentOverlay,
              mobile &&
                styles.heroContentMobile,
              {
                paddingHorizontal:
                  sidePadding,
                opacity:
                  slideProgress,
                transform: [
                  {
                    translateX:
                      slideProgress.interpolate(
                        {
                          inputRange: [
                            0,
                            1,
                          ],
                          outputRange: [
                            mobile
                              ? 12
                              : 20,
                            0,
                          ],
                        }
                      ),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.heroText,
                mobile &&
                  styles.heroTextMobile,
              ]}
            >
              {renderHeroInfo(
                currentMovie,
                currentTitle
              )}
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroContent,
              styles.heroContentOverlay,
              mobile &&
                styles.heroContentMobile,
              {
                paddingHorizontal:
                  sidePadding,
                opacity:
                  slideProgress.interpolate(
                    {
                      inputRange: [
                        0,
                        1,
                      ],
                      outputRange: [
                        1,
                        0,
                      ],
                    }
                  ),
              },
            ]}
          >
            <View
              style={[
                styles.heroText,
                mobile &&
                  styles.heroTextMobile,
              ]}
            >
              {renderHeroInfo(
                oldMovie,
                oldTitle
              )}
            </View>
          </Animated.View>

          <View
            style={[
              styles.heroButtonsFixed,
              mobile &&
                styles.heroButtonsFixedMobile,
              {
                left: mobile
                  ? undefined
                  : sidePadding,
              },
            ]}
          >
            <HoverButton
              onPress={() =>
                goToMovie(
                  currentMovie
                )
              }
            >
              <View
                style={[
                  styles.heroPrimaryButton,
                  mobile &&
                    styles.heroPrimaryButtonMobile,
                ]}
              >
                <Text
                  style={[
                    styles.heroPrimaryText,
                    mobile &&
                      styles.heroPrimaryTextMobile,
                  ]}
                >
                  VER FILME
                </Text>

                <Text
                  style={
                    styles.heroPrimaryArrow
                  }
                >
                  →
                </Text>
              </View>
            </HoverButton>

            <HoverButton
              onPress={
                goToSessions
              }
            >
              <View
                style={[
                  styles.heroSecondaryButton,
                  mobile &&
                    styles.heroSecondaryButtonMobile,
                ]}
              >
                <Text
                  style={[
                    styles.heroSecondaryText,
                    mobile &&
                      styles.heroSecondaryTextMobile,
                  ]}
                >
                  VER SESSÕES
                </Text>
              </View>
            </HoverButton>
          </View>

          <View
            style={[
              styles.heroBottom,
              mobile &&
                styles.heroBottomMobile,
              {
                right:
                  desktop
                    ? 34
                    : undefined,
                bottom:
                  mobile
                    ? undefined
                    : 32,
              },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.heroMetaLabel,
                  mobile &&
                    styles.heroMetaLabelMobile,
                ]}
              >
                DESTAQUE
              </Text>

              <Text
                style={[
                  styles.heroMetaValue,
                  mobile &&
                    styles.heroMetaValueMobile,
                ]}
              >
                {String(
                  slide + 1
                ).padStart(
                  2,
                  "0"
                )}{" "}
                /{" "}
                {String(
                  featuredMovies.length
                ).padStart(
                  2,
                  "0"
                )}
              </Text>
            </View>

            <View
              style={[
                styles.heroIndicators,
                mobile &&
                  styles.heroIndicatorsMobile,
              ]}
            >
              {featuredMovies.map(
                (
                  movie: any,
                  index
                ) => (
                  <Pressable
                    key={getMovieId(
                      movie,
                      index
                    )}
                    onPress={() =>
                      changeSlide(
                        index
                      )
                    }
                  >
                    <View
                      style={[
                        styles.heroIndicator,
                        mobile &&
                          styles.heroIndicatorMobile,
                        index ===
                          slide &&
                          styles.heroIndicatorActive,
                        index ===
                          slide &&
                          mobile &&
                          styles.heroIndicatorActiveMobile,
                      ]}
                    />
                  </Pressable>
                )
              )}
            </View>
          </View>
        </View>

        <View
          onLayout={(
            event
          ) => {
            sessionSectionYRef.current =
              event.nativeEvent.layout.y;
          }}
          style={[
            styles.sessionHudWrap,
            mobile &&
              styles.sessionHudWrapMobile,
            {
              paddingHorizontal:
                sidePadding,
            },
          ]}
        >
          <SessionHud
            mobile={
              mobile
            }
          />
        </View>

        <View
          onLayout={(
            event
          ) => {
            moviesSectionYRef.current =
              event.nativeEvent.layout.y;

            movieLayoutReadyRef.current.section =
              true;

            requestAnimationFrame(
              () => {
                checkVisibleMovies(
                  scrollOffsetRef.current
                );
              }
            );
          }}
          style={[
            styles.moviesArea,
            mobile &&
              styles.moviesAreaMobile,
            {
              paddingHorizontal:
                sidePadding,
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={
              styles.moviesGlowLeft
            }
          />

          <View
            pointerEvents="none"
            style={
              styles.moviesGlowRight
            }
          />

          <View
            style={[
              styles.sectionHeader,
              mobile &&
                styles.sectionHeaderMobile,
            ]}
          >
            <View>
              <Text
                style={[
                  styles.sectionEyebrow,
                  mobile &&
                    styles.sectionEyebrowMobile,
                ]}
              >
                AGORA NO CINEMA
              </Text>

              <Text
                style={[
                  styles.sectionTitle,
                  mobile &&
                    styles.sectionTitleMobile,
                ]}
              >
                Em cartaz
              </Text>
            </View>
          </View>

          {mobile ? (
            <View
              style={[
                styles.mobileSearchWrap,
                styles.mobileSearchWrapVisible,
              ]}
            >
              <View
                style={[
                  styles.mobileSearch,
                  searchFocused &&
                    styles.searchFocused,
                ]}
              >
                <TextInput
                  value={
                    search
                  }
                  onChangeText={
                    setSearch
                  }
                  placeholder="Buscar filme..."
                  placeholderTextColor={
                    COLORS.mutedDark
                  }
                  onFocus={() =>
                    setSearchFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setSearchFocused(
                      false
                    )
                  }
                  style={
                    styles.mobileSearchInput
                  }
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {search.length >
                0 ? (
                  <Pressable
                    onPress={() =>
                      setSearch(
                        ""
                      )
                    }
                    style={
                      styles.searchClearButton
                    }
                  >
                    <Text
                      style={
                        styles.searchClear
                      }
                    >
                      ×
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : null}

          {mobile ? (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={
                false
              }
              pagingEnabled={
                false
              }
              snapToInterval={
                mobileCarouselPageWidth
              }
              snapToAlignment="start"
              decelerationRate="fast"
              directionalLockEnabled
              contentContainerStyle={{
                paddingRight: 0,
              }}
            >
              <View
                style={
                  styles.mobileMovieCarousel
                }
              >
                {mobileMoviePages.map(
                  (
                    page,
                    pageIndex
                  ) => (
                    <View
                      key={`page-${pageIndex}`}
                      style={[
                        styles.mobileMovieCarouselPage,
                        {
                          width:
                            mobileCarouselPageWidth,
                          marginRight:
                            pageIndex <
                            mobileMoviePages.length -
                              1
                              ? gap
                              : 0,
                        },
                      ]}
                    >
                      {page.map(
                        (
                          column,
                          columnIndex
                        ) => (
                          <View
                            key={`column-${pageIndex}-${columnIndex}`}
                            style={[
                              styles.mobileMovieCarouselColumn,
                              {
                                width:
                                  cardWidth,
                                marginRight:
                                  columnIndex <
                                  page.length -
                                    1
                                    ? gap
                                    : 0,
                              },
                            ]}
                          >
                            {column.map(
                              (
                                item,
                                rowIndex
                              ) =>
                                renderMovieCard(
                                  item.movie,
                                  item.index,
                                  rowIndex
                                )
                            )}
                          </View>
                        )
                      )}
                    </View>
                  )
                )}
              </View>
            </ScrollView>
          ) : (
            <View
              onLayout={(
                event
              ) => {
                moviesGridYRef.current =
                  event.nativeEvent.layout.y;

                movieLayoutReadyRef.current.grid =
                  true;

                requestAnimationFrame(
                  () => {
                    checkVisibleMovies(
                      scrollOffsetRef.current
                    );
                  }
                );
              }}
              style={
                styles.moviesGrid
              }
            >
              {filteredMovies.map(
                (
                  movie: any,
                  index
                ) =>
                  renderMovieCard(
                    movie,
                    index,
                    index %
                      columns
                  )
              )}
            </View>
          )}

          {mobile ? (
            <View
              style={
                styles.mobileCarouselHint
              }
            >
              <View
                style={
                  styles.mobileCarouselHintLine
                }
              />

              <Text
                style={
                  styles.mobileCarouselHintText
                }
              >
                DESLIZE PARA VER MAIS
              </Text>

              <Text
                style={
                  styles.mobileCarouselHintArrow
                }
              >
                →
              </Text>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.footer,
            mobile &&
              styles.footerMobile,
            {
              marginTop:
                "auto",
            } as any,
          ]}
        >
          <View>
            <Text
              style={[
                styles.footerLogo,
                mobile &&
                  styles.footerLogoMobile,
                {
                  fontFamily:
                    "Arial",
                  fontWeight:
                    "800",
                },
              ]}
            >
              CINEMINHA
            </Text>

            <Text
              style={[
                styles.footerTagline,
                mobile &&
                  styles.footerTaglineMobile,
              ]}
            >
              Seu cinema, do seu jeito.
            </Text>
          </View>

          <View
            style={[
              styles.footerLinks,
              mobile &&
                styles.footerLinksMobile,
            ]}
          >
            <Text
              style={[
                styles.footerLink,
                mobile &&
                  styles.footerLinkMobile,
              ]}
            >
              FILMES
            </Text>

            <Text
              style={[
                styles.footerLink,
                mobile &&
                  styles.footerLinkMobile,
              ]}
            >
              SESSÕES
            </Text>

            <Text
              style={[
                styles.footerLink,
                mobile &&
                  styles.footerLinkMobile,
              ]}
            >
              INGRESSOS
            </Text>

            <Text
              style={[
                styles.footerLink,
                mobile &&
                  styles.footerLinkMobile,
              ]}
            >
              CONTATO
            </Text>
          </View>

          <Text
            style={[
              styles.footerCopy,
              mobile &&
                styles.footerCopyMobile,
            ]}
          >
            © 2026 CINEMINHA
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}