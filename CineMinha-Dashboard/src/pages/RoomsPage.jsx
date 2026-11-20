import { useEffect, useState } from "react";
import { adminService } from "../services";
import Icon from "../components/Icon";
import { Button, Modal, PageHeader, Panel, SelectInput, StatusBadge, TextInput } from "../components/ui";

const emptyDraft = { name: "", seats: "120", status: "Ativa", format: "2D / 3D", sound: "Dolby Digital" };

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = () => adminService.listRooms().then(setRooms).catch((err) => setError(err.message || "Não foi possível carregar as salas."));
  useEffect(() => { load(); }, []);
  const updateDraft = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  const createRoom = async () => {
    setSaving(true); setError("");
    try {
      await adminService.createRoom({ ...draft, seats: Number(draft.seats) });
      setDraft(emptyDraft); setModal(false); await load();
    } catch (err) { setError(err.message || "Não foi possível salvar a sala."); }
    finally { setSaving(false); }
  };
  const active = rooms.filter((room) => room.status === "Ativa").length;
  const capacity = rooms.reduce((sum, room) => sum + Number(room.seats || 0), 0);
  return <>
    <PageHeader eyebrow="ESTRUTURA" title="Salas" description="Cadastre as salas que poderão receber sessões e vendas de ingressos." actions={<Button icon="plus" onClick={() => setModal(true)}>Adicionar sala</Button>}/>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="stats-grid three-stats"><div className="small-stat"><span>SALAS CADASTRADAS</span><strong>{rooms.length}</strong><small>no banco de dados</small></div><div className="small-stat"><span>CAPACIDADE TOTAL</span><strong>{capacity.toLocaleString("pt-BR")}</strong><small>assentos configurados</small></div><div className="small-stat"><span>SALAS ATIVAS</span><strong>{active}</strong><small>disponíveis para sessões</small></div></div>
    <div className="room-card-grid">{rooms.map((room, index) => <Panel key={room.id} className="room-card"><div className="room-card-top"><div className="room-number"><Icon name="screen" size={21}/><span>{String(index + 1).padStart(2, "0")}</span></div><StatusBadge tone={room.status === "Ativa" ? "success" : "warning"}>{room.status}</StatusBadge></div><h2>{room.name}</h2><p>{room.format} · {room.sound}</p><div className="room-card-capacity"><strong>{room.seats}</strong><span>assentos</span></div><div className="room-card-bottom"><span>ID {room.id}</span><span>Cadastro persistido</span></div></Panel>)}</div>
    {modal && <Modal title="Adicionar sala" description="Informe as características da nova sala." onClose={() => setModal(false)} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancelar</Button><Button disabled={saving || !draft.name.trim()} onClick={createRoom}>{saving ? "Salvando..." : "Salvar sala"}</Button></>}><div className="form-grid"><TextInput label="Nome da sala" placeholder="Ex.: Sala 05" value={draft.name} onChange={updateDraft("name")}/><div className="form-grid two-columns"><TextInput label="Capacidade de assentos" type="number" value={draft.seats} onChange={updateDraft("seats")}/><SelectInput label="Status" value={draft.status} onChange={updateDraft("status")} options={["Ativa", "Manutenção", "Inativa"]}/></div><div className="form-grid two-columns"><SelectInput label="Formatos suportados" value={draft.format} onChange={updateDraft("format")} options={["2D", "2D / 3D", "3D", "IMAX"]}/><SelectInput label="Sistema de som" value={draft.sound} onChange={updateDraft("sound")} options={["Dolby Digital", "Dolby Atmos", "DTS"]}/></div></div></Modal>}
  </>;
}
