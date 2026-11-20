import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { COLORS, styles } from "../../styles";
import { movies as demoMovies } from "../../movies";
import { buyTickets, getMovies, getOccupiedSeats, getSessions, type Movie, type Session } from "../../services/api";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";


export default function MoviePage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sessoes, setSessoes] = useState<Session[]>([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Session | null>(null);
  const [lugaresOcupados, setLugaresOcupados] = useState<string[]>([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [comprando, setComprando] = useState(false);
  const [compraErro, setCompraErro] = useState<string | null>(null);
  const [compraSucesso, setCompraSucesso] = useState<{ pedidoId: string; quantidade: number; valorTotal: number } | null>(null);
  useEffect(() => {
    const loadMovies = () => getMovies()
      .then((dados) => {
        setMovies(dados);
        setErro(null);
      })
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
    loadMovies();
    const refresh = setInterval(loadMovies, 30000);
    return () => clearInterval(refresh);
  }, []);
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  useEffect(() => {
    if (!id || String(id).startsWith("demo-")) {
      setSessoes([]);
      return;
    }
    const loadSessions = () => getSessions(Number(id))
      .then((rows) => {
        setSessoes(rows);
        setSessaoSelecionada((current) => current ? rows.find((item) => item.id === current.id) ?? null : null);
      })
      .catch((error) => {
        console.error("Erro ao carregar sessões:", error);
        setSessoes([]);
      });
    loadSessions();
    const refresh = setInterval(loadSessions, 30000);
    return () => clearInterval(refresh);
  }, [id]);

  useEffect(() => {
    if (!sessaoSelecionada) {
      setLugaresOcupados([]);
      return;
    }
    const refreshOccupied = () => getOccupiedSeats(sessaoSelecionada.id)
      .then(setLugaresOcupados)
      .catch((error) => console.warn("Não foi possível atualizar os assentos:", error));
    refreshOccupied();
    const refresh = setInterval(refreshOccupied, 15000);
    return () => clearInterval(refresh);
  }, [sessaoSelecionada?.id]);

  const { width, height } = useWindowDimensions();

  const scrollRef = useRef<ScrollView>(null);

  /* ------------------ESTADOS ------------*/

  const [horarioSelecionado, setHorarioSelecionado] =
    useState<string | null>(null);

  const [lugaresSelecionados, setLugaresSelecionados] =
    useState<string[]>([]);

  const [etapaCompra, setEtapaCompra] =
    useState(false);

  const [quantidadeMeia, setQuantidadeMeia] =
    useState(0);

  const [quantidadeInteira, setQuantidadeInteira] =
    useState(0);

  const [pagamento, setPagamento] =
    useState<string | null>(null);

  /* -----------PROCURAR FILME--------------*/

 const apiMovie = movies.find(
  (item) => item.id === Number(id)
);
const demoMovie = id?.startsWith("demo-")
  ? demoMovies.find(
      (item) => item.id === Number(id.replace("demo-", ""))
    )
  : undefined;
const movie = apiMovie ?? demoMovie;

  /* -----------FILME NÃO ENCONTRADO----------*/
if (carregando) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#0C062D",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Text style={{ color: "white" }}>
        Carregando filme...
      </Text>
    </View>
  );
}

if (erro) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#0C062D",
      justifyContent: "center",
      alignItems: "center",
      padding: 25,
    }}>
      <Text style={{ color: "white" }}>
        {erro}
      </Text>
    </View>
  );
}
  if (!movie) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0C062D",
          padding: 40,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "900",
          }}
        >
          FILME NÃO ENCONTRADO
        </Text>

        <Pressable
          onPress={() => router.replace("/")}
        >
          <Text
            style={{
              color: "#F51F3B",
              fontSize: 18,
              fontWeight: "700",
              marginTop: 20,
            }}
          >
            ← Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  if (compraSucesso) {
    return (
      <View style={{
        flex: 1,
        minHeight: "100%",
        backgroundColor: "#0C062D",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
      }}>
        <View style={{
          width: "100%",
          maxWidth: 520,
          alignItems: "center",
          backgroundColor: "#17103D",
          borderRadius: 28,
          borderWidth: 1,
          borderColor: "#2C205D",
          paddingHorizontal: 28,
          paddingVertical: 38,
        }}>
          <View style={{
            width: 82,
            height: 82,
            borderRadius: 41,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(65, 210, 139, 0.13)",
            borderWidth: 1,
            borderColor: "rgba(115, 235, 170, 0.45)",
            marginBottom: 24,
          }}>
            <Text style={{ color: "#82E6B2", fontSize: 48, fontWeight: "900", lineHeight: 56 }}>✓</Text>
          </View>
          <Text style={{ color: "#82E6B2", fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 12 }}>
            CINEMINHA · PEDIDO REGISTRADO
          </Text>
          <Text style={{ color: "white", fontSize: 30, fontWeight: "900", textAlign: "center", marginBottom: 10 }}>
            Ingresso confirmado!
          </Text>
          <Text style={{ color: "#AAA2D4", fontSize: 15, lineHeight: 23, textAlign: "center", marginBottom: 26 }}>
            Seu pedido foi registrado e seus assentos estão reservados.
          </Text>
          <View style={{
            width: "100%",
            backgroundColor: "#0C062D",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#2C205D",
            padding: 18,
            marginBottom: 18,
          }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
              <Text style={{ color: "#77718F", fontSize: 11, fontWeight: "800" }}>PEDIDO</Text>
              <Text style={{ color: "white", fontSize: 13, fontWeight: "800" }}>{compraSucesso.pedidoId || "CONFIRMADO"}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
              <Text style={{ color: "#77718F", fontSize: 11, fontWeight: "800" }}>INGRESSOS</Text>
              <Text style={{ color: "white", fontSize: 13, fontWeight: "800" }}>{compraSucesso.quantidade}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <Text style={{ color: "#77718F", fontSize: 11, fontWeight: "800" }}>VALOR TOTAL</Text>
              <Text style={{ color: "white", fontSize: 15, fontWeight: "900" }}>
                {`R$ ${compraSucesso.valorTotal.toFixed(2).replace(".", ",")}`}
              </Text>
            </View>
          </View>
          <Text style={{ color: "#77718F", fontSize: 11, lineHeight: 17, textAlign: "center", marginBottom: 24 }}>
            Esta versão registra o pedido, mas ainda não processa cobranças reais por Pix ou cartão.
          </Text>
          <Pressable
            onPress={() => {
              setCompraSucesso(null);
              router.replace("/");
            }}
            style={({ pressed }) => ({
              width: "100%",
              minHeight: 56,
              borderRadius: 28,
              backgroundColor: "#F51F3B",
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.82 : 1,
            })}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "900", letterSpacing: 0.5 }}>
              VOLTAR AO CATÁLOGO DE FILMES
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isDesktop = width > 700;

  /* ------HORÁRIOS-------*/

  const horarios = sessoes;

  /* ---------LUGARES-----------*/

  // O mapa usa a capacidade cadastrada para a sala. O mesmo padrão de assentos
  // (A1, A2...) é utilizado pelo site para evitar divergência entre canais.
  const capacidadeSala = Math.max(1, Number(sessaoSelecionada?.capacidade ?? 30));
  const colunasLugares = Math.min(10, capacidadeSala);
  const quantidadeFileiras = Math.ceil(capacidadeSala / colunasLugares);
  const lugares = Array.from({ length: quantidadeFileiras }, (_, row) =>
    Array.from({ length: Math.min(colunasLugares, capacidadeSala - row * colunasLugares) }, (_, column) =>
      `${String.fromCharCode(65 + row)}${column + 1}`
    )
  );

  /* --------IR PARA COMPRA-----------*/

  const irParaCompra = () => {
    scrollRef.current?.scrollTo({
      y: height + 300,
      animated: true,
    });
  };

  /* ----------SELECIONAR LUGAR-----------*/

  const selecionarLugar = (lugar: string) => {
    if (lugaresOcupados.includes(lugar)) {
      return;
    }

    if (!lugaresSelecionados.includes(lugar) && lugaresSelecionados.length >= 12) {
      Alert.alert("Limite de pedido", "Você pode selecionar até 12 ingressos por compra.");
      return;
    }
    setLugaresSelecionados((anteriores) => {
      if (anteriores.includes(lugar)) {
        return anteriores.filter((item) => item !== lugar);
      }
      return [...anteriores, lugar];
    });
  };

  /* ---------VALORES------------*/

  const totalIngressos =
    quantidadeMeia + quantidadeInteira;

  const valorTotal =
    quantidadeMeia * (sessaoSelecionada?.valorMeia ?? 15) +
    quantidadeInteira * (sessaoSelecionada?.valorInteira ?? 30);

  const finalizarCompra = async () => {
    setCompraErro(null);
    setCompraSucesso(null);

    if (!sessaoSelecionada) {
      setCompraErro("Selecione uma sessão antes de continuar.");
      return;
    }
    if (lugaresSelecionados.length === 0) {
      setCompraErro("Selecione pelo menos um assento no mapa da sala.");
      return;
    }
    if (totalIngressos !== lugaresSelecionados.length) {
      setCompraErro(`Você selecionou ${lugaresSelecionados.length} assento(s), mas escolheu ${totalIngressos} ingresso(s). Ajuste as quantidades para ficarem iguais.`);
      return;
    }
    if (!nomeCliente.trim()) {
      setCompraErro("Informe o nome do cliente para continuar.");
      return;
    }
    if (!pagamento) {
      setCompraErro("Escolha uma forma de pagamento para continuar.");
      return;
    }

    setComprando(true);
    setCompraErro(null);
    setCompraSucesso(null);
    try {
      const assentos = lugaresSelecionados.map((assento, index) => ({
        assento,
        tipoIngresso: index < quantidadeMeia ? "Meia" as const : "Inteira" as const,
      }));
      const result = await buyTickets({
        sessaoId: sessaoSelecionada.id,
        nomeCliente: nomeCliente.trim(),
        assentos,
        formaPagamento: pagamento as "Pix" | "Cartão de crédito" | "Cartão de débito",
      });
      setCompraSucesso({
        pedidoId: String(result.pedidoId || "").slice(0, 8).toUpperCase(),
        quantidade: Number(result.quantidade ?? assentos.length),
        valorTotal: Number(result.valorTotal ?? valorTotal),
      });
      setLugaresSelecionados([]);
      setQuantidadeMeia(0);
      setQuantidadeInteira(0);
      setPagamento(null);
      setEtapaCompra(false);
      try {
        setLugaresOcupados(await getOccupiedSeats(sessaoSelecionada.id));
      } catch (refreshError) {
        console.warn("Pedido confirmado, mas não foi possível atualizar o mapa de assentos:", refreshError);
      }
    } catch (error: any) {
      const message = error?.message || "Não foi possível concluir a compra.";
      setCompraErro(message);
      Alert.alert("Não foi possível comprar", message);
      try { setLugaresOcupados(await getOccupiedSeats(sessaoSelecionada.id)); } catch {}
    } finally {
      setComprando(false);
    }
  };

 
  return (
    <ScrollView
      ref={scrollRef}
      style={{
        flex: 1,
        backgroundColor: "#0C062D",
      }}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
    >

      {/* ---------------BANNER--------------*/}

      <View
        style={{
          width: "100%",
          height: height,
          overflow: "hidden",
        }}
      >

        {movie.heroImage ? (
          <ImageBackground
            source={{
              uri: movie.heroImage,
            }}
            resizeMode="cover"
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >

            {/* GRADIENTE */}

            <LinearGradient
              colors={[
                "transparent",
                "rgba(12,6,45,0.25)",
                "rgba(12,6,45,0.75)",
                "#0C062D",
              ]}
              locations={[
                0,
                0.45,
                0.75,
                1,
              ]}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />

            {/* ------BOTÃO VOLTAR -----------*/}

            <Pressable
              onPress={() => router.replace("/")}
              style={{
                position: "absolute",
                top: 30,
                left: 25,
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor:
                  "rgba(20,10,60,0.80)",
                borderWidth: 1,
                borderColor:
                  "rgba(255,255,255,0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 30,
                  lineHeight: 30,
                  textAlign: "center",
                  includeFontPadding: false,
                  marginTop: -5,
                }}
              >
                ‹
              </Text>
            </Pressable>

            {/*------------INFORMAÇÕES DO FILME ---------- */}

            <View
              style={{
                width: "100%",
                paddingHorizontal:
                  isDesktop ? 60 : 25,
                paddingBottom:
                  isDesktop ? 60 : 35,
              }}
            >

              <Text
                numberOfLines={2}
                style={{
                  color: "white",
                  fontSize:
                    isDesktop ? 52 : 36,
                  fontWeight: "900",
                  marginBottom: 14,
                }}
              >
                {movie.title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >

                <View
                  style={{
                    backgroundColor: "#F51F3B",
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      fontWeight: "900",
                    }}
                  >
                    {movie.genre}
                  </Text>
                </View>

                <Text
                  style={{
                    color: "#E8E1FF",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {movie.duration}
                </Text>

                <Text
                  style={{
                    color: "#E8E1FF",
                    fontSize: 14,
                  }}
                >
                  •
                </Text>

                <Text
                  style={{
                    color: "#E8E1FF",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {movie.rating}
                </Text>

              </View>

            </View>

          </ImageBackground>
        ) : (

          <View
            style={{
              flex: 1,
              backgroundColor: "#18103D",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#AAA2D4",
                fontWeight: "900",
                fontSize: 14,
              }}
            >
              BANNER DO FILME
            </Text>
          </View>

        )}

      </View>

      {/* ------------CONTEÚDO-----------*/}

      <View
        style={{
          width: "100%",
          maxWidth: 1100,
          alignSelf: "center",
          paddingHorizontal:
            isDesktop ? 60 : 25,
          paddingTop: 35,
        }}
      >

        {/*
            SOBRE
         */}

        <Text
          style={{
            color: "#AAA2D4",
            fontSize: 13,
            fontWeight: "900",
            letterSpacing: 1.5,
            marginBottom: 12,
          }}
        >
          SOBRE O FILME
        </Text>

        <Text
          style={{
            color: "#F5F3FF",
            fontSize: 16,
            lineHeight: 27,
            marginBottom: 30,
          }}
        >
          {movie.description}
        </Text>

        {/* --------COMPRAR INGRESSO----------- */}

        <Pressable
          onPress={irParaCompra}
          style={({ pressed }) => ({
            height: 58,
            borderRadius: 30,
            backgroundColor: "#F51F3B",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.8 : 1,
            marginBottom: 50,
          })}
        >
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "900",
              letterSpacing: 0.5,
            }}
          >
            COMPRAR INGRESSO
          </Text>
        </Pressable>

        {/* ------------SESSÕES ------------*/}

        <View
          style={{
            backgroundColor: "#17103D",
            borderRadius: 25,
            padding:
              isDesktop ? 35 : 25,
            borderWidth: 1,
            borderColor: "#2C205D",
            marginBottom: 30,
          }}
        >

          <Text
            style={{
              color: "white",
              fontSize: 25,
              fontWeight: "900",
              marginBottom: 8,
            }}
          >
            ESCOLHA SUA SESSÃO
          </Text>

          <Text
            style={{
              color: "#AAA2D4",
              fontSize: 14,
              marginBottom: 25,
            }}
          >
            Escolha o horário e depois
            selecione seus lugares.
          </Text>

          {/* PROGRAMAÇÃO */}

          <Text
            style={{
              color: "#AAA2D4",
              fontSize: 12,
              fontWeight: "900",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            PROGRAMAÇÃO DISPONÍVEL
          </Text>

          <View
            style={{
              backgroundColor: "#0C062D",
              borderRadius: 15,
              padding: 18,
              marginBottom: 25,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 17, fontWeight: "800" }}
            >
              {sessoes.length > 0 ? `${sessoes.length} sessão(ões) encontrada(s)` : "Nenhuma sessão disponível"}
            </Text>
            <Text style={{ color: "#AAA2D4", fontSize: 12, marginTop: 6 }}>
              A programação é cadastrada pela equipe na dashboard.
            </Text>
          </View>

          {/* HORÁRIOS */}

          <Text
            style={{
              color: "#AAA2D4",
              fontSize: 12,
              fontWeight: "900",
              letterSpacing: 1,
              marginBottom: 15,
            }}
          >
            HORÁRIOS
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 30,
            }}
          >

            {horarios.map((sessao) => {

              const selecionado = sessaoSelecionada?.id === sessao.id;

              return (
                <Pressable
                  key={sessao.id}
                  onPress={async () => {
                    setSessaoSelecionada(sessao);
                    setHorarioSelecionado(sessao.horario);
                    setLugaresSelecionados([]);
                    setEtapaCompra(false);
                    setQuantidadeMeia(0);
                    setQuantidadeInteira(0);
                    setPagamento(null);
                    setCompraErro(null);
                    try {
                      setLugaresOcupados(await getOccupiedSeats(sessao.id));
                    } catch (error: any) {
                      setCompraErro(error?.message || "Não foi possível consultar os assentos.");
                    }
                  }}
                  style={{
                    minWidth: 95,
                    minHeight: 60,
                    paddingHorizontal: 20,
                    paddingVertical: 7,
                    borderRadius: 24,
                    backgroundColor:
                      selecionado
                        ? "#F51F3B"
                        : "#0C062D",
                    borderWidth: 1,
                    borderColor: "#F51F3B",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontWeight: "800",
                    }}
                  >
                    {sessao.horario}
                  </Text>
                  <Text style={{ color: "#D5CFEF", fontSize: 10, marginTop: 2 }}>
                    {sessao.dataSessao.split("-").reverse().join("/")} · {sessao.nomeSala}
                  </Text>
                </Pressable>
              );
            })}

          </View>
          {horarios.length === 0 && (
            <Text style={{ color: "#AAA2D4", fontSize: 13, marginBottom: 24 }}>
              Ainda não há sessões publicadas para este filme. Consulte a dashboard para cadastrar uma.
            </Text>
          )}

          {/* -------------------LUGARES------------ */}

          {horarioSelecionado && (
            <>

              <Text
                style={{
                  color: "#AAA2D4",
                  fontSize: 12,
                  fontWeight: "900",
                  letterSpacing: 1,
                  marginBottom: 15,
                }}
              >
                ESCOLHA SEU LUGAR
              </Text>

              <View
                style={{
                  backgroundColor: "#0C062D",
                  borderRadius: 20,
                  padding:
                    isDesktop ? 30 : 15,
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >

                {/* TELA */}

                <View
                  style={{
                    width: "75%",
                    height: 8,
                    backgroundColor: "#AAA2D4",
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                />

                <Text
                  style={{
                    color: "#77718F",
                    fontSize: 10,
                    fontWeight: "800",
                    marginBottom: 25,
                  }}
                >
                  TELA
                </Text>

                {/* MAPA */}

                {lugares.map((fileira) => (

                  <View
                    key={fileira[0][0]}
                    style={{
                      flexDirection: "row",
                      gap: isDesktop ? 10 : 3,
                      marginBottom: 8,
                    }}
                  >

                    {fileira.map((lugar) => {

                      const ocupado =
                        lugaresOcupados.includes(
                          lugar
                        );

                      const selecionado =
                        lugaresSelecionados.includes(
                          lugar
                        );

                      return (
                        <Pressable
                          key={lugar}
                          disabled={ocupado}
                          onPress={() =>
                            selecionarLugar(
                              lugar
                            )
                          }
                          style={{
                            width:
                              isDesktop
                                ? 38
                                : 25,
                            height:
                              isDesktop
                                ? 38
                                : 29,
                            borderRadius: 8,
                            backgroundColor:
                              ocupado
                                ? "#40375E"
                                : selecionado
                                ? "#F51F3B"
                                : "#241A4D",
                            borderWidth: 1,
                            borderColor:
                              selecionado
                                ? "#F51F3B"
                                : "#554A7A",
                            alignItems: "center",
                            justifyContent:
                              "center",
                          }}
                        >
                          <Text
                            style={{
                              color: ocupado
                                ? "#77718F"
                                : "white",
                              fontSize: 10,
                              fontWeight: "800",
                            }}
                          >
                            {lugar}
                          </Text>
                        </Pressable>
                      );
                    })}

                  </View>

                ))}

              </View>

              {/* LEGENDA */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 18,
                  marginBottom: 25,
                }}
              >

                {/* LIVRE */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      backgroundColor: "#241A4D",
                    }}
                  />

                  <Text
                    style={{
                      color: "#AAA2D4",
                      fontSize: 12,
                    }}
                  >
                    Livre
                  </Text>
                </View>

                {/* SELECIONADO */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      backgroundColor: "#F51F3B",
                    }}
                  />

                  <Text
                    style={{
                      color: "#AAA2D4",
                      fontSize: 12,
                    }}
                  >
                    Selecionado
                  </Text>
                </View>

                {/* OCUPADO */}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      backgroundColor: "#40375E",
                    }}
                  />

                  <Text
                    style={{
                      color: "#AAA2D4",
                      fontSize: 12,
                    }}
                  >
                    Ocupado
                  </Text>
                </View>

              </View>

              {/* RESUMO DOS LUGARES */}

              {lugaresSelecionados.length > 0 && (

                <View
                  style={{
                    backgroundColor: "#0C062D",
                    borderRadius: 18,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >

                  <Text
                    style={{
                      color: "#AAA2D4",
                      fontSize: 12,
                      fontWeight: "700",
                      marginBottom: 8,
                    }}
                  >
                    RESUMO
                  </Text>

                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "800",
                      marginBottom: 6,
                    }}
                  >
                    Sessão: {horarioSelecionado}
                  </Text>

                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "800",
                    }}
                  >
                    Lugares:{" "}
                    {lugaresSelecionados.join(", ")}
                  </Text>

                </View>

              )}

              {/* CONTINUAR */}

              <Pressable
                disabled={
                  lugaresSelecionados.length === 0
                }
                onPress={() => {

                  setEtapaCompra(true);

                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({
                      animated: true,
                    });
                  }, 100);

                }}
                style={{
                  height: 55,
                  borderRadius: 28,
                  backgroundColor:
                    lugaresSelecionados.length > 0
                      ? "#F51F3B"
                      : "#40375E",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >

                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "900",
                  }}
                >
                  {lugaresSelecionados.length > 0
                    ? "CONTINUAR COMPRA"
                    : "SELECIONE SEU LUGAR"}
                </Text>

              </Pressable>

            </>
          )}

        </View>

        {/* ---------COMPRA--------*/}

        {etapaCompra && (

          <View
            style={{
              backgroundColor: "#17103D",
              borderRadius: 25,
              padding:
                isDesktop ? 35 : 25,
              borderWidth: 1,
              borderColor: "#2C205D",
            }}
          >

            <Text
              style={{
                color: "white",
                fontSize: 25,
                fontWeight: "900",
                marginBottom: 8,
              }}
            >
              COMPRA DE INGRESSOS
            </Text>

            <Text
              style={{
                color: "#AAA2D4",
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              Informe seu nome e escolha o tipo de ingresso para cada lugar.
            </Text>
            <Text style={{ color: "#D8B5B9", fontSize: 12, lineHeight: 18, marginBottom: 22 }}>
              Esta versão registra o pedido e a forma de pagamento, mas ainda não processa transações por Pix ou cartão.
            </Text>

            <Text style={{ color: "#AAA2D4", fontSize: 12, fontWeight: "800", marginBottom: 8 }}>NOME DO CLIENTE</Text>
            <TextInput
              value={nomeCliente}
              onChangeText={setNomeCliente}
              placeholder="Nome completo"
              placeholderTextColor="#77718F"
              style={{ backgroundColor: "#0C062D", color: "white", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 18, borderWidth: 1, borderColor: "#2C205D" }}
            />
            {compraErro && <Text style={{ color: "#FF8292", marginBottom: 12 }}>{compraErro}</Text>}

            {/* MEIA */}

            <View
              style={{
                backgroundColor: "#0C062D",
                borderRadius: 18,
                padding: 20,
                marginBottom: 15,
              }}
            >

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    style={{
                      color: "white",
                      fontSize: 17,
                      fontWeight: "900",
                    }}
                  >
                    Meia-entrada
                  </Text>

                  <Text
                    style={{
                      color: "#AAA2D4",
                      fontSize: 13,
                      marginTop: 5,
                    }}
                  >
                    R$ {(sessaoSelecionada?.valorMeia ?? 15).toFixed(2).replace(".", ",")}
                  </Text>

                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >

                  <Pressable
                    onPress={() => {

                      if (quantidadeMeia > 0) {
                        setQuantidadeMeia(
                          quantidadeMeia - 1
                        );
                      }

                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#2C205D",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "700",
                        marginTop: -5,
                      }}
                    >
                      −
                    </Text>
                  </Pressable>

                  <Text
                    style={{
                      color: "white",
                      fontSize: 17,
                      fontWeight: "900",
                      minWidth: 20,
                      textAlign: "center",
                    }}
                  >
                    {quantidadeMeia}
                  </Text>

                  <Pressable
                    onPress={() => {

                      if (
                        totalIngressos <
                        lugaresSelecionados.length
                      ) {
                        setQuantidadeMeia(
                          quantidadeMeia + 1
                        );
                      }

                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#F51F3B",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "700",
                        marginTop: -5,
                      }}
                    >
                      +
                    </Text>
                  </Pressable>

                </View>

              </View>

            </View>

            {/* INTEIRA */}

            <View
              style={{
                backgroundColor: "#0C062D",
                borderRadius: 18,
                padding: 20,
                marginBottom: 30,
              }}
            >

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    style={{
                      color: "white",
                      fontSize: 17,
                      fontWeight: "900",
                    }}
                  >
                    Inteira
                  </Text>

                  <Text
                    style={{
                      color: "#AAA2D4",
                      fontSize: 13,
                      marginTop: 5,
                    }}
                  >
                    R$ {(sessaoSelecionada?.valorInteira ?? 30).toFixed(2).replace(".", ",")}
                  </Text>

                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >

                  <Pressable
                    onPress={() => {

                      if (
                        quantidadeInteira > 0
                      ) {
                        setQuantidadeInteira(
                          quantidadeInteira - 1
                        );
                      }

                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#2C205D",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "700",
                        marginTop: -5,
                      }}
                    >
                      −
                    </Text>
                  </Pressable>

                  <Text
                    style={{
                      color: "white",
                      fontSize: 17,
                      fontWeight: "900",
                      minWidth: 20,
                      textAlign: "center",
                    }}
                  >
                    {quantidadeInteira}
                  </Text>

                  <Pressable
                    onPress={() => {

                      if (
                        totalIngressos <
                        lugaresSelecionados.length
                      ) {
                        setQuantidadeInteira(
                          quantidadeInteira + 1
                        );
                      }

                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#F51F3B",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontWeight: "700",
                        marginTop: -5,
                      }}
                    >
                      +
                    </Text>
                  </Pressable>

                </View>

              </View>

            </View>

            {/* AVISO */}

            <View
              style={{
                backgroundColor: "#0C062D",
                borderRadius: 15,
                padding: 15,
                marginBottom: 25,
              }}
            >

              <Text
                style={{
                  color: "#AAA2D4",
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                Você selecionou{" "}
                <Text
                  style={{
                    color: "white",
                    fontWeight: "900",
                  }}
                >
                  {lugaresSelecionados.length}{" "}
                  lugar(es)
                </Text>
                . Selecione a mesma quantidade
                de ingressos.
              </Text>

            </View>

            {/* RESUMO DA COMPRA */}

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#2C205D",
                paddingTop: 20,
                marginBottom: 30,
              }}
            >

              <Text
                style={{
                  color: "#AAA2D4",
                  fontSize: 12,
                  fontWeight: "900",
                  letterSpacing: 1,
                  marginBottom: 15,
                }}
              >
                RESUMO DA COMPRA
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  marginBottom: 8,
                }}
              >
                Filme: {movie.title}
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  marginBottom: 8,
                }}
              >
                Sessão: {horarioSelecionado} · {sessaoSelecionada?.nomeSala}
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  marginBottom: 8,
                }}
              >
                Lugares:{" "}
                {lugaresSelecionados.join(", ")}
              </Text>

              <Text
                style={{
                  color: "#AAA2D4",
                  fontSize: 14,
                  marginBottom: 5,
                }}
              >
                Meia: {quantidadeMeia}
              </Text>

              <Text
                style={{
                  color: "#AAA2D4",
                  fontSize: 14,
                  marginBottom: 15,
                }}
              >
                Inteira: {quantidadeInteira}
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#2C205D",
                  marginBottom: 15,
                }}
              />

              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "900",
                }}
              >
                Total: R${" "}
                {valorTotal
                  .toFixed(2)
                  .replace(".", ",")}
              </Text>

            </View>

            {/*------- PAGAMENTO -------*/}

            <Text
              style={{
                color: "#AAA2D4",
                fontSize: 12,
                fontWeight: "900",
                letterSpacing: 1,
                marginBottom: 15,
              }}
            >
              FORMA DE PAGAMENTO
            </Text>

            {/* PIX */}

            <Pressable
              onPress={() => setPagamento("Pix")}
              style={{
                backgroundColor:
                  pagamento === "Pix"
                    ? "#F51F3B"
                    : "#0C062D",
                borderRadius: 15,
                padding: 18,
                marginBottom: 10,
                borderWidth: 1,
                borderColor:
                  pagamento === "Pix"
                    ? "#F51F3B"
                    : "#2C205D",
              }}
            >

              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                PIX
              </Text>

              <Text
                style={{
                  color:
                    pagamento === "Pix"
                      ? "#FFECEF"
                      : "#AAA2D4",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Pagamento instantâneo
              </Text>

            </Pressable>

            {/* CARTÃO DE CRÉDITO */}

            <Pressable
              onPress={() =>
                setPagamento(
                  "Cartão de crédito"
                )
              }
              style={{
                backgroundColor:
                  pagamento ===
                  "Cartão de crédito"
                    ? "#F51F3B"
                    : "#0C062D",
                borderRadius: 15,
                padding: 18,
                marginBottom: 10,
                borderWidth: 1,
                borderColor:
                  pagamento ===
                  "Cartão de crédito"
                    ? "#F51F3B"
                    : "#2C205D",
              }}
            >

              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                CARTÃO DE CRÉDITO
              </Text>

              <Text
                style={{
                  color:
                    pagamento ===
                    "Cartão de crédito"
                      ? "#FFECEF"
                      : "#AAA2D4",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Crédito
              </Text>

            </Pressable>

            {/* CARTÃO DE DÉBITO */}

            <Pressable
              onPress={() =>
                setPagamento(
                  "Cartão de débito"
                )
              }
              style={{
                backgroundColor:
                  pagamento ===
                  "Cartão de débito"
                    ? "#F51F3B"
                    : "#0C062D",
                borderRadius: 15,
                padding: 18,
                marginBottom: 25,
                borderWidth: 1,
                borderColor:
                  pagamento ===
                  "Cartão de débito"
                    ? "#F51F3B"
                    : "#2C205D",
              }}
            >

              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                CARTÃO DE DÉBITO
              </Text>

              <Text
                style={{
                  color:
                    pagamento ===
                    "Cartão de débito"
                      ? "#FFECEF"
                      : "#AAA2D4",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Débito
              </Text>

            </Pressable>

            {/* FINALIZAR */}

            <Pressable
              disabled={comprando}
              onPress={finalizarCompra}
              style={({ pressed }) => ({
                height: 58,
                borderRadius: 29,
                backgroundColor: comprando ? "#40375E" : "#F51F3B",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed && !comprando ? 0.82 : 1,
              })}
            >

              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "900",
                }}
              >
                {comprando ? "REGISTRANDO COMPRA..." : "FINALIZAR COMPRA"}
              </Text>

            </Pressable>

          </View>

        )}

      </View>

    </ScrollView>
  );
}