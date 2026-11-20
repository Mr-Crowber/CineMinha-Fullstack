import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services";
import { Button, PageHeader, Panel, StatCard } from "../components/ui";

const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dateKey = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};
const dateLabel = (key) => `${key.slice(8, 10)}/${key.slice(5, 7)}`;

function BarChart({ days }) {
  const max = Math.max(1, ...days.map((day) => day.tickets));
  return <div className="bar-chart">{days.map((day) => <div className="bar-column" key={day.date}><div className="bar-pair"><i style={{ height: `${day.tickets ? Math.max(3, day.tickets / max * 100) : 0}%` }}/></div><span>{day.label}</span></div>)}</div>;
}

export default function ReportsPage() {
  const [tickets, setTickets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const load = () => Promise.all([adminService.listTickets(), adminService.listSessions(), adminService.listMovies()])
      .then(([t, s, m]) => { setTickets(t); setSessions(s); setMovies(m); setError(""); })
      .catch((err) => setError(err.message || "Não foi possível carregar os relatórios."));
    load();
    const refresh = window.setInterval(load, 30000);
    return () => window.clearInterval(refresh);
  }, []);

  const ticketCount = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const gross = tickets.reduce((sum, ticket) => sum + ticket.totalValue, 0);
  const averageTicket = ticketCount ? gross / ticketCount : 0;
  const allCapacity = sessions.reduce((sum, session) => sum + session.capacity, 0);
  const allSold = sessions.reduce((sum, session) => sum + session.sold, 0);
  const occupancy = allCapacity ? `${Math.round(allSold / allCapacity * 100)}%` : "—";

  const dailySales = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const key = dateKey(date);
      return { date: key, label: dateLabel(key), tickets: 0, revenue: 0 };
    });
    const map = new Map(days.map((day) => [day.date, day]));
    tickets.forEach((ticket) => {
      if (!ticket.createdAt) return;
      const created = new Date(ticket.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const day = map.get(dateKey(created));
      if (day) { day.tickets += ticket.quantity; day.revenue += ticket.totalValue; }
    });
    return days;
  }, [tickets]);

  const genreSales = useMemo(() => {
    const movieGenre = new Map(movies.map((movie) => [movie.title, movie.genre || "Não informado"]));
    const groups = new Map();
    tickets.forEach((ticket) => {
      const genre = movieGenre.get(ticket.movie) || "Não informado";
      groups.set(genre, (groups.get(genre) || 0) + ticket.quantity);
    });
    const total = [...groups.values()].reduce((sum, value) => sum + value, 0);
    return [...groups.entries()].map(([name, value]) => ({ name, value, percent: total ? Math.round(value / total * 100) : 0 })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [movies, tickets]);

  const movieSales = useMemo(() => {
    const groups = new Map();
    tickets.forEach((ticket) => {
      const item = groups.get(ticket.movie) || { name: ticket.movie, revenue: 0, tickets: 0 };
      item.revenue += ticket.totalValue;
      item.tickets += ticket.quantity;
      groups.set(ticket.movie, item);
    });
    return [...groups.values()].sort((a, b) => b.revenue - a.revenue);
  }, [tickets]);

  const busiestDay = [...dailySales].sort((a, b) => b.tickets - a.tickets)[0];
  const roomStats = useMemo(() => {
    const groups = new Map();
    sessions.forEach((session) => {
      const room = groups.get(session.room) || { name: session.room, sold: 0, capacity: 0 };
      room.sold += session.sold;
      room.capacity += session.capacity;
      groups.set(session.room, room);
    });
    return [...groups.values()].map((room) => ({ ...room, percent: room.capacity ? Math.round(room.sold / room.capacity * 100) : 0 })).sort((a, b) => b.percent - a.percent);
  }, [sessions]);
  const topMovie = movieSales[0];
  const topRoom = roomStats[0];

  const exportReport = () => {
    const lines = ["Pedido,Cliente,Filme,Sessao,Assentos,Quantidade,Total,Status", ...tickets.map((ticket) => [ticket.id, ticket.customer, ticket.movie, ticket.session, ticket.seatsLabel, ticket.quantity, ticket.totalValue.toFixed(2), ticket.status].map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))];
    const blob = new Blob(["\uFEFF", lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cineminhas-relatorio-de-vendas.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <>
    <PageHeader eyebrow="ANÁLISES" title="Relatórios" description="Indicadores calculados a partir dos pedidos e sessões persistidos no banco de dados." actions={<Button variant="secondary" icon="download" onClick={exportReport}>Exportar vendas CSV</Button>}/>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="report-filter-row"><span>BASE DE CÁLCULO</span><strong className="report-period-value">Todos os pedidos e sessões registrados</strong></div>
    <section className="stats-grid"><StatCard label="RECEITA BRUTA REGISTRADA" value={money(gross)} note="Soma dos pedidos confirmados" icon="wallet" tone="purple"/><StatCard label="INGRESSOS" value={ticketCount.toLocaleString("pt-BR")} note={`${tickets.length} pedidos agrupados`} icon="ticket" tone="blue"/><StatCard label="TICKET MÉDIO" value={money(averageTicket)} note="Receita dividida por ingresso" icon="chart" tone="gold"/><StatCard label="OCUPAÇÃO DAS SESSÕES" value={occupancy} note={`${allSold} de ${allCapacity} lugares cadastrados`} icon="screen" tone="red"/></section>
    <section className="dashboard-grid report-grid">
      <Panel title="Ingressos por dia" subtitle="Compras registradas nos últimos sete dias"><BarChart days={dailySales}/><div className="chart-x-labels">{dailySales.map((day) => <span key={day.date}>{day.label}</span>)}</div><p className="report-chart-total">{dailySales.reduce((sum, day) => sum + day.tickets, 0)} ingressos vendidos no período · {money(dailySales.reduce((sum, day) => sum + day.revenue, 0))}</p></Panel>
      <Panel title="Vendas por gênero" subtitle="Distribuição de ingressos por categoria"><div className="genre-distribution">{genreSales.map((item, index) => <div className="genre-row" key={item.name}><div><span>{item.name}</span><strong>{item.percent}%</strong></div><div className="genre-track"><i className={`genre-${["purple", "blue", "red", "gold"][index % 4]}`} style={{ width: `${item.percent}%` }}/></div><small>{item.value} ingresso(s)</small></div>)}{genreSales.length === 0 && <p className="empty-state">As vendas por gênero aparecerão após as primeiras compras.</p>}</div></Panel>
    </section>
    <Panel title="Resumo consolidado" subtitle="Destaques com base nos dados cadastrados"><div className="report-summary-grid"><div><span>FILME COM MAIOR RECEITA</span><strong>{topMovie?.name || "—"}</strong><small>{topMovie ? money(topMovie.revenue) : "Sem vendas registradas"}</small></div><div><span>DIA DE MAIOR MOVIMENTO (7 DIAS)</span><strong>{busiestDay?.tickets ? busiestDay.label : "—"}</strong><small>{busiestDay?.tickets || 0} ingressos vendidos</small></div><div><span>SALA COM MAIOR OCUPAÇÃO</span><strong>{topRoom?.name || "—"}</strong><small>{topRoom ? `${topRoom.percent}% de ocupação` : "Sem sessões cadastradas"}</small></div><div><span>TOTAL DE SESSÕES</span><strong>{sessions.length}</strong><small>Programadas e históricas</small></div></div></Panel>
  </>;
}
