const api = window.CineMinhaAPI;
const query = new URLSearchParams(window.location.search);
const movieId = Number(query.get("id"));
let movie = null;
let sessions = [];
let selectedSession = null;
let occupiedSeats = new Set();
let selectedSeats = new Map();

const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));
const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const formatDate = (value) => {
  const [year, month, day] = String(value || "").slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : String(value || "—");
};

function showSessionsMessage(message, isError = false) {
  const list = $("sessions-list");
  list.innerHTML = `<p class="site-api-message ${isError ? "is-error" : ""}">${escapeHtml(message)}</p>`;
}

function renderMovie() {
  document.title = `${movie.title} - CineMinha`;
  $("movie-title").textContent = movie.title;
  $("movie-description").textContent = movie.description || "Descrição não informada.";
  $("movie-meta").innerHTML = [movie.year, movie.duration, movie.genre, movie.rating]
    .filter(Boolean).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  $("movie-director").textContent = movie.director ? `Direção: ${movie.director}` : "";
  const poster = $("movie-poster");
  poster.src = api.image(movie.poster || movie.heroImage);
  poster.alt = `Pôster de ${movie.title}`;
  poster.hidden = !movie.poster && !movie.heroImage;
  const backdrop = $("movie-backdrop");
  const heroImage = movie.heroImage || movie.poster;
  if (heroImage) backdrop.style.backgroundImage = `linear-gradient(90deg, rgba(17,1,1,.92), rgba(17,1,1,.55) 55%, rgba(17,1,1,.78)), url("${api.image(heroImage)}")`;
}

function renderSessions() {
  const list = $("sessions-list");
  list.innerHTML = "";
  if (!sessions.length) {
    showSessionsMessage("Ainda não existem sessões disponíveis para este filme. A equipe precisa cadastrar uma sessão na dashboard.");
    return;
  }

  sessions.forEach((session) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dynamic-session-card${selectedSession?.id === session.id ? " is-selected" : ""}`;
    button.innerHTML = `<span class="dynamic-session-date">${escapeHtml(formatDate(session.dataSessao))}</span><strong>${escapeHtml(String(session.horario).slice(0, 5))}</strong><span>${escapeHtml(session.nomeSala)} · ${escapeHtml(session.formato)}</span><small>Meia ${money(session.valorMeia)} · Inteira ${money(session.valorInteira)}</small><em>${Number(session.disponiveis)} lugares disponíveis</em>`;
    button.addEventListener("click", () => selectSession(session));
    list.appendChild(button);
  });
}

async function selectSession(session) {
  selectedSession = session;
  occupiedSeats.clear();
  selectedSeats.clear();
  $("seat-booking").hidden = false;
  $("checkout").hidden = true;
  $("checkout-error").textContent = "";
  $("checkout-success").textContent = "";
  $("selected-session-label").textContent = `${formatDate(session.dataSessao)} · ${String(session.horario).slice(0, 5)} · ${session.nomeSala}`;
  renderSessions();
  $("seat-map").innerHTML = "<p class='site-api-message'>Consultando assentos...</p>";
  try {
    const seats = await api.getOccupiedSeats(session.id);
    occupiedSeats = new Set((seats || []).map((seat) => String(seat).toUpperCase()));
    renderSeatMap();
  } catch (error) {
    $("seat-map").innerHTML = `<p class="site-api-message is-error">${escapeHtml(error.message)}</p>`;
  }
  $("seat-booking").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderSeatMap() {
  const map = $("seat-map");
  map.innerHTML = "";
  const capacity = Math.max(1, Number(selectedSession?.capacidade || 30));
  const columns = Math.min(10, capacity);
  const rows = Math.ceil(capacity / columns);
  map.style.setProperty("--seat-columns", columns);

  for (let row = 0; row < rows; row++) {
    const rowLetter = String.fromCharCode(65 + row);
    const rowElement = document.createElement("div");
    rowElement.className = "seat-row";
    const label = document.createElement("span");
    label.className = "seat-row-label";
    label.textContent = rowLetter;
    rowElement.appendChild(label);

    for (let column = 1; column <= columns; column++) {
      const seat = `${rowLetter}${column}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "seat-button";
      button.textContent = String(column);
      button.setAttribute("aria-label", `Assento ${seat}`);
      const occupied = occupiedSeats.has(seat);
      const selected = selectedSeats.has(seat);
      button.disabled = occupied;
      button.classList.toggle("is-occupied", occupied);
      button.classList.toggle("is-selected", selected);
      button.title = occupied ? `${seat} ocupado` : seat;
      button.addEventListener("click", () => {
        if (selectedSeats.has(seat)) selectedSeats.delete(seat);
        else {
          if (selectedSeats.size >= 12) {
            $("checkout-error").textContent = "Você pode selecionar até 12 ingressos por pedido.";
            return;
          }
          selectedSeats.set(seat, "Inteira");
        }
        $("checkout-error").textContent = "";
        renderSeatMap();
        renderCheckout();
      });
      rowElement.appendChild(button);
    }
    map.appendChild(rowElement);
  }
}

function renderCheckout() {
  const checkout = $("checkout");
  checkout.hidden = selectedSeats.size === 0;
  if (!selectedSeats.size) return;

  const container = $("selected-seat-types");
  container.innerHTML = "";
  for (const [seat, type] of selectedSeats) {
    const row = document.createElement("label");
    row.className = "selected-seat-type";
    const select = document.createElement("select");
    select.setAttribute("aria-label", `Tipo de ingresso do assento ${seat}`);
    select.innerHTML = `<option value="Inteira">Inteira · ${money(selectedSession.valorInteira)}</option><option value="Meia">Meia-entrada · ${money(selectedSession.valorMeia)}</option>`;
    select.value = type;
    select.addEventListener("change", () => {
      selectedSeats.set(seat, select.value);
      updateTotal();
    });
    const seatName = document.createElement("strong");
    seatName.textContent = seat;
    row.append(seatName, select);
    container.appendChild(row);
  }
  updateTotal();
}

function updateTotal() {
  let total = 0;
  for (const type of selectedSeats.values()) {
    total += type === "Meia" ? Number(selectedSession.valorMeia) : Number(selectedSession.valorInteira);
  }
  $("checkout-total").textContent = money(total);
}

async function buyTickets() {
  const name = $("customer-name").value.trim();
  const payment = $("payment-method").value;
  const errorNode = $("checkout-error");
  const successNode = $("checkout-success");
  errorNode.textContent = "";
  successNode.textContent = "";
  if (!selectedSession || selectedSeats.size === 0) {
    errorNode.textContent = "Selecione pelo menos um assento.";
    return;
  }
  if (!name) {
    errorNode.textContent = "Informe o nome do cliente.";
    $("customer-name").focus();
    return;
  }
  if (!payment) {
    errorNode.textContent = "Selecione a forma de pagamento.";
    return;
  }

  const button = $("buy-button");
  button.disabled = true;
  button.textContent = "Registrando pedido...";
  try {
    const result = await api.buyTickets({
      sessaoId: selectedSession.id,
      nomeCliente: name,
      assentos: [...selectedSeats.entries()].map(([assento, tipoIngresso]) => ({ assento, tipoIngresso })),
      formaPagamento: payment,
    });
    const order = String(result.pedidoId || "").slice(0, 8).toUpperCase();
    selectedSeats.clear();
    $("checkout").hidden = true;
    selectedSession = { ...selectedSession, disponiveis: Math.max(0, selectedSession.disponiveis - Number(result.quantidade)) };
    try {
      occupiedSeats = new Set(await api.getOccupiedSeats(selectedSession.id));
    } catch (refreshError) {
      console.warn("Pedido confirmado, mas não foi possível atualizar o mapa de assentos:", refreshError);
    }
    renderSeatMap();
    renderSessions();

    // A compra já está registrada neste ponto. A tela de confirmação é exibida
    // mesmo que a atualização posterior do mapa de assentos falhe.
    $("success-order-id").textContent = order || "CONFIRMADO";
    $("success-ticket-count").textContent = `${Number(result.quantidade)} ingresso(s)`;
    $("success-order-total").textContent = money(result.valorTotal);
    document.body.classList.add("purchase-complete");
    $("purchase-success-screen").hidden = false;
  } catch (error) {
    errorNode.textContent = error.message || "Não foi possível registrar o pedido.";
    try {
      occupiedSeats = new Set(await api.getOccupiedSeats(selectedSession.id));
      renderSeatMap();
    } catch { /* Mantém o mapa anterior se a atualização falhar. */ }
  } finally {
    button.disabled = false;
    button.textContent = "Confirmar pedido";
  }
}

async function init() {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    $("movie-title").textContent = "Filme não encontrado";
    $("movie-description").textContent = "O link não contém um identificador válido.";
    showSessionsMessage("Volte ao catálogo e selecione um filme publicado.", true);
    return;
  }
  try {
    movie = await api.getMovie(movieId);
    if (movie.status !== "Publicado") throw new Error("Este filme não está publicado no catálogo.");
    renderMovie();
    sessions = await api.getSessions(movieId);
    renderSessions();
    window.setInterval(async () => {
      try {
        sessions = await api.getSessions(movieId);
        if (selectedSession) selectedSession = sessions.find((item) => item.id === selectedSession.id) || null;
        renderSessions();
        if (selectedSession) {
          occupiedSeats = new Set(await api.getOccupiedSeats(selectedSession.id));
          renderSeatMap();
        }
      } catch (refreshError) {
        console.warn("Falha ao atualizar sessões:", refreshError);
      }
    }, 30000);
  } catch (error) {
    $("movie-title").textContent = "Não foi possível abrir este filme";
    $("movie-description").textContent = error.message;
    showSessionsMessage(error.message, true);
  }
}

$("buy-button").addEventListener("click", buyTickets);
init();
