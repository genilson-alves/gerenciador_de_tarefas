const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET; // Segredo para verificar o token JWT

// Middleware para autenticar os tokens JWT

const authenticateToken = (req, res, next) => {
  // Obtém o cabeçalho de atualização da solicitação
  const authHeader = req.headers["authorization"];
  // Extrai o token do cabeçalho
  const token = authHeader && authHeader.split(" ")[1];
  // Se o token não estiver presente no cabeçalho, retorna o erro 401 (não autorizado)
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  // Verifica a validade do token utilizando o segredo
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Se o token for inválido, retorna o erro 403 (proibido)
      return res.status(403).json({ message: "Token inválido." });
    }
    // Se o token for válido, adicionado o usuário ao objeto de solicitação
    req.user = user;
    // Passa o próximo middleware
    next();
  });
};

module.exports = authenticateToken;
