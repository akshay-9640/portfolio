import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { answer } from "./server/chatHandler";

// Serves /api/chat in `npm run dev` so the chatbot works locally with a key in .env.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      {
        name: "dev-chat-api",
        configureServer(server) {
          server.middlewares.use("/api/chat", (req, res) => {
            let raw = "";
            req.on("data", (c) => (raw += c));
            req.on("end", async () => {
              let body = {};
              try { body = JSON.parse(raw); } catch { /* empty */ }
              const out = await answer(body, "dev", env.ANTHROPIC_API_KEY);
              res.statusCode = out.status;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify(out.json));
            });
          });
        },
      },
    ],
  };
});
