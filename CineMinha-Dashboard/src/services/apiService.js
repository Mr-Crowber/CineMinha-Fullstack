const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5266").replace(/\/$/, "");

async function request(path, options = {}) {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const body = response.status === 204
    ? null
    : contentType.includes("application/json")
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    const message = typeof body === "string" ? body : body?.message || body?.title || `Erro na API (${response.status}).`;
    throw new Error(message);
  }
  return body;
}

const json = (method, payload) => ({ method, body: JSON.stringify(payload) });
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("pt-BR");
};
const currency = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function groupTickets(rows) {
  const groups = new Map();
  for (const row of rows || []) {
    const key = row.pedidoId || `LEGADO-${row.id}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: key.startsWith("LEGADO-") ? `ING-${row.id}` : `PED-${key.slice(0, 8).toUpperCase()}`,
        orderId: key,
        customer: row.nomeCliente,
        movie: row.nomeFilme,
        session: `${String(row.horario || "").slice(0, 5)} · ${row.nomeSala || `Sala ${row.salaId}`}`,
        date: formatDate(row.dataSessao),
        quantity: 0,
        totalValue: 0,
        seats: [],
        status: row.status || "Confirmado",
        payment: row.formaPagamento || "Não informado",
        createdAt: row.criadoEm,
      });
    }
    const group = groups.get(key);
    group.quantity += 1;
    group.totalValue += Number(row.valorUnitario || 0);
    group.seats.push(row.assento);
  }
  return [...groups.values()].map((item) => ({
    ...item,
    total: currency(item.totalValue),
    seatsLabel: item.seats.join(", "),
  })).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export const apiService = {
  apiUrl: API_URL,
  resolveAsset(path) {
    if (!path) return "";
    const value = String(path).trim();
    if (/^https?:\/\//i.test(value)) {
      try {
        const parsed = new URL(value);
        if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname))
          return `${API_URL}${parsed.pathname}${parsed.search}`;
      } catch { /* Mantém URLs absolutas válidas vindas de fontes externas. */ }
      return value;
    }
    return `${API_URL}/${value.replace(/^\/+/, "")}`;
  },

  async listMovies() {
    return request("/api/Filme?incluirNaoPublicados=true");
  },
  async getMovie(id) {
    return request(`/api/Filme/${id}`);
  },
  async createMovie(payload) {
    return request("/api/Filme", json("POST", payload));
  },
  async updateMovie(id, payload) {
    return request(`/api/Filme/${id}`, json("PUT", payload));
  },
  async deleteMovie(id) {
    return request(`/api/Filme/${id}`, { method: "DELETE" });
  },
  async uploadImage(file) {
    const body = new FormData();
    body.append("file", file);
    const result = await request("/api/Uploads", { method: "POST", body });
    return result;
  },

  async listTickets() {
    return groupTickets(await request("/api/Ingresso"));
  },
  async listCustomers() {
    const tickets = await this.listTickets();
    const customers = new Map();
    const parseLocalDate = (value) => {
      const [day, month, year] = String(value || "").split("/");
      return day && month && year ? new Date(Number(year), Number(month) - 1, Number(day)) : null;
    };

    for (const ticket of tickets) {
      const key = ticket.customer.trim().toLocaleLowerCase("pt-BR");
      const purchaseDate = parseLocalDate(ticket.date);
      if (!customers.has(key)) customers.set(key, {
        id: `CLI-${String(customers.size + 1).padStart(4, "0")}`,
        name: ticket.customer,
        email: "—",
        since: ticket.date,
        sinceValue: purchaseDate,
        tickets: 0,
        spentValue: 0,
        status: "Ativo",
      });
      const customer = customers.get(key);
      if (purchaseDate && (!customer.sinceValue || purchaseDate < customer.sinceValue)) {
        customer.since = ticket.date;
        customer.sinceValue = purchaseDate;
      }
      customer.tickets += ticket.quantity;
      customer.spentValue += ticket.totalValue;
    }
    return [...customers.values()].map(({ sinceValue, ...customer }) => ({
      ...customer,
      initials: customer.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      spent: currency(customer.spentValue),
    }));
  },
  async listActivities() {
    const tickets = await this.listTickets();
    return tickets.slice(0, 6).map((ticket, index) => ({
      initials: ticket.customer.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      name: ticket.customer,
      detail: `Comprou ${ticket.quantity} ingresso(s) · ${ticket.movie}`,
      time: ticket.date,
      color: ["purple", "blue", "red", "gold"][index % 4],
      value: `+ ${ticket.total}`,
    }));
  },

  async listSessions() {
    const rows = await request("/api/Sessao?todas=true");
    return rows.map((session) => ({
      id: session.id,
      movieId: session.filmeId,
      movie: session.nomeFilme,
      date: formatDate(session.dataSessao),
      isoDate: session.dataSessao,
      time: session.horario,
      room: session.nomeSala,
      roomId: session.salaId,
      format: session.formato,
      sold: session.vendidos,
      capacity: session.capacidade,
      ticketPrice: Number(session.valorInteira),
      status: session.status,
    }));
  },
  async createSession(payload) {
    const date = payload.date || payload.dataSessao;
    const time = payload.time || payload.horario;
    const rooms = await this.listRooms();
    const room = rooms.find((item) => item.name === payload.room || String(item.id) === String(payload.roomId || payload.room));
    if (!room) throw new Error("Selecione uma sala cadastrada e ativa.");
    const movie = payload.filmeId || payload.movieId || payload.movie;
    const movies = await this.listMovies();
    const selectedMovie = movies.find((item) => String(item.id) === String(movie) || item.title === movie);
    if (!selectedMovie) throw new Error("Selecione um filme publicado.");
    return request("/api/Sessao", json("POST", {
      filmeId: Number(selectedMovie.id),
      dataSessao: `${date}T00:00:00`,
      horario: `${time}:00`.slice(0, 8),
      salaId: Number(room.id),
      formato: payload.format || payload.formato,
      valorInteira: Number(payload.ticketPrice ?? payload.valorInteira ?? 30),
      valorMeia: Number(payload.halfPrice ?? payload.valorMeia ?? Number(payload.ticketPrice ?? 30) / 2),
    }));
  },

  async listRooms() {
    const rows = await request("/api/Sala");
    return rows.map((room) => ({
      id: room.id,
      name: room.nome,
      seats: room.capacidade,
      status: room.status,
      format: room.formato,
      sound: room.som,
    }));
  },
  async createRoom(payload) {
    return request("/api/Sala", json("POST", {
      nome: payload.name,
      capacidade: Number(payload.seats),
      status: payload.status,
      formato: payload.format,
      som: payload.sound,
    }));
  },
};
