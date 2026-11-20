import { useEffect, useMemo, useState } from "react";
import { adminService } from "../services";
import { Button, Modal, PageHeader, Panel, SelectInput, StatusBadge, TextInput } from "../components/ui";

const localDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};
const emptyDraft = () => ({ movieId: "", date: localDate(), time: "19:30", roomId: "", format: "2D · Dublado", ticketPrice: "30.00", halfPrice: "15.00" });

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("Todas as datas");
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [s, m, r] = await Promise.all([adminService.listSessions(), adminService.listMovies(), adminService.listRooms()]);
      setSessions(s); setMovies(m.filter((movie) => movie.status === "Publicado")); setRooms(r.filter((room) => room.status === "Ativa"));
      setDraft((current) => ({ ...current, movieId: current.movieId || String(m.find((movie) => movie.status === "Publicado")?.id || ""), roomId: current.roomId || String(r.find((room) => room.status === "Ativa")?.id || "") }));
    } catch (err) { setError(err.message || "Não foi possível carregar as sessões."); }
  };
  useEffect(() => {
    load();
    const refresh = window.setInterval(load, 30000);
    return () => window.clearInterval(refresh);
  }, []);
  const updateDraft = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  const createSession = async () => {
    setSaving(true); setError("");
    try {
      await adminService.createSession({ ...draft, movieId: Number(draft.movieId), roomId: Number(draft.roomId), ticketPrice: Number(draft.ticketPrice), halfPrice: Number(draft.halfPrice) });
      setShowModal(false); setDraft(emptyDraft()); await load();
    } catch (err) { setError(err.message || "Não foi possível cadastrar a sessão."); }
    finally { setSaving(false); }
  };
  const shown = useMemo(() => {
    if (filter === "Todas as datas") return sessions;
    if (filter === "Hoje") return sessions.filter((session) => session.isoDate === localDate());
    return sessions.filter((session) => session.isoDate > localDate());
  }, [sessions, filter]);
  const capacity = sessions.reduce((sum, item) => sum + item.capacity, 0);
  const sold = sessions.reduce((sum, item) => sum + item.sold, 0);
  const occupancy = capacity ? `${Math.round(sold / capacity * 100)}%` : "0%";
  const tone = (status) => status === "Cancelada" ? "danger" : status === "Em andamento" ? "info" : "success";

  return <>
    <PageHeader eyebrow="OPERAÇÃO" title="Sessões" description="A programação cadastrada aqui aparece como opção de compra no app e no site." actions={<Button icon="plus" onClick={() => { setError(""); setShowModal(true); }}>Nova sessão</Button>}/>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="stats-grid three-stats"><div className="small-stat"><span>SESSÕES CADASTRADAS</span><strong>{sessions.length}</strong><small>no banco de dados</small></div><div className="small-stat"><span>INGRESSOS VENDIDOS</span><strong>{sold}</strong><small>somando as sessões</small></div><div className="small-stat"><span>OCUPAÇÃO MÉDIA</span><strong>{occupancy}</strong><small>com base na capacidade das salas</small></div></div>
    <Panel title="Programação" subtitle="Sessões disponíveis para venda" actions={<select className="toolbar-select" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Todas as datas</option><option>Hoje</option><option>Próximos dias</option></select>}>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>FILME / ID</th><th>DATA E HORÁRIO</th><th>SALA</th><th>FORMATO</th><th>OCUPAÇÃO</th><th>STATUS</th></tr></thead><tbody>{shown.map((session) => <tr key={session.id}><td><strong>{session.movie}</strong><small>SES-{String(session.id).padStart(4, "0")}</small></td><td><strong>{session.date}</strong><small>{session.time}</small></td><td>{session.room}</td><td>{session.format}</td><td><div className="table-occupancy"><div><i style={{ width: `${session.capacity ? session.sold / session.capacity * 100 : 0}%` }}/></div><span>{session.sold}/{session.capacity}</span></div></td><td><StatusBadge tone={tone(session.status)}>{session.status}</StatusBadge></td></tr>)}</tbody></table></div>
      {shown.length === 0 && <p className="empty-state">Nenhuma sessão cadastrada para este filtro.</p>}
    </Panel>
    {showModal && <Modal title="Cadastrar sessão" description="Defina o filme, data, horário, sala e preços. A compra usará esses valores no servidor." onClose={() => setShowModal(false)} footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button><Button disabled={saving || !draft.movieId || !draft.roomId} onClick={createSession}>{saving ? "Salvando..." : "Salvar sessão"}</Button></>}>
      <div className="form-grid"><SelectInput label="Filme publicado" value={draft.movieId} onChange={updateDraft("movieId")} options={movies.map((movie) => ({ value: String(movie.id), label: movie.title }))}/><div className="form-grid two-columns"><TextInput label="Data" type="date" value={draft.date} onChange={updateDraft("date")}/><TextInput label="Horário" type="time" value={draft.time} onChange={updateDraft("time")}/></div><div className="form-grid two-columns"><SelectInput label="Sala" value={draft.roomId} onChange={updateDraft("roomId")} options={rooms.map((room) => ({ value: String(room.id), label: `${room.name} · ${room.seats} lugares` }))}/><SelectInput label="Formato" value={draft.format} onChange={updateDraft("format")} options={["2D · Dublado", "2D · Legendado", "3D · Dublado", "3D · Legendado"]}/></div><div className="form-grid two-columns"><TextInput label="Inteira (R$)" type="number" step="0.01" value={draft.ticketPrice} onChange={updateDraft("ticketPrice")}/><TextInput label="Meia-entrada (R$)" type="number" step="0.01" value={draft.halfPrice} onChange={updateDraft("halfPrice")}/></div></div>
    </Modal>}
  </>;
}
