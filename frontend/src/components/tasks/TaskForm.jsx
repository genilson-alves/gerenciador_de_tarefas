import { useState } from "react";
import axios from "axios";

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    const token = localStorage.getItem("token"); // Obtém o token de autenticação do localStorage
    try {
      // Envia uma solicitação POST para o endpoint de tarefas junto com a informações necessárias
      await axios.post(
        `http://localhost:${
          import.meta.env.VITE_BACKEND_PORT || 5000
        }/api/tasks`,
        { title, description, status },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Cabeçalho de autorização com o token
          },
        }
      );
      // Limpa os campos do formulário
      setTitle("");
      setDescription("");
      setStatus("pending");
      // Notifica o componente pai para atualizar a lista de tarefas
      onTaskCreated();
    } catch (error) {
      // Registra o erro no console em caso de alguma falha
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="bg-black p-10 my-5 rounded-lg">
      <p className="mb-3 text-white">Crie uma nova tarefa abaixo</p>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div>
          <label className="sr-only " htmlFor="name">
            Título
          </label>
          <input
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            placeholder="Título"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="name"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="message">
            Descri&ccedil;&atilde;o
          </label>
          <textarea
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            placeholder="Descrição"
            rows="8"
            id="message"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-white"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="pending">Pendente</option>
            <option value="in-progress">Em progresso</option>
            <option value="completed">Completo</option>
          </select>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-block w-full rounded-lg bg-white px-5 py-3 font-medium text-black sm:w-auto"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
