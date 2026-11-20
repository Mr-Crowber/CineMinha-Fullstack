import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services";
import { PageHeader, Panel, SearchBox, StatusBadge, StatCard } from "../components/ui";

const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [error, setError] = useState("");
  useEffect(() => {
    const load = () => adminService.listTickets().then((rows) => { setTickets(rows); setError(""); }).catch((err) => setError(err.message || "Não foi possível carregar as vendas."));
    load();
    const refresh = window.setInterval(load, 15000);
    return () => window.clearInterval(refresh);
  }, []);
  const filtered = useMemo(() => tickets.filter((item) => `${item.id} ${item.customer} ${item.movie} ${item.seatsLabel}`.toLowerCase().includes(query.toLowerCase()) && (status === "Todos" || item.status === status)), [tickets, query, status]);
  const ticketCount = tickets.reduce((sum, item) => sum + item.quantity, 0);
  const revenue = tickets.reduce((sum, item) => sum + item.totalValue, 0);
  return <>
    <PageHeader eyebrow="OPERAÇÃO" title="Ingressos" description="Compras realizadas no aplicativo e no site, atualizadas diretamente pelo banco de dados."/>
    {error && <div className="form-error" role="alert">{error}</div>}
    <section className="stats-grid three-stats"><StatCard label="INGRESSOS VENDIDOS" value={ticketCount.toLocaleString("pt-BR")} note={`${tickets.length} pedido(s) registrados`} icon="ticket" tone="blue"/><StatCard label="FATURAMENTO REGISTRADO" value={money(revenue)} note="Soma dos ingressos confirmados" icon="wallet" tone="purple"/><StatCard label="PEDIDOS" value={tickets.length.toLocaleString("pt-BR")} note="Compras no sistema" icon="receipt" tone="red"/></section>
    <Panel title="Histórico de ingressos" subtitle="Cada registro agrupa os assentos de uma mesma compra"><div className="table-toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Buscar pedido, cliente, filme ou assento..."/><select className="toolbar-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>Confirmado</option><option>Estornado</option></select><span className="results-count">{filtered.length} pedido(s)</span></div><div className="table-wrap"><table className="data-table"><thead><tr><th>PEDIDO</th><th>CLIENTE</th><th>FILME</th><th>SESSÃO</th><th>ASSENTOS</th><th>QUANTIDADE</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>{filtered.map((ticket) => <tr key={ticket.orderId}><td><strong>{ticket.id}</strong><small>{ticket.date}</small></td><td>{ticket.customer}</td><td>{ticket.movie}</td><td>{ticket.session}</td><td>{ticket.seatsLabel || "—"}</td><td>{ticket.quantity}</td><td><strong>{ticket.total}</strong></td><td><StatusBadge tone={ticket.status === "Confirmado" ? "success" : "danger"}>{ticket.status}</StatusBadge></td></tr>)}</tbody></table></div>{filtered.length === 0 && <p className="empty-state">Nenhum ingresso encontrado.</p>}</Panel>
  </>;
}
