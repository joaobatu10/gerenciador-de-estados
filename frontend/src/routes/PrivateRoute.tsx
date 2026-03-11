import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

type Props = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: Props) {

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <h2>Carregando...</h2>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}