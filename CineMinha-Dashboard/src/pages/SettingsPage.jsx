import { useState } from "react";
import Icon from "../components/Icon";
import { Button, PageHeader, Panel, SelectInput, TextInput } from "../components/ui";

function Preference({ title, description, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <div className="preference-row"><div><strong>{title}</strong><small>{description}</small></div><button type="button" className={`toggle-switch ${checked ? "checked" : ""}`} onClick={() => setChecked(!checked)} aria-pressed={checked}><i/></button></div>;
}

export default function SettingsPage() {
  return <>
    <PageHeader eyebrow="SISTEMA" title="Configurações" description="Informações gerais e preferências do ambiente administrativo."/>
    <div className="settings-layout">
      <div className="settings-main">
        <Panel title="Identificação do cinema" subtitle="Dados institucionais do CineMinha">
          <div className="settings-form-grid"><TextInput label="Nome de exibição" defaultValue="CineMinha"/><TextInput label="E-mail de contato" type="email" defaultValue="contato@cineminha.com.br"/><TextInput label="Telefone" defaultValue="(11) 4000-2026"/><TextInput label="Cidade" defaultValue="São Paulo · SP"/><SelectInput label="Fuso horário" defaultValue="America/Sao_Paulo" options={[{value:"America/Sao_Paulo",label:"Brasília (GMT-3)"},{value:"America/Manaus",label:"Manaus (GMT-4)"}]}/><SelectInput label="Idioma do painel" defaultValue="pt-BR" options={[{value:"pt-BR",label:"Português (Brasil)"},{value:"en",label:"English"}]}/></div>
          <div className="settings-action"><Button>Salvar configurações</Button></div>
        </Panel>
        <Panel title="Preferências" subtitle="Comportamento visual e notificações do painel">
          <div className="preference-list"><Preference title="Notificações administrativas" description="Exibir alertas sobre movimentações e operação." defaultChecked/><Preference title="Resumo ao entrar no painel" description="Abrir a visão geral como página inicial." defaultChecked/><Preference title="Avisos de lotação" description="Destacar sessões próximas da capacidade máxima." defaultChecked={false}/><Preference title="Modo de baixa luminosidade" description="Manter a interface escura do CineMinha." defaultChecked/></div>
        </Panel>
      </div>
      <aside className="settings-side">
        <Panel title="Ambiente" subtitle="Informações do painel"><div className="environment-list"><div><span>Aplicação</span><strong>Dashboard CineMinha</strong></div><div><span>Interface</span><strong>React + Vite</strong></div><div><span>Área</span><strong>Administrativa</strong></div></div></Panel>
        <Panel title="Acesso e permissões" subtitle="Perfis e permissões administrativas"><div className="security-info"><div className="security-icon"><Icon name="shield" size={20}/></div><div><strong>Gestão de acesso</strong><p>Organize os perfis e níveis de acesso dos usuários administrativos.</p></div></div></Panel>
      </aside>
    </div>
  </>;
}

