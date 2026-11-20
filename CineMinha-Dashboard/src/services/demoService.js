/**
 * Camada temporária de dados.
 * Hoje todas as funções leem dados fictícios de src/data/mockData.js.
 * No futuro, substitua a implementação destas funções por chamadas à API,
 * mantendo as páginas dependentes apenas desta interface.
 */
import { activities, customers, dashboardSummary, movies, rooms, sessions, tickets } from "../data/mockData.js";

const copy = (value) => JSON.parse(JSON.stringify(value));
const demoResult = (resource, payload = null) => ({
  resource,
  persisted: false,
  mode: "demo",
  received: payload == null ? null : copy(payload),
});

export const demoService = {
  async getDashboardSummary() { return copy(dashboardSummary); },
  async listMovies() { return copy(movies); },
  async getMovie(id) { return copy(movies.find((movie) => String(movie.id) === String(id)) ?? null); },
  async listSessions() { return copy(sessions); },
  async listRooms() { return copy(rooms); },
  async listTickets() { return copy(tickets); },
  async listCustomers() { return copy(customers); },
  async listActivities() { return copy(activities); },

  // Operações simuladas: não alteram mockData nem mantêm estado entre telas.
  async createMovie(payload) { return demoResult("movie", payload); },
  async updateMovie(id, payload) { return demoResult("movie", { id, ...payload }); },
  async createSession(payload) { return demoResult("session", payload); },
  async createRoom(payload) { return demoResult("room", payload); },
  async uploadImage(file) {
    return { url: null, fileName: file?.name ?? null, persisted: false, mode: "demo" };
  },
  async updateSettings(payload) { return demoResult("settings", payload); },
};
