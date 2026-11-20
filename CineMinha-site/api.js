window.CINEMINHA_API_URL = window.CINEMINHA_API_URL || "http://localhost:5266";

(() => {
  const baseUrl = String(window.CINEMINHA_API_URL).replace(/\/$/, "");

  async function request(path, options = {}) {
    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers,
        },
      });
    } catch {
      throw new Error(`Não foi possível conectar à API em ${baseUrl}. Confira se o backend está ligado e se api.js aponta para o endereço correto.`);
    }

    const type = response.headers.get("content-type") || "";
    const body = response.status === 204
      ? null
      : type.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      throw new Error(typeof body === "string" ? body : body?.message || body?.title || `Erro na API (${response.status}).`);
    }
    return body;
  }

  window.CineMinhaAPI = {
    baseUrl,
    request,
    image(path) {
      if (!path) return "";
      const value = String(path).trim();
      if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) {
        try {
          const parsed = new URL(value, window.location.href);
          if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname))
            return `${baseUrl}${parsed.pathname}${parsed.search}`;
        } catch { }
        return value;
      }
      return `${baseUrl}/${value.replace(/^\/+/, "")}`;
    },
    getMovies() {
      return request("/api/Filme");
    },
    getMovie(id) {
      return request(`/api/Filme/${encodeURIComponent(id)}`);
    },
    getSessions(movieId) {
      return request(`/api/Sessao?filmeId=${encodeURIComponent(movieId)}`);
    },
    getOccupiedSeats(sessionId) {
      return request(`/api/Ingresso/ocupados?sessaoId=${encodeURIComponent(sessionId)}`);
    },
    buyTickets(payload) {
      return request("/api/Ingresso", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  };
})();
