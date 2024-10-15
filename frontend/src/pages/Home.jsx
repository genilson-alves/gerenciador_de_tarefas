import { isAuthenticated } from "./../components/auth/isAuthenticated";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

const Home = () => {
  const authenticated = isAuthenticated();
  return (
    <div className="hero bg-base-200 flex items-center justify-center w-full h-full">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold"> Bem vindo!</h1>
          <p className="py-6">Aqui você pode gerenciar todas suas tarefas!</p>
          {authenticated && (
            <Button as={Link} color="secondary" to="/tasks" variant="flat">
              Acessar suas tarefas
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
