import AppShell from "../components/layout/AppShell";
import DashboardPage from "../pages/DashboardPage";
import MoviesPage from "../pages/MoviesPage";
import MovieFormPage from "../pages/MovieFormPage";
import SessionsPage from "../pages/SessionsPage";
import RoomsPage from "../pages/RoomsPage";
import TicketsPage from "../pages/TicketsPage";
import CustomersPage from "../pages/CustomersPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import Icon from "../components/Icon";
import { Button } from "../components/ui";
import { useHashRoute } from "./useHashRoute";

function NotFound({ navigate }) {
  return <div className="not-found"><div><Icon name="info" size={26}/></div><h1>Página não encontrada</h1><p>O endereço solicitado não foi encontrado.</p><Button onClick={() => navigate("/dashboard")}>Voltar à visão geral</Button></div>;
}

export default function App() {
  const { path, navigate } = useHashRoute();
  let page;
  const editMatch = path.match(/^\/filmes\/([^/]+)\/editar$/);
  if (path === "/dashboard" || path === "/") page = <DashboardPage navigate={navigate}/>;
  else if (path === "/filmes") page = <MoviesPage navigate={navigate}/>;
  else if (path === "/filmes/novo") page = <MovieFormPage navigate={navigate}/>;
  else if (editMatch) page = <MovieFormPage navigate={navigate} movieId={editMatch[1]}/>;
  else if (path === "/sessoes") page = <SessionsPage/>;
  else if (path === "/salas") page = <RoomsPage/>;
  else if (path === "/ingressos") page = <TicketsPage/>;
  else if (path === "/clientes") page = <CustomersPage/>;
  else if (path === "/relatorios") page = <ReportsPage/>;
  else if (path === "/configuracoes") page = <SettingsPage/>;
  else page = <NotFound navigate={navigate}/>;

  return <AppShell path={path} navigate={navigate}>{page}</AppShell>;
}
