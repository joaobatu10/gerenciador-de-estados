import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/");
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Bem-vindo ao dashboard {user?.email}</p>

      <button onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}