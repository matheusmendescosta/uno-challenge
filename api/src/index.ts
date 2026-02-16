import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "./env/index.js";
import { connectDB } from "./lib/db.js";
import { leadController } from "./http/controllers/lead-controller.js";
import { contactController } from "./http/controllers/contact-controller.js";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/leads", leadController);
app.route("/contacts", contactController);

// Conecta ao banco e inicia o servidor
connectDB().then(() => {
  serve(
    {
      fetch: app.fetch,
      port: env.API_PORT,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
});
