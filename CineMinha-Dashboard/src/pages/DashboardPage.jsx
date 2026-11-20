import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services";
import { assetUrl } from "../utils/assets";
import Icon from "../components/Icon";
import { Button, PageHeader, Panel, StatCard, StatusBadge } from "../components/ui";

const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const localDateKey = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};
const dateLabel = (key) => {
  const [year, month, day] = key.split("-");
  return `${day}/${month}`;
};

function RevenueChart({ values }) {
  const max = Math.max(1, ...values.map((item) => item.value));
  const points = values.map((item, index) => {
    const x = values.length <= 1 ? 330 : index * 660 / (values.length - 1);
    const y = 174 - (item.value / max) * 150;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = points.length ? `M${points.join(" L")}` : "";
  const area = points.length ? `${path} L660,178 L0,178 Z` : "";
  return <div className="chart-container">
    {values.every((item) => item.value === 0) && <div className="chart-empty-label">As vendas dos últimos 7 dias aparecerão aqui.</div>}
    <svg className="revenue-chart" viewBox="0 0 660 190" preserveAspectRatio="none" role="img" aria-label="Receita registrada nos últimos sete dias">
      <defs><linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity=".26"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient></defs>
      {[8,42,76,110,144,178].map((y) => <line key={y} x1="0" y1={y} x2="660" y2={y} stroke="rgba(170,162,212,.13)" strokeDasharray="3 6"/>)}
      {area && <path d={area} fill="url(#revenueArea)"/>}
      {path && <path d={path} fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>}
      {values.map((item, index) => {
        const x = values.length <= 1 ? 330 : index * 660 / (values.length - 1);
        const y = 174 - (item.value / max) * 150;
        return <circle key={item.date} cx={x} cy={y} r="4" fill="#f51f3b" stroke="#f5f3ff" strokeWidth="1.5"/>;
      })}
    </svg>
  </div>;
}

export default function DashboardPage({ navigate }) {
  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const load = () => Promise.all([adminService.listSessions(), adminService.listMovies(), adminService.listActivities(), adminService.listTickets()])
      .then(([s, m, a, t]) => { setSessions(s); setMovies(m); setActivities(a); setTickets(t); setError(""); })
      .catch((err) => setError(err.message || "Não foi possível carregar os dados do painel."));
    load();
    const refresh = window.setInterval(load, 30000);
    return () => window.clearInterval(refresh);
  }, []);

  const ticketCount = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const revenue = tickets.reduce((sum, ticket) => sum + ticket.totalValue, 0);
  const publishedMovies = movies
    .filter((movie) => movie.status === "Publicado")
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 3);
  const featured = publishedMovies.find((movie) => movie.featured) || publishedMovies[0];
  const featuredTickets = featured ? tickets.filter((ticket) => ticket.movie === featured.title) : [];
  const featuredCount = featuredTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const featuredRevenue = featuredTickets.reduce((sum, ticket) => sum + ticket.totalValue, 0);
  const todayString = localDateKey(new Date());
  const todaySessions = sessions.filter((session) => session.isoDate === todayString);
  const todaySold = todaySessions.reduce((sum, session) => sum + session.sold, 0);
  const todayCapacity = todaySessions.reduce((sum, session) => sum + session.capacity, 0);
  const occupancy = todayCapacity ? `${Math.round(todaySold / todayCapacity * 100)}%` : "—";

  const chartValues = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const key = localDateKey(date);
      return { date: key, label: dateLabel(key), value: 0 };
    });
    const byDate = new Map(dates.map((item) => [item.date, item]));
    tickets.forEach((ticket) => {
      if (!ticket.createdAt) return;
      const created = new Date(ticket.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const item = byDate.get(localDateKey(created));
      if (item) item.value += Number(ticket.totalValue || 0);
    });
    return dates;
  }, [tickets]);

  const roomOccupancy = useMemo(() => {
    const groups = new Map();
    todaySessions.forEach((session) => {
      const key = session.room || `Sala ${session.roomId}`;
      if (!groups.has(key)) groups.set(key, { name: key, sold: 0, capacity: 0 });
      const room = groups.get(key);
      room.sold += Number(session.sold || 0);
      room.capacity += Number(session.capacity || 0);
    });
    return [...groups.values()].map((room) => ({ ...room, value: room.capacity ? Math.round(room.sold / room.capacity * 100) : 0 }));
  }, [todaySessions]);

  return <>
    <PageHeader eyebrow="RESUMO DO CINEMA" title="Visão geral" description="Acompanhe os dados registrados no banco compartilhado pelo app, site e dashboard." actions={<><Button variant="secondary" icon="calendar" onClick={() => navigate("/sessoes")}>Ver sessões</Button><Button icon="plus" onClick={() => navigate("/filmes/novo")}>Cadastrar filme</Button></>}/>
    {error && <div className="form-error" role="alert">{error}</div>}
    <section className="stats-grid">
      <StatCard label="FATURAMENTO REGISTRADO" value={money(revenue)} note="Soma dos pedidos confirmados" icon="wallet" tone="purple"/>
      <StatCard label="INGRESSOS VENDIDOS" value={ticketCount.toLocaleString("pt-BR")} note={`${tickets.length} pedido(s) registrados`} icon="ticket" tone="blue"/>
      <StatCard label="SESSÕES HOJE" value={String(todaySessions.length)} note={`${sessions.length} sessões cadastradas no total`} icon="calendar" tone="red"/>
      <StatCard label="OCUPAÇÃO DE HOJE" value={occupancy} note={`${todaySold} de ${todayCapacity} lugares vendidos`} icon="chart" tone="gold"/>
    </section>

    {featured && <section className="dashboard-feature">
      <div className="feature-background" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,7,35,.98) 0%, rgba(10,7,35,.78) 48%, rgba(10,7,35,.25) 100%), linear-gradient(0deg, rgba(10,7,35,.6), transparent 65%), url('${assetUrl(featured.heroImage)}')` }}/>
      <div className="feature-content"><div className="feature-kicker"><span/> FILME EM DESTAQUE</div><div className="feature-small">CINEMINHA APRESENTA</div><h2>{featured.heroTitle || featured.title} <em>{featured.heroAccent}</em></h2><p>{featured.description}</p><div className="feature-meta"><span>{featured.year || "—"}</span><i/> <span>{featured.genre}</span><i/> <span>{featured.duration}</span><i/> <b>{featured.rating}</b></div></div>
      <div className="feature-numbers"><div><small>INGRESSOS VENDIDOS</small><strong>{featuredCount}</strong></div><div><small>FATURAMENTO</small><strong>{money(featuredRevenue)}</strong></div><div><small>SESSÕES</small><strong>{sessions.filter((session) => session.movieId === featured.id).length}</strong></div></div>
    </section>}

    <section className="dashboard-grid dashboard-grid-main">
      <Panel title="Receita do cinema" subtitle="Compras registradas nos últimos 7 dias" actions={<span className="subtle-label">ÚLTIMOS 7 DIAS</span>} className="revenue-panel"><div className="chart-total"><strong>{money(chartValues.reduce((sum, item) => sum + item.value, 0))}</strong><small>receita registrada no período</small></div><RevenueChart values={chartValues}/><div className="chart-x-labels">{chartValues.map((item) => <span key={item.date}>{item.label}</span>)}</div></Panel>
      <Panel title="Ocupação das salas" subtitle="Distribuição das sessões de hoje" actions={<span className="subtle-label">HOJE</span>} className="occupancy-panel"><div className="occupancy-summary"><strong>{occupancy === "—" ? "—" : occupancy.replace("%", "")}<span>{occupancy === "—" ? "" : "%"}</span></strong></div><div className="room-progress-list">{roomOccupancy.map((room) => <div className="room-progress" key={room.name}><span>{room.name}</span><div><i style={{ width: `${room.value}%` }}/></div><b>{room.value}%</b></div>)}{roomOccupancy.length === 0 && <p className="empty-state">Nenhuma sessão programada para hoje.</p>}</div><div className="occupancy-foot"><span><i/> Lugares ocupados</span><strong>{todaySold} / {todayCapacity}</strong></div></Panel>
    </section>

    <section className="dashboard-grid dashboard-grid-lower">
      <Panel title="Próximas sessões" subtitle="Programação a partir de hoje" actions={<button className="text-link" onClick={() => navigate("/sessoes")}>Ver todas <Icon name="arrow" size={14}/></button>} className="upcoming-panel">
        <div className="compact-session-list">{sessions.filter((session) => session.isoDate >= todayString).slice(0, 4).map((session) => { const movie = movies.find((item) => item.id === session.movieId); return <div className="compact-session" key={session.id}><strong className="compact-time">{session.time}</strong><img src={assetUrl(movie?.poster)} alt=""/><div className="compact-movie"><strong>{session.movie}</strong><small>{session.date} · {session.room} · {session.format}</small></div><div className="compact-capacity"><div><strong>{session.sold}</strong><small> / {session.capacity}</small></div><div className="mini-progress"><i style={{ width: `${session.capacity ? Math.round(session.sold/session.capacity*100) : 0}%` }}/></div></div><StatusBadge tone={session.status === "Cancelada" ? "danger" : "success"}>{session.status}</StatusBadge></div>; })}{sessions.filter((session) => session.isoDate >= todayString).length === 0 && <p className="empty-state">Nenhuma sessão futura cadastrada. Crie uma sessão para liberar a compra no app e no site.</p>}</div>
      </Panel>
      <div className="dashboard-side-stack">
        <Panel title="Filmes do catálogo" subtitle={`${movies.length} títulos cadastrados`} actions={<button className="text-link" onClick={() => navigate("/filmes")}>Abrir catálogo <Icon name="arrow" size={14}/></button>}>
          <div className="mini-movie-list">{publishedMovies.map((movie) => <div className="mini-movie" key={movie.id}><img src={assetUrl(movie.poster)} alt=""/><div><strong>{movie.title}</strong><small>{movie.genre} · {movie.duration}</small></div><StatusBadge tone="success">{movie.featured ? "Destaque" : "Publicado"}</StatusBadge></div>)}{publishedMovies.length === 0 && <p className="empty-state">Nenhum filme publicado no catálogo.</p>}</div>
        </Panel>
        <Panel title="Atividade recente" subtitle="Compras mais recentes">
          <div className="activity-list">{activities.map((activity, index) => <div className="activity-item" key={`${activity.name}-${index}`}><div className={`activity-avatar ${activity.color}`}>{activity.initials}</div><div className="activity-copy"><strong>{activity.name}</strong><small>{activity.detail}</small><span>{activity.time}</span></div><b className="activity-value">{activity.value}</b></div>)}{activities.length === 0 && <p className="empty-state">Ainda não há compras registradas.</p>}</div>
        </Panel>
      </div>
    </section>
  </>;
}
