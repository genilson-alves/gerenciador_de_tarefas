const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.resolve(__dirname, "database.db"));

db.serialize(() => {
  // Criação da tabela usuários
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // Criação da tabela tarefas
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT,
    description TEXT,
    status TEXT CHECK(status IN ("pending", "in-progress", "completed")) DEFAULT "pending",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

  // Criação de um gatilho para atualizar o horário de atualização quando uma tarefa for atualizada.
  db.run(`CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp
      AFTER UPDATE ON tasks
      FOR EACH ROW
      BEGIN
        UPDATE tasks
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
      END`);
});

module.exports = db;
