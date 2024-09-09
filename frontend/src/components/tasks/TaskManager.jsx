import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import UpdateTaskForm from "./UpdateTaskForm";

const TaskManager = () => {
  // Armazenamento dos estados
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token");

  // Função para buscar tarefas do backend
  const fetchTasks = async () => {
    // Solicitação GET para o endpoint de tarefas junto com as informações necessárias
    try {
      const response = await axios.get(
        `http://localhost:${
          import.meta.env.VITE_BACKEND_PORT || 5000
        }/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Cabeçalho de autorização com o token
          },
        }
      );
      // Atualiza o estado com a lista de tarefas recebida
      setTasks(response.data);
    } catch (error) {
      console.error("Erro buscando tarefas:", error);
    }
  };

  // Hook para buscar tarefas quando o componente é montado ou o token muda
  useEffect(() => {
    fetchTasks();
  }, [token]);

  // Função chamada quando uma nova tarefa é criada
  const handleTaskCreated = () => {
    fetchTasks(); // Atualiza a lista de tarefas
  };

  // Função chamada quando uma tarefa é excluída
  const handleTaskDeleted = (taskId) => {
    // Filtra a lista de tarefas para remover a tarefa excluída
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Função chamada quando uma tarefa é atualizada
  const handleTaskUpdated = () => {
    setEditingTask(null); // Limpa o estado de edição
    fetchTasks(); // Atualiza a lista de tarefas
  };

  return (
    <div>
      {editingTask ? (
        <UpdateTaskForm
          task={editingTask}
          onUpdate={handleTaskUpdated}
          onCancel={() => setEditingTask(null)}
        />
      ) : (
        <>
          <TaskForm onTaskCreated={handleTaskCreated} />
          <TaskList
            tasks={tasks}
            onTaskDeleted={handleTaskDeleted}
            onEdit={(task) => setEditingTask(task)}
          />
        </>
      )}
    </div>
  );
};

export default TaskManager;
