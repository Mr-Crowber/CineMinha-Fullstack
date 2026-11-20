const api = window.CineMinhaAPI;
let filmes = [];
let bannerIndex = 0;
let bannerTimer = null;

const bannerBg = document.querySelector(".banner-bg");
const linkBanner = document.getElementById("banner-link");
const container = document.getElementById("lista-filmes");
const botaoPesquisa = document.getElementById("btn-pesquisa");
const caixaPesquisa = document.querySelector(".pesquisa");
const campoPesquisa = document.getElementById("campo-pesquisa");
const sugestoesBox = document.getElementById("sugestoes");

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));

function showMessage(target, message, isError = false) {
  if (!target) return;
  target.innerHTML = `<p class="site-api-message ${isError ? "is-error" : ""}">${escapeHtml(message)}</p>`;
}

function featuredMovies() {
  const featured = filmes.filter((movie) => movie.featured && movie.heroImage);
  return featured.length ? featured : filmes.filter((movie) => movie.heroImage);
}

function renderBanner() {
  if (!bannerBg || !linkBanner) return;
  const list = featuredMovies();
  if (!list.length) {
    bannerBg.style.backgroundImage = "linear-gradient(120deg, #260303, #100b0b)";
    linkBanner.textContent = "Filmes em cartaz";
    linkBanner.removeAttribute("href");
    return;
  }
  const movie = list[bannerIndex % list.length];
  bannerBg.style.backgroundImage = `url("${api.image(movie.heroImage || movie.poster)}")`;
  const mainTitle = String(movie.heroTitle || "").trim() || movie.title || "";
  const accentTitle = String(movie.heroAccent || "").trim();

  // Renderiza os dois campos do banner sem interpretar texto cadastrado como HTML.
  linkBanner.replaceChildren(document.createTextNode(mainTitle));
  if (accentTitle) {
    const accent = document.createElement("em");
    accent.className = "banner-title-accent";
    accent.textContent = ` ${accentTitle}`;
    linkBanner.appendChild(accent);
  }

  linkBanner.href = `filme.html?id=${encodeURIComponent(movie.id)}`;
}

function renderMovies(list = filmes) {
  if (!container) return;
  container.innerHTML = "";
  if (!list.length) {
    showMessage(container, filmes.length ? "Nenhum filme corresponde à sua busca." : "Nenhum filme publicado no momento.");
    return;
  }

  list.forEach((movie) => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `filme.html?id=${encodeURIComponent(movie.id)}`;
    const image = document.createElement("img");
    image.src = api.image(movie.poster || movie.heroImage);
    image.alt = `Pôster de ${movie.title}`;
    image.className = "poster";
    image.loading = "lazy";
    const rating = document.createElement("span");
    rating.className = "classificacao classificacao-texto";
    rating.textContent = movie.rating || "L";
    const title = document.createElement("h3");
    title.textContent = movie.title;
    card.append(image, rating, title);
    container.appendChild(card);
  });
}

function clearSearch() {
  if (!campoPesquisa || !sugestoesBox) return;
  campoPesquisa.value = "";
  sugestoesBox.innerHTML = "";
  sugestoesBox.classList.remove("ativo");
  renderMovies();
}

function configureSearch() {
  if (!botaoPesquisa || !caixaPesquisa || !campoPesquisa || !sugestoesBox) return;

  botaoPesquisa.addEventListener("click", (event) => {
    event.stopPropagation();
    caixaPesquisa.classList.toggle("ativa");
    if (caixaPesquisa.classList.contains("ativa")) campoPesquisa.focus();
    else clearSearch();
  });

  document.addEventListener("click", (event) => {
    if (!caixaPesquisa.contains(event.target)) {
      caixaPesquisa.classList.remove("ativa");
      clearSearch();
    }
  });

  campoPesquisa.addEventListener("input", () => {
    const term = campoPesquisa.value.trim().toLocaleLowerCase("pt-BR");
    const results = filmes.filter((movie) => movie.title.toLocaleLowerCase("pt-BR").includes(term));
    sugestoesBox.innerHTML = "";
    results.slice(0, 8).forEach((movie) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "sugestao-item";
      item.textContent = movie.title;
      item.addEventListener("click", () => {
        window.location.href = `filme.html?id=${encodeURIComponent(movie.id)}`;
      });
      sugestoesBox.appendChild(item);
    });
    sugestoesBox.classList.toggle("ativo", term.length > 0 && results.length > 0);
    renderMovies(term ? results : filmes);
  });
}

async function loadCatalog() {
  const rows = await api.getMovies();
  filmes = rows.filter((movie) => movie.status === "Publicado");
  filmes.sort((a, b) => Number(b.featured) - Number(a.featured) || String(a.title).localeCompare(String(b.title), "pt-BR"));
  if (campoPesquisa?.value.trim()) {
    const term = campoPesquisa.value.trim().toLocaleLowerCase("pt-BR");
    renderMovies(filmes.filter((movie) => movie.title.toLocaleLowerCase("pt-BR").includes(term)));
  } else {
    renderMovies();
  }
  renderBanner();
}

async function init() {
  configureSearch();
  showMessage(container, "Carregando catálogo...");
  try {
    await loadCatalog();
    bannerTimer = window.setInterval(() => {
      const list = featuredMovies();
      if (list.length < 2) return;
      bannerIndex = (bannerIndex + 1) % list.length;
      if (bannerBg) bannerBg.style.opacity = "0.3";
      window.setTimeout(() => {
        renderBanner();
        if (bannerBg) bannerBg.style.opacity = "1";
      }, 250);
    }, 8000);
  } catch (error) {
    showMessage(container, error.message, true);
    if (bannerBg) bannerBg.style.backgroundImage = "linear-gradient(120deg, #260303, #100b0b)";
  }
  window.setInterval(() => loadCatalog().catch((error) => {
    if (filmes.length === 0) showMessage(container, error.message, true);
    console.warn("Falha ao atualizar catálogo:", error);
  }), 30000);
}

init();
