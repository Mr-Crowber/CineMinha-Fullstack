import { useEffect, useState } from "react";
import { adminService } from "../services";
import { Button, PageHeader, Panel, SearchBox, StatusBadge, StatCard } from "../components/ui";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const load = () => adminService.listCustomers().then((rows) => { setCustomers(rows); setError(""); }).catch((err) => setError(err.message || "Não foi possível carregar os clientes."));
    load();
    const refresh = window.setInterval(load, 30000);
    return () => window.clearInterval(refresh);
  }, []);
  const filtered = customers.filter((customer) => `${customer.name} ${customer.email} ${customer.id}`.toLowerCase().includes(query.toLowerCase()));
  const buyers = customers.length;
  const tickets = customers.reduce((sum, customer) => sum + customer.tickets, 0);
  const revenue = customers.reduce((sum, customer) => sum + customer.spentValue, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return <>
    <PageHeader eyebrow="RELACIONAMENTO" title="Clientes" description="Clientes identificados a partir das compras registradas no site e no aplicativo." actions={<Button variant="secondary" icon="download" onClick={() => { const rows = ["Nome,Email,Ingressos,Total gasto", ...filtered.map((c) => [c.name, c.email, c.tickets, c.spent].map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))]; const blob = new Blob(["\uFEFF", rows.join("\n")], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "cineminhas-clientes.csv"; a.click(); URL.revokeObjectURL(url); }}>Exportar lista</Button>}/>
    {error && <div className="form-error" role="alert">{error}</div>}
    <section className="stats-grid three-stats"><StatCard label="CLIENTES COM COMPRA" value={buyers.toLocaleString("pt-BR")} note="Clientes únicos nos pedidos" icon="users" tone="purple"/><StatCard label="INGRESSOS COMPRADOS" value={tickets.toLocaleString("pt-BR")} note="Total registrado" icon="ticket" tone="blue"/><StatCard label="TOTAL MOVIMENTADO" value={revenue} note="Soma das compras registradas" icon="wallet" tone="gold"/></section>
    <Panel title="Clientes" subtitle="A lista é formada pelos nomes informados na finalização da compra"><div className="table-toolbar"><SearchBox value={query} onChange={setQuery} placeholder="Buscar nome ou código..."/><span className="results-count">{filtered.length} clientes</span></div><div className="table-wrap"><table className="data-table"><thead><tr><th>CLIENTE</th><th>CÓDIGO</th><th>PRIMEIRA COMPRA</th><th>INGRESSOS</th><th>TOTAL GASTO</th><th>STATUS</th></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.id}><td><div className="customer-cell"><div className="customer-avatar">{customer.initials}</div><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td><td>{customer.id}</td><td>{customer.since}</td><td>{customer.tickets}</td><td><strong>{customer.spent}</strong></td><td><StatusBadge tone="success">{customer.status}</StatusBadge></td></tr>)}</tbody></table></div>{filtered.length === 0 && <p className="empty-state">Nenhum cliente encontrado.</p>}</Panel>
  </>;
}
