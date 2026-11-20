import Icon from "../Icon";
import { assetUrl } from "../../utils/assets";

const navigation = [
  { heading: "PRINCIPAL", items: [{ label: "Visão geral", icon: "dashboard", path: "/dashboard" }] },
  { heading: "CATÁLOGO", items: [{ label: "Filmes", icon: "film", path: "/filmes" }] },
  { heading: "OPERAÇÃO", items: [
    { label: "Sessões", icon: "calendar", path: "/sessoes" },
    { label: "Salas", icon: "screen", path: "/salas" },
    { label: "Ingressos", icon: "ticket", path: "/ingressos" },
  ] },
  { heading: "RELACIONAMENTO", items: [{ label: "Clientes", icon: "users", path: "/clientes" }] },
  { heading: "ANÁLISES", items: [{ label: "Relatórios", icon: "chart", path: "/relatorios" }] },
  { heading: "SISTEMA", items: [{ label: "Configurações", icon: "settings", path: "/configuracoes" }] },
];

const titles = {
  "/dashboard": "Visão geral", "/filmes": "Filmes", "/filmes/novo": "Cadastrar filme",
  "/sessoes": "Sessões", "/salas": "Salas", "/ingressos": "Ingressos",
  "/clientes": "Clientes", "/relatorios": "Relatórios", "/configuracoes": "Configurações",
};

export default function AppShell({ path, navigate, children }) {
  const pageTitle = path.includes("/editar") ? "Editar filme" : titles[path] ?? "Painel administrativo";
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="sidebar-brand"><img src="/images/cineminha-logo-original.png" alt="CineMinha"/><span>PAINEL ADMINISTRATIVO</span></div>
      <div className="sidebar-divider"/>
      <nav className="sidebar-nav" aria-label="Menu administrativo">
        {navigation.map((group) => <div className="nav-group" key={group.heading}>
          <div className="nav-heading">{group.heading}</div>
          {group.items.map((item) => <button key={item.path} className={`nav-item ${path === item.path || (item.path === "/filmes" && path.startsWith("/filmes")) ? "active" : ""}`} onClick={() => navigate(item.path)}>
            <Icon name={item.icon} size={18}/><span>{item.label}</span>
          </button>)}
        </div>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="admin-profile"><div className="admin-avatar">CM</div><div><strong>Administrador</strong><small>Equipe CineMinha</small></div><Icon name="dots" size={17}/></div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-breadcrumb"><span>PAINEL</span><i>/</i><strong>{pageTitle}</strong></div>
        <div className="topbar-right"><div className="topbar-date">SEXTA-FEIRA, 13 NOV 2026</div><div className="topbar-avatar">CM</div></div>
      </header>
      <div className="page-content">{children}</div>
    </main>
  </div>;
}
