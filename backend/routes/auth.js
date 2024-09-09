const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const router = express.Router();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET; // Segredo para assinar o token JWT
const saltRounds = 10;

// Rota para registar um novo usuário
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Verifica se o campo de e-mail e senha foram fornecidos
  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são requiridos." });
  }

  try {
    // Hash da senha utilizando bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Consulta para verificar se o e-mail já está registrado no banco de dados
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error("Erro ao executar a consulta ao banco de dados:", err);
          return res
            .status(500)
            .json({ message: "Erro ao executar a consulta." });
        }

        if (user) {
          // Se o e-mail já estiver registrado é retornado um erro com uma mensagem de já registrado
          return res.status(400).json({ message: "E-mail já registrado." });
        }

        // Se o e-mail ainda não existe, é registrado um novo usuário
        db.run(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hashedPassword],
          (err) => {
            if (err) {
              console.error("Erro ao inserir o usuário:", err);
              return res
                .status(500)
                .json({ message: "Erro ao registrar o usuário." });
            }
            res
              .status(201)
              .json({ message: "Usuário registrado com sucesso." });
          }
        );
      }
    );
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ message: "Erro ao registrar o usuário." });
  }
});

// Rota para o login do usuário
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Verifica se o e-mail e senha foram fornecidos
  if (!email || !password) {
    return res.status(400).json({ message: "E-mail e senha são requiridos." });
  }

  try {
    // Recupera o usuário com base no e-mail fornecido
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error("Erro durante a consulta ao banco de dados:", err);
          return res
            .status(500)
            .json({ message: "Erro ao executar a consulta." });
        }

        if (!user) {
          // Usuário não encontrado
          return res.status(401).json({ message: "Usuário inválido." });
        }

        try {
          // Compara a senha fornecida pelo usuário com a senha armazenada
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            // Senha incorreta informada pelo usuário
            return res.status(401).json({ message: "Senha inválida." });
          }

          // Gera um token JWT para o usuário
          const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            {
              expiresIn: "1h", // Token expira em um 1 hora
            }
          );

          res.json({ token });
        } catch (compareError) {
          console.error("Erro ao comparar as senhas:", compareError);
          res
            .status(500)
            .json({ message: "Erro durante a comparação de senhas." });
        }
      }
    );
  } catch (err) {
    console.error("Erro durante ao login:", err);
    res.status(500).json({ message: "Erro ao realizar o login." });
  }
});

module.exports = router;
