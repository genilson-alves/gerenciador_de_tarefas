// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware
app.use(cors()); // Habilita o CORS para permitir requisições de outros domínios
app.use(helmet()); // Adiciona cabeçalhos de segurança para proteger contra vulnerabilidades
app.use(morgan("combined")); // Registra as requisições no console para monitoramento
app.use(express.json()); // Faz o parsing dos corpos das requisições em formato JSON

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Rotas
app.use("/auth", authRoutes); // Define a rota base para as rotas de autenticação
app.use("/api", taskRoutes); // Define as rotas para as tarefas

// Servidor
const PORT = process.env.PORT || 5000; // Define a porta a partir das variáveis de ambiente ou utiliza a porta 5000
app.listen(PORT, () => console.log(`Servidor aberto na porta ${PORT}...`)); // Inicia o servidor e mostra um mensagem no console
