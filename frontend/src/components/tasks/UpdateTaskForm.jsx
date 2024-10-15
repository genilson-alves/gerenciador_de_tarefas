import { useState, useEffect } from "react";
import axios from "axios";

const UpdateTaskForm = ({ task, onUpdate, onCancel }) => {
  // Armazenamento dos estados
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending"); // default status
  const token = localStorage.getItem("token");

  // Hook para atualizar o formulário quando a tarefa a ser editada mudar
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task]);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    try {
      // Faz uma solicitação PUT para atualizar a tarefa junto com as informações necessárias
      await axios.put(
        `http://localhost:${
          import.meta.env.VITE_BACKEND_PORT || 5000
        }/api/tasks/${task.id}`,
        { title, description, status },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Cabeçalho de autorização com o token
          },
        }
      );
      // Chama a função onUpdate para notificar que a tarefa foi atualizada
      onUpdate();
    } catch (error) {
      // Registra o erro no console em caso de falha
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="bg-black p-10 my-5 rounded-lg shadow">
      <p className="mb-3 text-white">Atualizar sua tarefa</p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            required
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
            required
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
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="inline-block w-full rounded-lg bg-white px-5 py-3 font-medium text-black sm:w-auto hover:opacity-95"
          >
            Atualizar
          </button>
          <button
            type="submit"
            onClick={onCancel}
            className="inline-block w-full rounded-lg bg-white px-5 py-3 font-medium text-black sm:w-auto hover:opacity-95"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTaskForm;
