import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services";
import { assetUrl } from "../utils/assets";
import Icon from "../components/Icon";
import { Button, EmptyState, PageHeader, SearchBox, StatusBadge } from "../components/ui";

export default function MoviesPage({ navigate }) {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Todos os gêneros");
  const [status, setStatus] = useState("Todos os status");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => adminService.listMovies()
      .then((rows) => { setMovies(rows); setError(""); })
      .catch((err) => setError(err.message || "Não foi possível carregar o catálogo."))
      .finally(() => setLoading(false));
    load();
    const refresh = window.setInterval(load, 30000);
    return () => window.clearInterval(refresh);
  }, []);

  const genres = useMemo(() => ["Todos os gêneros", ...new Set(movies.map((movie) => movie.genre))], [movies]);
  const filtered = useMemo(() => movies.filter((movie) => {
    const matchQuery = `${movie.title} ${movie.director || ""} ${movie.genre}`.toLowerCase().includes(query.toLowerCase());
    return matchQuery && (genre === "Todos os gêneros" || movie.genre === genre) && (status === "Todos os status" || movie.status === status);
  }), [movies, query, genre, status]);

  return <>
    <PageHeader eyebrow="CATÁLOGO" title="Filmes" description="Gerencie os títulos, informações e imagens exibidos no aplicativo e no site." actions={<Button icon="plus" onClick={() => navigate("/filmes/novo")}>Cadastrar filme</Button>}/>
    <div className="catalog-summary"><div><strong>{movies.length}</strong><span>Filmes no catálogo</span></div><div><strong>{movies.filter((movie) => movie.status === "Publicado").length}</strong><span>Publicados</span></div><div><strong>{movies.filter((movie) => movie.featured).length}</strong><span>Em destaque</span></div></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <section className="panel catalog-panel">
      <div className="catalog-toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Buscar por título, gênero ou diretor..."/><select className="toolbar-select" value={genre} onChange={(event) => setGenre(event.target.value)}>{genres.map((item) => <option key={item}>{item}</option>)}</select><select className="toolbar-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos os status</option><option>Publicado</option><option>Rascunho</option><option>Arquivado</option></select><span className="results-count">{filtered.length} resultado(s)</span></div>
      {loading ? <p className="empty-state">Carregando catálogo...</p> : filtered.length ? <div className="movie-grid">{filtered.map((movie) => <article className="movie-card" key={movie.id}>
        <div className="movie-card-poster"><img src={assetUrl(movie.poster)} alt={`Pôster de ${movie.title}`}/><span className="movie-rating">{movie.rating}</span>{movie.featured && <span className="featured-chip"><Icon name="star" size={11}/> DESTAQUE</span>}</div>
        <div className="movie-card-body"><div className="movie-card-meta"><span>{movie.genre}</span><span>{movie.year || "Ano não informado"}</span></div><h3>{movie.title}</h3><p>{movie.duration} · {movie.director || "Diretor não informado"}</p><div className="movie-card-bottom"><StatusBadge tone={movie.status === "Publicado" ? "success" : "neutral"}>{movie.status}</StatusBadge><button className="icon-text-button" onClick={() => navigate(`/filmes/${movie.id}/editar`)}><Icon name="edit" size={14}/> Editar</button></div></div>
      </article>)}</div> : <EmptyState icon="search" title="Nenhum filme encontrado" description="Tente alterar a busca ou os filtros selecionados."/>}
    </section>
  </>;
}
