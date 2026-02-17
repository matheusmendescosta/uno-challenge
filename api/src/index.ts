import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { env } from "./env/index.js";
import { connectDB } from "./lib/db.js";
import { leadController } from "./http/controllers/lead-controller.js";
import { contactController } from "./http/controllers/contact-controller.js";
import { funnelController } from "./http/controllers/funnel-controller.js";
import { stageController } from "./http/controllers/stage-controller.js";
import { cors } from "hono/cors";
import { wsManager } from "./lib/websocket.js";

const app = new Hono();

// Configura WebSocket
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Rota WebSocket para atualizações em tempo real
app.get(
  "/ws",
  upgradeWebSocket(() => ({
    onOpen: (_event, ws) => {
      wsManager.addConnection(ws);
      ws.send(
        JSON.stringify({
          type: "connected",
          payload: { message: "Conectado ao servidor WebSocket" },
          timestamp: new Date().toISOString(),
        }),
      );
    },
    onClose: (_event, ws) => {
      wsManager.removeConnection(ws);
    },
    onError: (_event, ws) => {
      wsManager.removeConnection(ws);
    },
  })),
);

// Rota para verificar status do WebSocket
app.get("/ws/status", (c) => {
  return c.json({
    connections: wsManager.getConnectionCount(),
    status: "active",
  });
});

app.route("/leads", leadController);
app.route("/contacts", contactController);
app.route("/funnels", funnelController);
app.route("/stages", stageController);

// Conecta ao banco e inicia o servidor
connectDB().then(() => {
  const server = serve(
    {
      fetch: app.fetch,
      port: env.API_PORT,
      hostname: "0.0.0.0",
    },
    (info) => {
      console.log(`Server is running on http://0.0.0.0:${info.port}`);
      console.log(`WebSocket available at ws://0.0.0.0:${info.port}/ws`);
    },
  );

  // Injeta WebSocket no servidor HTTP
  injectWebSocket(server);
});
