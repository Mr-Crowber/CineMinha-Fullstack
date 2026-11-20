import { StyleSheet } from "react-native";

export const COLORS = {
  background: "#0C062D",
  backgroundSoft: "#100737",
  blue: "#181DCF",
  blueDeep: "#111596",
  purple: "#6D31E1",
  purpleDark: "#3C1B83",
  red: "#F51F3B",
  redDark: "#A9142A",
  white: "#F5F3FF",
  muted: "#AAA2D4",
  mutedDark: "#71689C",
  surface: "#15103D",
  surfaceLight: "#1C1450",
  border: "#33257A",
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    minHeight: "100%",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },

  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },

  backgroundPurple: {
    width: 620,
    height: 620,
    right: -250,
    top: 80,
    backgroundColor: COLORS.purpleDark,
    opacity: 0.24,
  },

  backgroundBlue: {
    width: 520,
    height: 520,
    left: -230,
    top: 680,
    backgroundColor: COLORS.blueDeep,
    opacity: 0.18,
  },

  backgroundRed: {
    width: 330,
    height: 330,
    right: -120,
    top: 1050,
    backgroundColor: COLORS.redDark,
    opacity: 0.1,
  },

  backgroundGlow: {
    position: "absolute",
    width: 780,
    height: 780,
    borderRadius: 780,
    borderWidth: 1,
    borderColor: COLORS.purple,
    opacity: 0.055,
    left: "50%",
    marginLeft: -390,
    top: 700,
  },

  backgroundRingLarge: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 520,
    borderWidth: 1,
    borderColor: COLORS.blue,
    opacity: 0.06,
    left: -330,
    top: 1350,
  },

  backgroundRingSmall: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 250,
    borderWidth: 1,
    borderColor: COLORS.red,
    opacity: 0.08,
    right: -150,
    top: 1700,
  },

  backgroundGridHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.purple,
    opacity: 0.035,
  },

  backgroundGridVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: COLORS.purple,
    opacity: 0.035,
  },

  navbarContainer: {
    position: "absolute",
    top: 15,
    left: 16,
    right: 16,
    zIndex: 100,
  },

  navbar: {
    minHeight: 82,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.24)",
    borderRadius: 20,
    backgroundColor: "rgba(12,6,45,0.58)",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.purple,
    shadowOpacity: 0.08,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    backdropFilter: "blur(24px)",
  } as any,

  navbarShine: {
    position: "absolute",
    left: 20,
    right: 20,
    top: 0,
    height: 1,
    backgroundColor: "rgba(245,243,255,0.08)",
  },

  navbarCorner: {
    position: "absolute",
    right: 14,
    top: 10,
    width: 22,
    height: 6,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.red,
    opacity: 0.45,
  },

  logoArea: {
    width: 210,
    height: 68,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  logo: {
    width: 194,
    height: 58,
    zIndex: 3,
  },

  logoGlowOuter: {
    position: "absolute",
    width: 110,
    height: 110,
    left: "50%",
    marginLeft: -56,
    top: -20,
    borderRadius: 55,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  logoGlowInner: {
    position: "absolute",
    width: 52,
    height: 52,
    left: "50%",
    marginLeft: -26.5,
    top: 8,
    borderRadius: 26,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.8,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  navLinks: {
    position: "absolute",
    left: "50%",
    transform: [
      {
        translateX: -135,
      },
    ],
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  navLink: {
    minWidth: 90,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  navLinkUnderline: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 5,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.7,
    shadowRadius: 7,
  },

  mobileNavStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
    marginLeft: 9,
  },

  mobileNavDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.9,
    shadowRadius: 7,
  },

  mobileNavText: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  search: {
    width: 300,
    height: 44,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.38)",
    borderRadius: 12,
    backgroundColor: "rgba(21,16,61,0.54)",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 11,
    paddingRight: 5,
    shadowColor: COLORS.purple,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    backdropFilter: "blur(20px)",
  } as any,

  searchFocused: {
    borderColor: "rgba(245,31,59,0.58)",
    backgroundColor: "rgba(21,16,61,0.66)",
    shadowColor: COLORS.red,
    shadowOpacity: 0.12,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  searchLabelWrap: {
    height: 24,
    paddingHorizontal: 8,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(170,162,212,0.11)",
    marginRight: 9,
  },

  searchLabel: {
    color: COLORS.red,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  searchInput: {
    flex: 1,
    height: 42,
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 0,
    outlineStyle: "none",
  } as any,

  searchClearButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245,31,59,0.08)",
  },

  searchClear: {
    color: COLORS.red,
    fontFamily: "Arial",
    fontSize: 19,
    lineHeight: 19,
  },

  mobileSearchWrap: {
    marginTop: 14,
    paddingBottom: 2,
  },

  mobileSearch: {
    width: "100%",
    minHeight: 48,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.34)",
    borderRadius: 13,
    backgroundColor: "rgba(21,16,61,0.62)",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 13,
    paddingRight: 6,
    shadowColor: COLORS.purple,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    backdropFilter: "blur(18px)",
  } as any,

  mobileSearchInput: {
    flex: 1,
    minHeight: 46,
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 13,
    fontWeight: "600",
    paddingVertical: 0,
    outlineStyle: "none",
  } as any,

  ticketButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: COLORS.red,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: COLORS.red,
    shadowOpacity: 0.25,
    shadowRadius: 13,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  ticketText: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1,
  },

  ticketArrow: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "700",
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.34)",
    backgroundColor: "rgba(21,16,61,0.48)",
    justifyContent: "center",
    alignItems: "center",
  },

  profileIconCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245,243,255,0.2)",
    backgroundColor: "rgba(109,49,225,0.08)",
    position: "relative",
    overflow: "hidden",
  },

  profileIconHead: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    position: "absolute",
    top: 5,
    left: 9,
  },

  profileIconBody: {
    width: 15,
    height: 8,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    position: "absolute",
    bottom: -1,
    left: 5,
  },

  topHeroSpacer: {
    height: 112,
  },

  hero: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },

  heroImageLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },

  heroImageTransition: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },

  heroImage: {
    position: "absolute",
    width: "108%",
    height: "108%",
    left: "-4%",
    top: "-4%",
  },

  heroTopGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "32%",
  },

  heroSideGradient: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "67%",
  },

  heroBottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "66%",
  },

  heroHudLine: {
    position: "absolute",
    left: 0,
    width: 310,
    height: 1,
    backgroundColor: COLORS.purple,
    opacity: 0.38,
  },

  heroCornerTopRight: {
    position: "absolute",
    right: 36,
    top: 118,
    width: 52,
    height: 52,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.purple,
    opacity: 0.3,
  },

  heroContent: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "flex-end",
    paddingBottom: 165,
  },

  heroContentOverlay: {
    zIndex: 4,
  },

  heroText: {
    maxWidth: 740,
  },

  heroHudRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "rgba(245,31,59,0.48)",
    borderRadius: 100,
    backgroundColor: "rgba(12,6,45,0.34)",
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 1,
    shadowRadius: 7,
  },

  heroBadgeText: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  heroTitle: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 56,
    lineHeight: 54,
    fontWeight: "900",
    letterSpacing: -2.1,
  },

  heroTitleAccent: {
    color: COLORS.red,
    fontFamily: "Arial",
    fontSize: 56,
    lineHeight: 54,
    fontWeight: "900",
    letterSpacing: -2.1,
    textShadowColor: "rgba(245,31,59,0.35)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 15,
  },

  heroInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },

  hudChip: {
    minWidth: 88,
    minHeight: 49,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.42)",
    borderRadius: 11,
    backgroundColor: "rgba(12,6,45,0.34)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
  },

  hudChipLabel: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1,
  },

  hudChipValue: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "900",
    marginTop: 4,
  },

  heroDescription: {
    color: "rgba(245,243,255,0.78)",
    fontFamily: "Arial",
    fontSize: 13,
    lineHeight: 21,
    maxWidth: 540,
    marginTop: 17,
  },

  heroButtonsFixed: {
    position: "absolute",
    bottom: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 10,
  },

  heroPrimaryButton: {
    minWidth: 150,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 11,
    backgroundColor: COLORS.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.red,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  heroPrimaryText: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heroPrimaryArrow: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 17,
    fontWeight: "700",
  },

  heroSecondaryButton: {
    height: 46,
    paddingHorizontal: 17,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(245,243,255,0.19)",
    backgroundColor: "rgba(12,6,45,0.27)",
    justifyContent: "center",
  },

  heroSecondaryText: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heroBottom: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    zIndex: 8,
  },

  heroMetaLabel: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "800",
    marginBottom: 4,
  },

  heroMetaValue: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "900",
  },

  heroIndicators: {
    flexDirection: "row",
    gap: 6,
  },

  heroIndicator: {
    width: 30,
    height: 3,
    borderRadius: 3,
    backgroundColor: "rgba(245,243,255,0.2)",
  },

  heroIndicatorActive: {
    width: 48,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },

  sessionHudWrap: {
    marginTop: 42,
    zIndex: 5,
  },

  sessionHud: {
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.30)",
    borderRadius: 16,
    backgroundColor: "rgba(12, 6, 45, 0.41)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.27,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    backdropFilter: "blur(10px)",
  } as any,

  sessionHudCompact: {
    borderRadius: 14,
  },

  sessionHudTop: {
    minHeight: 70,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(109,49,225,0.2)",
    gap: 15,
  },

  sessionHudEyebrow: {
    color: COLORS.red,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  sessionHudTitle: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    marginTop: 4,
  },

  sessionLiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "rgba(21,16,61,0.54)",
  },

  sessionLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.9,
    shadowRadius: 7,
  },

  sessionLiveText: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  sessionControls: {
    padding: 14,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 14,
    flexWrap: "wrap",
  },

  sessionControl: {
    flex: 1,
    minWidth: 150,
    minHeight: 76,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: "rgba(21,16,61,0.45)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },

  sessionControlLabel: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  sessionControlValue: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "900",
    marginTop: 7,
  },

  sessionControlHint: {
    color: COLORS.purple,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    marginTop: 6,
  },

  sessionDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    opacity: 0.65,
  },

  sessionSearchWrap: {
    alignSelf: "stretch",
  },

  sessionSearchButton: {
    minWidth: 160,
    height: "100%",
    minHeight: 76,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.red,
    shadowOpacity: 0.2,
    shadowRadius: 12,
  } as any,

  sessionSearchText: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sessionSearchArrow: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "700",
  },

  moviesArea: {
    position: "relative",
    marginTop: 62,
    paddingBottom: 35,
  },

  moviesGlowLeft: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 500,
    backgroundColor: COLORS.purpleDark,
    opacity: 0.12,
    left: -300,
    top: 100,
  },

  moviesGlowRight: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 380,
    backgroundColor: COLORS.blueDeep,
    opacity: 0.11,
    right: -240,
    top: 520,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 19,
  },

  sectionEyebrow: {
    color: COLORS.red,
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 5,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 35,
    letterSpacing: -0.5,
  },

  filters: {
    flexDirection: "row",
    gap: 7,
    flexWrap: "wrap",
    marginBottom: 18,
  },

  filter: {
    minHeight: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 100,
    backgroundColor: "rgba(21,16,61,0.62)",
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  filterActive: {
    minHeight: 30,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 100,
    backgroundColor: COLORS.red,
    paddingHorizontal: 12,
    justifyContent: "center",
    shadowColor: COLORS.red,
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },

  filterText: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
  },

  filterActiveText: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
  },

  moviesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  movieCardReveal: {
    opacity: 0,
    transform: [
      {
        translateY: 30,
      },
      {
        scale: 0.97,
      },
    ],
  },

  movieCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  posterContainer: {
    width: "100%",
    aspectRatio: 0.69,
    backgroundColor: "#0F0834",
    overflow: "hidden",
    position: "relative",
  },

  posterImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  posterPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#100837",
  },

  posterColorOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: COLORS.purpleDark,
    opacity: 0.22,
    left: -100,
    top: -60,
  },

  posterColorTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: COLORS.blueDeep,
    opacity: 0.16,
    right: -80,
    bottom: -70,
  },

  posterIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(19,9,69,0.4)",
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },

  posterPlay: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: COLORS.red,
    marginLeft: 3,
    transform: [
      {
        rotate: "-45deg",
      },
    ],
  },

  posterPlaceholderText: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 22,
  },

  posterGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "52%",
  },

  movieHoverVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 2,
  },

  movieHoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },

  movieHoverCircleOuter: {
    position: "absolute",
    width: 194,
    height: 194,
    borderRadius: 97,
    borderWidth: 1,
    borderColor: "rgba(245,243,255,0.18)",
    backgroundColor: "rgba(245,31,59,0.04)",
    shadowColor: COLORS.red,
    shadowOpacity: 0.46,
    shadowRadius: 38,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  movieHoverCircle: {
    position: "absolute",
    width: 164,
    height: 164,
    borderRadius: 82,
    backgroundColor: "rgba(245,31,59,0.92)",
    shadowColor: COLORS.red,
    shadowOpacity: 0.95,
    shadowRadius: 33,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  movieHoverText: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 17,
  },

  movieHoverTitle: {
    color: COLORS.white,
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "100",
    textAlign: "center",
    letterSpacing: 0.25,
    maxWidth: 210,
    textShadowColor: "rgba(0,0,0,0.28)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 5,
  },

  movieHoverRule: {
    width: 34,
    height: 1,
    backgroundColor: "rgba(245,243,255,0.54)",
    marginTop: 11,
    marginBottom: 9,
  },

  movieHoverMeta: {
    color: "rgba(245,243,255,0.92)",
    fontFamily: "Arial",
    fontSize: 7,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.75,
  },

  movieHoverRating: {
    color: "rgba(245,243,255,0.74)",
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 5,
    letterSpacing: 0.8,
  },

  movieFooter: {
    minHeight: 78,
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 12,
    backgroundColor: "rgba(15,9,49,0.75)",
    justifyContent: "center",
  },

  movieFooterTitle: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    letterSpacing: 0.1,
  },

  movieFooterMeta: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "700",
    letterSpacing: 0.65,
    marginTop: 5,
  },

  footer: {
    minHeight: 136,
    marginTop: 75,
    paddingHorizontal: 42,
    paddingVertical: 25,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: "rgba(12,6,45,0.42)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 25,
    flexWrap: "wrap",
    backdropFilter: "blur(16px)",
  } as any,

  footerLogo: {
    color: COLORS.red,
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2.5,
  },

  footerTagline: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
    marginTop: 5,
  },

  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },

  footerLink: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1,
  },

  footerCopy: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
  },

  cadastroRoot: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: COLORS.background,
    position: "relative",
    overflow: "hidden",
  },

  cadastroBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: COLORS.background,
  },

  cadastroBackgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },

  cadastroBackgroundImage: {
    position: "absolute",
    width: "112%",
    height: "112%",
    left: "-6%",
    top: "-6%",
  },

  cadastroBackgroundTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12,6,45,0.10)",
    zIndex: 2,
  },

  cadastroBackgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
  },

  cadastroBackgroundBottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "72%",
    zIndex: 4,
  },

  cadastroBackgroundPurple: {
    position: "absolute",
    width: 560,
    height: 560,
    borderRadius: 280,
    backgroundColor: COLORS.purple,
    opacity: 0.07,
    left: -270,
    top: -120,
    zIndex: 5,
  },

  cadastroBackgroundBlue: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: COLORS.blue,
    opacity: 0.055,
    right: -270,
    bottom: -190,
    zIndex: 5,
  },

  cadastroBackgroundRed: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.red,
    opacity: 0.025,
    left: "50%",
    marginLeft: -160,
    top: "50%",
    marginTop: -160,
    zIndex: 5,
  },

  cadastroGridHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    backgroundColor: COLORS.white,
    opacity: 0.024,
    zIndex: 6,
  },

  cadastroGridVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: COLORS.white,
    opacity: 0.024,
    zIndex: 6,
  },

  cadastroBackWrap: {
    position: "absolute",
    top: 25,
    left: 26,
    zIndex: 50,
  },

  cadastroBackButton: {
    height: 42,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "rgba(170,162,212,0.16)",
    borderRadius: 11,
    backgroundColor: "rgba(12,6,45,0.38)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backdropFilter: "blur(18px)",
    shadowColor: COLORS.purple,
    shadowOpacity: 0.05,
    shadowRadius: 12,
  } as any,

  cadastroBackButtonHover: {
    borderColor: "rgba(245,31,59,0.40)",
    backgroundColor: "rgba(21,16,61,0.60)",
    shadowColor: COLORS.red,
    shadowOpacity: 0.11,
    shadowRadius: 14,
    transform: [
      {
        translateX: -2,
      },
    ],
  },

  cadastroBackArrow: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 17,
    fontWeight: "500",
  },

  cadastroBackText: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.05,
  },

  cadastroContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 38,
  },

  cadastroContentSmall: {
    paddingTop: 80,
    paddingBottom: 25,
  },

  cadastroTopInfo: {
    width: "100%",
    maxWidth: 570,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  cadastroTopInfoLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.55,
  },

  cadastroTopInfoText: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  cadastroCard: {
    width: "100%",
    maxWidth: 570,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.34)",
    borderRadius: 20,
    backgroundColor: "rgba(12,6,45,0.66)",
    paddingHorizontal: 36,
    paddingTop: 22,
    paddingBottom: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.42,
    shadowRadius: 38,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    backdropFilter: "blur(30px)",
  } as any,

  cadastroCardGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 250,
  },

  cadastroCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cadastroStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  cadastroStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.85,
    shadowRadius: 8,
  },

  cadastroStatusText: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1.15,
  },

  cadastroLogoWrap: {
    width: "100%",
    height: 92,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  cadastroLogo: {
    width: 255,
    height: 76,
    zIndex: 5,
  },

  cadastroLogoGlowOuter: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  cadastroLogoGlowInner: {
    position: "absolute",
    opacity: 0.5,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOpacity: 0.75,
    shadowRadius: 17,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  cadastroTitle: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "900",
    letterSpacing: -0.7,
    textAlign: "center",
    marginTop: 3,
  },

  cadastroSubtitle: {
    maxWidth: 390,
    color: COLORS.muted,
    fontFamily: "Arial",
    fontSize: 11,
    lineHeight: 18,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "center",
    marginTop: 7,
  },

  cadastroForm: {
    width: "100%",
    gap: 13,
    marginTop: 23,
  },

  cadastroFieldLabel: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1.25,
    marginBottom: 7,
  },

  cadastroField: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.30)",
    borderRadius: 11,
    backgroundColor: "rgba(21,16,61,0.38)",
    overflow: "hidden",
    justifyContent: "center",
  },

  cadastroFieldFocused: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(245,31,59,0.64)",
    borderRadius: 11,
    backgroundColor: "rgba(21,16,61,0.58)",
    overflow: "hidden",
    justifyContent: "center",
    shadowColor: COLORS.red,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },

  cadastroInput: {
    width: "100%",
    height: 47,
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 13,
    paddingVertical: 0,
    outlineStyle: "none",
  } as any,

  cadastroFieldAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.purple,
    opacity: 0.35,
  },

  cadastroFieldAccentActive: {
    backgroundColor: COLORS.red,
    opacity: 1,
    shadowColor: COLORS.red,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  cadastroSecurity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -2,
  },

  cadastroSecurityIcon: {
    width: 15,
    height: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(109,49,225,0.15)",
    color: COLORS.muted,
    fontFamily: "Arial",
    fontSize: 9,
    fontWeight: "700",
  },

  cadastroSecurityText: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 5,
    fontWeight: "800",
    letterSpacing: 0.55,
  },

  cadastroPrimaryButton: {
    width: "100%",
    height: 49,
    borderRadius: 11,
    backgroundColor: COLORS.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 19,
    shadowColor: COLORS.red,
    shadowOpacity: 0.22,
    shadowRadius: 17,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  cadastroPrimaryButtonHover: {
    backgroundColor: "#FF2945",
    shadowOpacity: 0.38,
    shadowRadius: 23,
    transform: [
      {
        translateY: -2,
      },
      {
        scale: 1.008,
      },
    ],
  },

  cadastroPrimaryButtonPressed: {
    backgroundColor: "#D91832",
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  cadastroPrimaryText: {
    color: COLORS.white,
    fontFamily: "monospace",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  cadastroPrimaryArrow: {
    color: COLORS.white,
    fontFamily: "Arial",
    fontSize: 18,
    fontWeight: "700",
  },

  cadastroDivider: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 16,
  },

  cadastroDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },

  cadastroDividerText: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 6,
    fontWeight: "900",
    letterSpacing: 1,
  },

  cadastroSecondaryButton: {
    width: "100%",
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgba(170,162,212,0.16)",
    backgroundColor: "rgba(21,16,61,0.26)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  cadastroSecondaryButtonHover: {
    borderColor: "rgba(109,49,225,0.58)",
    backgroundColor: "rgba(109,49,225,0.09)",
    shadowColor: COLORS.purple,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    transform: [
      {
        translateY: -1,
      },
    ],
  },

  cadastroSecondaryButtonPressed: {
    backgroundColor: "rgba(109,49,225,0.16)",
    transform: [
      {
        scale: 0.988,
      },
    ],
  },

  cadastroSecondaryText: {
    color: COLORS.muted,
    fontFamily: "monospace",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.95,
  },

  cadastroSecondaryArrow: {
    color: COLORS.muted,
    fontFamily: "Arial",
    fontSize: 15,
    fontWeight: "600",
  },

  cadastroCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 17,
  },

  cadastroCardBottomText: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 5,
    fontWeight: "900",
    letterSpacing: 0.75,
  },

  cadastroCardBottomLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.32,
  },

  cadastroFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },

  cadastroFooterText: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 5,
    fontWeight: "900",
    letterSpacing: 0.85,
  },

  cadastroFooterDot: {
    width: 3,
    height: 3,
    borderRadius: 3,
    backgroundColor: COLORS.red,
    opacity: 0.75,
  },

  /* MOBILE */

  navbarContainerMobile: {
    top: 10,
    left: 10,
    right: 10,
  },

  navbarMobile: {
    minHeight: 64,
    height: 64,
    borderRadius: 16,
    paddingHorizontal: 10,
  },

  logoAreaMobile: {
    width: 154,
    height: 54,
  },

  logoMobile: {
    width: 150,
    height: 47,
  },

  logoGlowOuterMobile: {
    width: 94,
    height: 94,
    marginLeft: -47,
    top: -15,
    borderRadius: 47,
  },

  logoGlowInnerMobile: {
    width: 44,
    height: 44,
    marginLeft: -22,
    top: 5,
    borderRadius: 22,
  },

  mobileNavStatusMobile: {
    flex: 0,
    marginLeft: 0,
    marginRight: 8,
    minWidth: 54,
    height: 38,
    paddingHorizontal: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(109,49,225,0.25)",
    backgroundColor: "rgba(21,16,61,0.35)",
    justifyContent: "center",
  },

  mobileNavDotMobile: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },

  mobileNavTextMobile: {
    color: COLORS.white,
    fontSize: 7,
    letterSpacing: 1,
  },

  profileButtonMobile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  profileIconCircleMobile: {
    width: 25,
    height: 25,
    borderRadius: 13,
  },

  profileIconHeadMobile: {
    top: 4,
    left: 8,
  },

  profileIconBodyMobile: {
    bottom: -1,
    left: 4,
  },

  topHeroSpacerMobile: {
    height: 84,
  },

  heroSideGradientMobile: {
    width: "94%",
  },

  heroHudLineMobile: {
    top: 92,
    width: 180,
    opacity: 0.24,
  },

  heroCornerTopRightMobile: {
    right: 16,
    top: 90,
    width: 34,
    height: 34,
    opacity: 0.22,
  },

  heroContentMobile: {
    paddingBottom: 153,
  },

  heroTextMobile: {
    maxWidth: "100%",
  },

  heroHudRowMobile: {
    marginBottom: 10,
  },

  heroBadgeMobile: {
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  heroBadgeTextMobile: {
    fontSize: 6,
    letterSpacing: 1.1,
  },

  heroTitleMobile: {
    fontSize: 38,
    lineHeight: 38,
    letterSpacing: -1.2,
  },

  heroTitleAccentMobile: {
    fontSize: 38,
    lineHeight: 38,
    letterSpacing: -1.2,
  },

  heroInfoRowMobile: {
    gap: 6,
    marginTop: 13,
  },

  hudChipMobile: {
    minWidth: 80,
    minHeight: 44,
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 10,
  },

  hudChipLabelMobile: {
    fontSize: 5.5,
    letterSpacing: 0.8,
  },

  hudChipValueMobile: {
    fontSize: 7,
    marginTop: 3,
  },

  heroDescriptionMobile: {
    fontSize: 11.5,
    lineHeight: 18,
    maxWidth: 350,
    marginTop: 13,
  },

  heroButtonsFixedMobile: {
    left: 14,
    right: 14,
    bottom: 63,
    gap: 8,
  },

  heroPrimaryButtonMobile: {
    flex: 1,
    minWidth: 0,
    height: 48,
    paddingHorizontal: 13,
    borderRadius: 12,
  },

  heroSecondaryButtonMobile: {
    flex: 1,
    height: 48,
    paddingHorizontal: 13,
    borderRadius: 12,
  },

  heroPrimaryTextMobile: {
    fontSize: 7,
    letterSpacing: 0.8,
  },

  heroSecondaryTextMobile: {
    fontSize: 7,
    letterSpacing: 0.8,
  },

  heroBottomMobile: {
    left: 16,
    right: 16,
    bottom: 20,
    justifyContent: "space-between",
    gap: 10,
  },

  heroMetaLabelMobile: {
    fontSize: 6,
    marginBottom: 3,
  },

  heroMetaValueMobile: {
    fontSize: 8,
  },

  heroIndicatorsMobile: {
    gap: 5,
  },

  heroIndicatorMobile: {
    width: 20,
    height: 3,
  },

  heroIndicatorActiveMobile: {
    width: 34,
  },

  sessionHudWrapMobile: {
    marginTop: 25,
  },

  sessionHudMobile: {
    borderRadius: 15,
  },

  sessionHudTopMobile: {
    minHeight: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 11,
  },

  sessionHudEyebrowMobile: {
    fontSize: 7,
    letterSpacing: 1.2,
  },

  sessionHudTitleMobile: {
    fontSize: 18,
    lineHeight: 23,
    marginTop: 5,
    maxWidth: 300,
  },

  sessionLiveBadgeMobile: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  sessionLiveTextMobile: {
    fontSize: 5.5,
  },

  sessionControlsMobile: {
    padding: 11,
    gap: 9,
    flexDirection: "column",
    flexWrap: "nowrap",
  },

  sessionControlMobile: {
    width: "100%",
    minWidth: 0,
    minHeight: 64,
    flex: 0,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
  },

  sessionControlLabelMobile: {
    fontSize: 6,
  },

  sessionControlValueMobile: {
    fontSize: 8,
    marginTop: 5,
  },

  sessionControlHintMobile: {
    fontSize: 5.5,
    marginTop: 4,
  },

  sessionSearchWrapMobile: {
    width: "100%",
    minHeight: 0,
  },

  sessionSearchButtonMobile: {
    width: "100%",
    minWidth: 0,
    height: 54,
    minHeight: 54,
    borderRadius: 11,
    paddingHorizontal: 14,
  },

  sessionSearchTextMobile: {
    fontSize: 7,
  },

  moviesAreaMobile: {
    marginTop: 40,
    paddingBottom: 26,
  },

  sectionHeaderMobile: {
    marginBottom: 0,
    alignItems: "flex-start",
  },

  sectionEyebrowMobile: {
    fontSize: 7,
    letterSpacing: 1.35,
    marginBottom: 4,
  },

  sectionTitleMobile: {
    fontSize: 29,
    lineHeight: 32,
    letterSpacing: -0.4,
  },

  mobileSearchWrapVisible: {
    marginTop: 14,
    marginBottom: 15,
  },

  filtersMobile: {
    flexWrap: "nowrap",
    gap: 7,
    marginBottom: 16,
  },

  filterMobile: {
    minHeight: 34,
    paddingHorizontal: 13,
  },

  filterActiveMobile: {
    minHeight: 34,
    paddingHorizontal: 13,
  },

  filterTextMobile: {
    fontSize: 7,
  },

  filterActiveTextMobile: {
    fontSize: 7,
  },

  moviesGridMobile: {
    gap: 10,
  },

    mobileMovieCarousel: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  mobileMovieCarouselPage: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  mobileMovieCarouselColumn: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  mobileCarouselHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 16,
    opacity: 0.72,
  },

  mobileCarouselHintLine: {
    width: 22,
    height: 1,
    backgroundColor: COLORS.border,
  },

  mobileCarouselHintText: {
    color: COLORS.mutedDark,
    fontFamily: "monospace",
    fontSize: 5.5,
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  mobileCarouselHintArrow: {
    color: COLORS.red,
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "700",
  },

  movieCardMobile: {
    borderRadius: 13,
  },

  posterContainerMobile: {
    aspectRatio: 0.68,
  },

  movieFooterMobile: {
    minHeight: 73,
    paddingHorizontal: 9,
    paddingTop: 9,
    paddingBottom: 9,
  },

  movieFooterTitleMobile: {
    fontSize: 12.5,
    lineHeight: 16,
  },

  movieFooterMetaMobile: {
    fontSize: 5.5,
    letterSpacing: 0.45,
    marginTop: 4,
  },

  footerMobile: {
    minHeight: 205,
    marginTop: 55,
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 19,
  },

  footerLinksMobile: {
    gap: 15,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  footerLogoMobile: {
    fontSize: 17,
  },

  footerTaglineMobile: {
    fontSize: 6.5,
  },

  footerLinkMobile: {
    fontSize: 6.5,
  },

  footerCopyMobile: {
    fontSize: 6.5,
  },
});