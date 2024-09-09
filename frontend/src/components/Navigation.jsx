import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { isAuthenticated } from "./auth/isAuthenticated";

const Navigation = () => {
  const navigate = useNavigate();
  // Verifica se o usuário está autenticado
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token do local storage
    navigate("/login"); // Redireciona o usuário para a página de login
  };

  // Hook para redirecionar o usuário se ele estiver autenticado
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (
      authenticated &&
      (currentPath === "/login" || currentPath === "/register")
    ) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  return (
    <Navbar position="static">
      <NavbarBrand>
        <Link className="font-bold text-inherit cursor-pointer" to="/">
          Task Manager
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {authenticated && (
          <NavbarItem>
            <Link color="foreground" to="/tasks">
              Tarefas
            </Link>
          </NavbarItem>
        )}
        <NavbarItem>
          <Link
            color="foreground"
            to="https://github.com/genilson-alves"
            target="_blank"
          >
            GitHub
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            to="https://www.linkedin.com/in/genilson-alves0/"
            target="_blank"
          >
            LinkedIn
          </Link>
        </NavbarItem>
      </NavbarContent>
      {authenticated && (
        <NavbarContent justify="end">
          <Button
            as={Link}
            color="primary"
            to="#"
            variant="flat"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </NavbarContent>
      )}
      {!authenticated && (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} color="secondary" to="/login" variant="flat">
              Entrar
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="secondary" to="/register" variant="flat">
              Cadastrar
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
};

export default Navigation;
