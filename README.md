# Gerenciador de Tarefas

Bem-vindo! Este projeto é dividido em duas partes principais: o frontend e o backend. O frontend foi desenvolvido com Vite e React, enquanto o backend utiliza Node.js e SQLite. Siga as instruções abaixo para configurar e rodar o aplicativo localmente.

## Estrutura do Repositório

- `frontend/` - Contém o código-fonte do frontend.
- `backend/` - Contém o código-fonte do backend.

## Configuração do Frontend

1. **Navegue até a pasta do frontend:**

   ```bash
   cd frontend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`:**

   Crie um arquivo `.env` na pasta `frontend` com o seguinte conteúdo.

   ```bash
   VITE_BACKEND_PORT=3000 
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   O frontend estará disponível em http://localhost:5173 por padrão.

## Configuração do Backend


1. **Navegue até a pasta do backend:**

   ```bash
   cd backend

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`:**

   Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo.

   ```bash
   JWT_SECRET="<o segredo que você escolher>"
   ```
   ```bash
   PORT=3000
   ```

4. **Inicie o servidor`:**

   ```bash
   node server.js
   ```
   
   O backend estará disponível em http://localhost:3000 por padrão.

## Notas Adicionais

- Certifique-se de que o frontend e o backend estão rodando nas portas especificadas para garantir a comunicação correta entre eles.
- As rotas do frontend estão configuradas para se comunicar com o backend usando a variável `VITE_BACKEND_PORT` definida no `.env` do frontend.
