import axios from "axios";
import moment from "moment-timezone";

const TaskList = ({ tasks, onTaskDeleted, onEdit }) => {
  // Obtém o token de autenticação do localStorage
  const token = localStorage.getItem("token");

  // Formata a data de criação da tarefa
  const formatCreatedAt = (utcTimestamp) => {
    // Converte o timestamp UTC para o fuso horário de São Paulo
    const createdDate = moment.utc(utcTimestamp).tz("America/Sao_Paulo");
    const now = moment().tz("America/Sao_Paulo");

    if (createdDate.isSame(now, "day")) {
      // Mostra o horário de criação caso a tarefa tenha sido criada hoje
      return `Criado às ${createdDate.format("HH:mm")}`;
    } else if (createdDate.isSame(now.subtract(1, "day"), "day")) {
      // Mostra criado ontem junto com o horário caso a tarefa tenha sido criada ontem
      return `Criado ontem às ${createdDate.format("HH:mm")}`;
    } else {
      // Mostra o dia de criação caso a tarefa tenha sido criada em algum outro dia
      return `Criado dia ${createdDate.format("dddd, MMMM D")}`;
    }
  };

  // Formata a data de atualização da tarefa
  const formatUpdatedAt = (utcTimestamp) => {
    // Converte o timestamp UTC para o fuso horário de São Paulo
    const updatedDate = moment.utc(utcTimestamp).tz("America/Sao_Paulo");
    const now = moment().tz("America/Sao_Paulo");

    if (updatedDate.isSame(now, "day")) {
      // Mostra apenas o horário da criação caso a tarefa tenha sido atualizada hoje
      return `* Atualizado às ${updatedDate.format("HH:mm")}`;
    } else if (updatedDate.isSame(now.subtract(1, "day"), "day")) {
      // Mostra atualizado ontem junto com o horário caso a tarefa tenha sido atualizada ontem
      return `* Atualizado ontem às ${updatedDate.format("HH:mm")}`;
    } else {
      // Mostra o dia da última atualização caso a tarefa tenha sido atualizada em algum outro dia
      return `* Atualizado dia ${updatedDate.format("dddd, MMMM D")}`;
    }
  };

  // Converte o status da tarefa para um formato legível
  const statusUpdate = (status) => {
    if (status === "pending") {
      return "Pendente";
    }
    if (status === "in-progress") {
      return "Em Progresso";
    }
    if (status === "completed") {
      return "Finalizado";
    }
  };

  // Retorna uma cor para atualizar o background das tarefas com Tailwind
  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100"; // Verde para completas
      case "in-progress":
        return "bg-violet-100"; // Roxa para as que estão em progresso
      case "pending":
        return "bg-amber-100"; // E amarelo para as pendentes
      default:
        return "";
    }
  };

  // Função para lidar com a exclusão
  const handleDelete = async (taskId) => {
    try {
      // Envia uma solicitação DELETE para o endpoint de tarefas junto com as informações necessárias
      await axios.delete(
        `http://localhost:${
          import.meta.env.VITE_BACKEND_PORT || 5000
        }/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Cabeçalho de autorização com o token
          },
        }
      );
      // Notifica o componente pai que a tarefa foi excluída
      onTaskDeleted(taskId);
    } catch (error) {
      // Registra o erro no console em caso de alguma falha
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <ul className="bg-white rounded-lg divide-y divide-gray-200 w-full mb-5 flex flex-col gap-1">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`px-6 py-4 rounded-lg ${getStatusClass(task.status)}`}
          >
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-lg flex-1 min-w-0 break-words">
                    {task.title}
                  </span>
                  <span className="text italic text-xs ml-2 whitespace-nowrap">
                    {formatCreatedAt(task.created_at)}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mt-2 break-words">
                {task.description}
              </p>
              <p>Status: {statusUpdate(task.status)}</p>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="hover:underline"
                  >
                    Excluir
                  </button>
                </div>
                {task.updated_at !== task.created_at && (
                  <p className="italic text-xs">
                    {formatUpdatedAt(task.updated_at)}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
