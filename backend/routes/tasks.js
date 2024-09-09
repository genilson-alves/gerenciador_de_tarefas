const express = require("express");
const db = require("../db/database");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Rota para a criação de uma nova tarefa
router.post("/tasks", authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const user_id = req.user.id;

  // Verifica se um título foi fornecido pelo usuário
  if (!title) {
    return res
      .status(400)
      .json({ message: "Por favor, adicione um título para tarefa." });
  }

  try {
    // Inserção de uma nova tarefa no banco de dados
    const result = await db.run(
      "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      [user_id, title, description, status]
    );
    // Retorna o sucesso da tentativa junto com ID da nova tarefa
    res
      .status(201)
      .json({ id: result.lastID, message: "Tarefa criada com sucesso." });
  } catch (err) {
    // Retorna erro caso aconteça algum erro durante a criação da tarefa
    res.status(500).json({ message: "Erro ao tentar criar a tarefa." });
  }
});

// Rota para a edição de uma tarefa existente
router.put("/tasks/:id", authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const { id } = req.params;
  const user_id = req.user.id;

  // Verifica se pelo menos um dado para atualizar a tarefa foi fornecido
  if (!title && !description && !status) {
    return res
      .status(400)
      .json({ message: "Nenhum dado para atualizar fornecido." });
  }

  // Adição das partes da consulta SQL de acordo com os dados fornecidos pelo usuário
  const updates = [];
  const values = [];

  if (title) {
    updates.push("title = ?");
    values.push(title);
  }

  if (description) {
    updates.push("description = ?");
    values.push(description);
  }

  if (status) {
    updates.push("status = ?");
    values.push(status);
  }

  const sql = `UPDATE tasks SET ${updates.join(
    ", "
  )} WHERE id = ? AND user_id = ?`;

  try {
    // Realização da atualização da tarefa no banco de dados
    const result = await db.run(sql, [...values, id, user_id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }
    res.json({ message: "Tarefa atualizada com sucesso." });
  } catch (err) {
    // Retorna erro caso ocorra algum erro durante a atualização
    res.status(500).json({ message: "Erro ao tentar atualizar a tarefa." });
  }
});

// Rota para exclusão de uma tarefa
router.delete("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Exclui a tarefa de acordo com o ID dela fornecido pelo front-end
    const result = await db.run(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, user_id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }
    res.json({ message: "Tarefa excluída com sucesso." });
  } catch (err) {
    // Retorna erro caso ocorra algum problema durante a exclusão
    res.status(500).json({ message: "Erro ao tentar excluir a tarefa." });
  }
});

// Rota para a recuperar todas as tarefas do usuário no banco de dados
router.get("/tasks", authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  try {
    // Recupera todas as tarefas no banco de dados do usuário logado
    db.all("SELECT * FROM tasks WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) {
        res.status(500).json({ message: "Erro ao tentar recuperar tarefas." });
      } else {
        res.json(rows);
      }
    });
  } catch (err) {
    // Retorna erro caso ocorra alguma problema durante a recuperação das tarefas
    res.status(500).json({ message: "Erro ao tentar recuperar tarefas." });
  }
});

module.exports = router;
