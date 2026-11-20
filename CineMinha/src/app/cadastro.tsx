import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    Platform,
    Pressable,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { movies } from "../movies";
import { COLORS, styles } from "../styles";

const LOGO_SOURCE = "/images/logo/cineminha.png";

export default function Cadastro() {
  const { width } = useWindowDimensions();

  const [bannerIndex, setBannerIndex] = useState(0);

  const [nameFocused, setNameFocused] =
    useState(false);

  const [emailFocused, setEmailFocused] =
    useState(false);

  const [passwordFocused, setPasswordFocused] =
    useState(false);

  const backgroundTransition = useRef(
    new Animated.Value(1)
  ).current;

  const backgroundMotion = useRef(
    new Animated.Value(0)
  ).current;

  const cardAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const logoAnimation = useRef(
    new Animated.Value(0)
  ).current;

  /*
   * Aqui usamos TODOS os filmes que possuem banner.
   * Assim o fundo da página vai passando pelo catálogo inteiro.
   */
  const backgroundMovies = movies.filter(
    (movie) => !!movie.heroImage
  );

  const currentBanner =
    backgroundMovies[bannerIndex];

  const previousBanner =
    backgroundMovies[
      (bannerIndex - 1 + backgroundMovies.length) %
        backgroundMovies.length
    ];

  useEffect(() => {
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 850,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundMotion, {
          toValue: 1,
          duration: 17000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(backgroundMotion, {
          toValue: 0,
          duration: 17000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnimation, {
          toValue: 1,
          duration: 4700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(logoAnimation, {
          toValue: 0,
          duration: 4700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (backgroundMovies.length <= 1) {
      return;
    }

    /*
     * Fica bastante tempo em cada filme e a troca
     * acontece lentamente para não parecer uma troca seca.
     */
    const timer = setInterval(() => {
      backgroundTransition.setValue(0);

      setBannerIndex(
        (current) =>
          (current + 1) %
          backgroundMovies.length
      );

      Animated.timing(
        backgroundTransition,
        {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }
      ).start();
    }, 6500);

    return () => clearInterval(timer);
  }, [
    backgroundMovies.length,
    backgroundTransition,
  ]);

  const backgroundTranslateX =
    backgroundMotion.interpolate({
      inputRange: [0, 1],
      outputRange: [-35, 35],
    });

  const backgroundTranslateY =
    backgroundMotion.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -10],
    });

  const backgroundScale =
    backgroundMotion.interpolate({
      inputRange: [0, 1],
      outputRange: [1.04, 1.115],
    });

  /*
   * A imagem que está saindo permanece visível por mais tempo.
   * A próxima entra lentamente.
   */
  const previousOpacity =
    backgroundTransition.interpolate({
      inputRange: [0, 0.25, 0.72, 1],
      outputRange: [0.34, 0.34, 0.16, 0],
    });

  const currentOpacity =
    backgroundTransition.interpolate({
      inputRange: [0, 0.28, 0.72, 1],
      outputRange: [0, 0.1, 0.27, 0.34],
    });

  const currentScale =
    backgroundTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [1.06, 1.04],
    });

  const previousScale =
    backgroundTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [1.04, 1.08],
    });

  const cardTranslateY =
    cardAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [26, 0],
    });

  const cardOpacity =
    cardAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

  const logoPulse =
    logoAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.06, 0.16],
    });

  const isSmallScreen =
    width < 650;

  return (
    <View style={styles.cadastroRoot}>
      {/* FUNDO */}
      <View
        pointerEvents="none"
        style={
          styles.cadastroBackground
        }
      >
        {previousBanner?.heroImage && (
          <Animated.View
            style={[
              styles.cadastroBackgroundLayer,
              {
                opacity:
                  previousOpacity,
              },
            ]}
          >
            <Animated.Image
              source={{
                uri: previousBanner.heroImage,
              }}
              resizeMode="cover"
              style={[
                styles.cadastroBackgroundImage,
                {
                  transform: [
                    {
                      translateX:
                        backgroundTranslateX,
                    },
                    {
                      translateY:
                        backgroundTranslateY,
                    },
                    {
                      scale:
                        previousScale,
                    },
                  ],
                },
                Platform.OS ===
                  "web"
                  ? ({
                      filter:
                        "blur(12px) saturate(1.32)",
                    } as any)
                  : {},
              ]}
            />
          </Animated.View>
        )}

        {currentBanner?.heroImage && (
          <Animated.View
            style={[
              styles.cadastroBackgroundLayer,
              {
                opacity:
                  currentOpacity,
              },
            ]}
          >
            <Animated.Image
              source={{
                uri: currentBanner.heroImage,
              }}
              resizeMode="cover"
              style={[
                styles.cadastroBackgroundImage,
                {
                  transform: [
                    {
                      translateX:
                        backgroundTranslateX,
                    },
                    {
                      translateY:
                        backgroundTranslateY,
                    },
                    {
                      scale:
                        currentScale,
                    },
                  ],
                },
                Platform.OS ===
                  "web"
                  ? ({
                      filter:
                        "blur(12px) saturate(1.32)",
                    } as any)
                  : {},
              ]}
            />
          </Animated.View>
        )}

        {/* ESCURECE SEM MATAR A IMAGEM */}
        <View
          style={
            styles.cadastroBackgroundTint
          }
        />

        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(12,6,45,0.56)",
            "rgba(12,6,45,0.30)",
            "rgba(12,6,45,0.62)",
          ]}
          locations={[
            0,
            0.48,
            1,
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={
            styles.cadastroBackgroundGradient
          }
        />

        <LinearGradient
          pointerEvents="none"
          colors={[
            "transparent",
            "rgba(12,6,45,0.58)",
          ]}
          locations={[0.35, 1]}
          start={{
            x: 0.5,
            y: 0,
          }}
          end={{
            x: 0.5,
            y: 1,
          }}
          style={
            styles.cadastroBackgroundBottomGradient
          }
        />

        <View
          style={
            styles.cadastroBackgroundPurple
          }
        />

        <View
          style={
            styles.cadastroBackgroundBlue
          }
        />

        <View
          style={
            styles.cadastroBackgroundRed
          }
        />

        <View
          style={
            styles.cadastroGridHorizontal
          }
        />

        <View
          style={[
            styles.cadastroGridVertical,
            {
              left: "17%",
            },
          ]}
        />

        <View
          style={[
            styles.cadastroGridVertical,
            {
              right: "17%",
            },
          ]}
        />
      </View>

      {/* VOLTAR */}
      <View
        style={styles.cadastroBackWrap}
      >
        <Link href="/" asChild>
          <Pressable>
            {({
              hovered,
            }) => (
              <View
                style={[
                  styles.cadastroBackButton,
                  hovered &&
                    styles.cadastroBackButtonHover,
                ]}
              >
                <Text
                  style={
                    styles.cadastroBackArrow
                  }
                >
                  ←
                </Text>

                <Text
                  style={
                    styles.cadastroBackText
                  }
                >
                  VOLTAR
                </Text>
              </View>
            )}
          </Pressable>
        </Link>
      </View>

      {/* CONTEÚDO */}
      <View
        style={[
          styles.cadastroContent,
          isSmallScreen &&
            styles.cadastroContentSmall,
        ]}
      >
        <View
          style={
            styles.cadastroTopInfo
          }
        >
          <View
            style={
              styles.cadastroTopInfoLine
            }
          />

          <Text
            style={
              styles.cadastroTopInfoText
            }
          >
            CINEMINHA // SUA CONTA
          </Text>

          <View
            style={
              styles.cadastroTopInfoLine
            }
          />
        </View>

        <Animated.View
          style={[
            styles.cadastroCard,
            {
              opacity: cardOpacity,
              transform: [
                {
                  translateY:
                    cardTranslateY,
                },
              ],
            },
          ]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={[
              "rgba(109,49,225,0.15)",
              "rgba(109,49,225,0.04)",
              "transparent",
            ]}
            locations={[
              0,
              0.38,
              1,
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={
              styles.cadastroCardGlow
            }
          />

          <View
            style={
              styles.cadastroCardTop
            }
          >
            <View
              style={
                styles.cadastroStatus
              }
            >
              <View
                style={
                  styles.cadastroStatusDot
                }
              />

              <Text
                style={
                  styles.cadastroStatusText
                }
              >
                NOVA CONTA
              </Text>
            </View>
          </View>

          <View
            style={
              styles.cadastroLogoWrap
            }
          >
            <Animated.View
              style={[
                styles.cadastroLogoGlowOuter,
                {
                  opacity:
                    logoPulse,
                },
              ]}
            />

            <Animated.View
              style={[
                styles.cadastroLogoGlowInner,
                {
                  opacity:
                    logoPulse.interpolate({
                      inputRange: [
                        0.06,
                        0.16,
                      ],
                      outputRange: [
                        0.11,
                        0.30,
                      ],
                    }),
                },
              ]}
            />

            <Image
              source={LOGO_SOURCE}
              resizeMode="contain"
              style={
                styles.cadastroLogo
              }
            />
          </View>

          <Text
            style={
              styles.cadastroTitle
            }
          >
            CRIE SUA CONTA
          </Text>

          <Text
            style={
              styles.cadastroSubtitle
            }
          >
            Entre para o Cineminha e
            tenha sua experiência de
            cinema em um só lugar.
          </Text>

          <View
            style={
              styles.cadastroForm
            }
          >
            <View>
              <Text
                style={
                  styles.cadastroFieldLabel
                }
              >
                NOME
              </Text>

              <View
                style={
                  nameFocused
                    ? styles.cadastroFieldFocused
                    : styles.cadastroField
                }
              >
                <TextInput
                  placeholder="Como podemos te chamar?"
                  placeholderTextColor={
                    COLORS.mutedDark
                  }
                  onFocus={() =>
                    setNameFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setNameFocused(
                      false
                    )
                  }
                  style={
                    styles.cadastroInput
                  }
                />

                <View
                  style={[
                    styles.cadastroFieldAccent,
                    nameFocused &&
                      styles.cadastroFieldAccentActive,
                  ]}
                />
              </View>
            </View>

            <View>
              <Text
                style={
                  styles.cadastroFieldLabel
                }
              >
                E-MAIL
              </Text>

              <View
                style={
                  emailFocused
                    ? styles.cadastroFieldFocused
                    : styles.cadastroField
                }
              >
                <TextInput
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor={
                    COLORS.mutedDark
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() =>
                    setEmailFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setEmailFocused(
                      false
                    )
                  }
                  style={
                    styles.cadastroInput
                  }
                />

                <View
                  style={[
                    styles.cadastroFieldAccent,
                    emailFocused &&
                      styles.cadastroFieldAccentActive,
                  ]}
                />
              </View>
            </View>

            <View>
              <Text
                style={
                  styles.cadastroFieldLabel
                }
              >
                SENHA
              </Text>

              <View
                style={
                  passwordFocused
                    ? styles.cadastroFieldFocused
                    : styles.cadastroField
                }
              >
                <TextInput
                  placeholder="Crie uma senha"
                  placeholderTextColor={
                    COLORS.mutedDark
                  }
                  secureTextEntry
                  onFocus={() =>
                    setPasswordFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setPasswordFocused(
                      false
                    )
                  }
                  style={
                    styles.cadastroInput
                  }
                />

                <View
                  style={[
                    styles.cadastroFieldAccent,
                    passwordFocused &&
                      styles.cadastroFieldAccentActive,
                  ]}
                />
              </View>
            </View>

            <View
              style={
                styles.cadastroSecurity
              }
            >
              <View
                style={
                  styles.cadastroSecurityIcon
                }
              >
                ✓
              </View>

              <Text
                style={
                  styles.cadastroSecurityText
                }
              >
                Seus dados ficam protegidos
                nesta interface.
              </Text>
            </View>
          </View>

          <Pressable>
            {({
              hovered,
              pressed,
            }) => (
              <View
                style={[
                  styles.cadastroPrimaryButton,
                  hovered &&
                    styles.cadastroPrimaryButtonHover,
                  pressed &&
                    styles.cadastroPrimaryButtonPressed,
                ]}
              >
                <Text
                  style={
                    styles.cadastroPrimaryText
                  }
                >
                  CRIAR CONTA
                </Text>

                <Text
                  style={
                    styles.cadastroPrimaryArrow
                  }
                >
                  →
                </Text>
              </View>
            )}
          </Pressable>

          <View
            style={
              styles.cadastroDivider
            }
          >
            <View
              style={
                styles.cadastroDividerLine
              }
            />

            <Text
              style={
                styles.cadastroDividerText
              }
            >
              OU
            </Text>

            <View
              style={
                styles.cadastroDividerLine
              }
            />
          </View>

          <Pressable>
            {({
              hovered,
              pressed,
            }) => (
              <View
                style={[
                  styles.cadastroSecondaryButton,
                  hovered &&
                    styles.cadastroSecondaryButtonHover,
                  pressed &&
                    styles.cadastroSecondaryButtonPressed,
                ]}
              >
                <Text
                  style={
                    styles.cadastroSecondaryText
                  }
                >
                  JÁ TENHO UMA CONTA
                </Text>

                <Text
                  style={
                    styles.cadastroSecondaryArrow
                  }
                >
                  ↗
                </Text>
              </View>
            )}
          </Pressable>

          <View
            style={
              styles.cadastroCardBottom
            }
          >
            <Text
              style={
                styles.cadastroCardBottomText
              }
            >
              CONTINUE PARA O SEU CINEMA
            </Text>

            <View
              style={
                styles.cadastroCardBottomLine
              }
            />
          </View>
        </Animated.View>

        <View
          style={
            styles.cadastroFooter
          }
        >
          <Text
            style={
              styles.cadastroFooterText
            }
          >
            CINEMINHA
          </Text>

          <View
            style={
              styles.cadastroFooterDot
            }
          />

          <Text
            style={
              styles.cadastroFooterText
            }
          >
            SUA SESSÃO COMEÇA AQUI
          </Text>
        </View>
      </View>
    </View>
  );
}