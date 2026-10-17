# MeshAI

MeshAI is a full-stack AI assistant that lets users upload documents to a knowledge base and ask questions about them through a chat interface. It uses retrieval-augmented generation (RAG), MongoDB, and the Nebius AI API.

**Live:** <https://lennysmeshai.happyminecraft.org>

## Tech stack

- React
- TypeScript
- Express
- MongoDB
- Docker
- Caddy
- AWS EC2
- GitHub Actions

## Getting started

### Prerequisites

- Node.js 20 or later
- Docker with Docker Compose
- A Nebius API key for AI-powered document queries

### Local development

1. Clone the repository and enter it:

   ```bash
   git clone https://github.com/lennymccaslin/ai-se_project_mesh-ai.git
   cd ai-se_project_mesh-ai
   ```

2. Create your local environment file and set `JWT_SECRET` and `NEBIUS_API_KEY`:

   ```bash
   cp .env.example .env
   ```

3. For running the backend on your host, set `MONGO_URI` in `.env` to `mongodb://localhost:27017/meshai`. The example file uses the Compose service hostname `mongo`, which only resolves from containers.

4. Start MongoDB and install the project dependencies:

   ```bash
   docker compose up -d mongo
   npm run install:all
   ```

5. Start the frontend and backend in development mode:

   ```bash
   npm run dev
   ```

The Vite development server is available at <http://localhost:5173> and the API defaults to port `3000`.

### Run the full stack with Docker

For the backend container, set `MONGO_URI=mongodb://mongo:27017/meshai` in `.env`. Set `SITE_ADDRESS=localhost` for local Caddy testing, or use your public domain for production. Then start the stack:

```bash
docker compose up --build
```

## Environment variables

| Variable         | Description                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGO_URI`      | MongoDB connection URI. Use `mongodb://localhost:27017/meshai` when the backend runs on your host, or `mongodb://mongo:27017/meshai` when it runs in Compose. |
| `JWT_SECRET`     | Secret used to sign authentication tokens. Use a long, random value and keep it private.                                                                      |
| `NEBIUS_API_KEY` | API key for the Nebius AI service used for embeddings and chat responses.                                                                                     |
| `NODE_ENV`       | Runtime mode. The development script sets `development`; Compose sets `production`.                                                                           |
| `PORT`           | Optional backend listening port; defaults to `3000`.                                                                                                          |
| `SITE_ADDRESS`   | Hostname Caddy serves and obtains TLS for. Use your public domain in production; used by the Compose deployment.                                              |
