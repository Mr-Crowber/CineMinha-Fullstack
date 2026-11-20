import { Platform } from "react-native";

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android" ? "http://10.0.2.2:5266" : "http://localhost:5266")
).replace(/\/$/, "");

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
  year?: number | null;
  director?: string | null;
  status: string;
  featured: boolean;
};

export type Session = {
  id: number;
  filmeId: number;
  nomeFilme: string;
  dataSessao: string;
  horario: string;
  salaId: number;
  nomeSala: string;
  capacidade: number;
  formato: string;
  valorMeia: number;
  valorInteira: number;
  status: string;
  vendidos: number;
  disponiveis: number;
};

export type TicketPurchase = {
  sessaoId: number;
  nomeCliente: string;
  assentos: { assento: string; tipoIngresso: "Meia" | "Inteira" }[];
  formaPagamento: "Pix" | "Cartão de crédito" | "Cartão de débito";
};

export type PurchaseResult = {
  pedidoId: string;
  quantidade: number;
  valorTotal: number;
  ingressos: unknown[];
};

export function resolveApiAsset(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) {
    try {
      const parsed = new URL(path);
      if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname))
        return `${API_URL}${parsed.pathname}${parsed.search}`;
    } catch { /* Mantém URL externa. */ }
    return path;
  }
  return `${API_URL}/${path.replace(/^\/+/, "")}`;
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options?.body ? { "Content-Type": "application/json" } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw new Error(`Não foi possível acessar a API em ${API_URL}. Confira se o backend está ligado e se o endereço está correto.`);
  }

  const contentType = response.headers.get("content-type") || "";
  const body = response.status === 204
    ? null
    : contentType.includes("application/json")
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    const message = typeof body === "string" ? body : (body as any)?.message || (body as any)?.title;
    throw new Error(message || `Erro na API (${response.status}).`);
  }
  return body as T;
}

export async function getMovies(): Promise<Movie[]> {
  const data = await apiRequest<any[]>("/api/Filme");
  return data.map((movie) => ({
    id: Number(movie.id),
    title: movie.title ?? "",
    genre: movie.genre ?? "",
    duration: movie.duration ?? "",
    rating: movie.rating ?? "",
    description: movie.description ?? "",
    poster: resolveApiAsset(movie.poster ?? null),
    heroImage: resolveApiAsset(movie.heroImage ?? movie.hero_image ?? null),
    heroTitle: movie.heroTitle ?? movie.hero_title ?? "",
    heroAccent: movie.heroAccent ?? movie.hero_accent ?? "",
    year: movie.year ?? null,
    director: movie.director ?? null,
    status: movie.status ?? "",
    featured: Boolean(movie.featured),
  }));
}

export async function getSessions(movieId: number): Promise<Session[]> {
  return apiRequest<Session[]>(`/api/Sessao?filmeId=${encodeURIComponent(movieId)}`);
}

export async function getOccupiedSeats(sessionId: number): Promise<string[]> {
  return apiRequest<string[]>(`/api/Ingresso/ocupados?sessaoId=${encodeURIComponent(sessionId)}`);
}

export async function buyTickets(payload: TicketPurchase): Promise<PurchaseResult> {
  return apiRequest<PurchaseResult>("/api/Ingresso", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
