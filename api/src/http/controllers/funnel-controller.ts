import { Hono } from "hono";
import { FunnelService } from "../../service/funnel-service.js";
import { SequelizeFunnelRepository } from "../../repositories/sequelize/sequelize-funnel.js";
import { createFunnelSchema, updateFunnelSchema } from "../schemas/funnel-schema.js";

const funnelRepository = new SequelizeFunnelRepository();
const funnelService = new FunnelService(funnelRepository);

export const funnelController = new Hono();

// GET /funnels - Listar todos os funis
funnelController.get("/", async (c) => {
  const funnels = await funnelService.findAll();
  return c.json(funnels);
});

// GET /funnels/:id - Buscar funil por ID
funnelController.get("/:id", async (c) => {
  const id = c.req.param("id");
  const funnel = await funnelService.findByIdWithStages(id);

  if (!funnel) {
    return c.json({ error: "Funil não encontrado" }, 404);
  }

  return c.json(funnel);
});

// POST /funnels - Criar novo funil
funnelController.post("/", async (c) => {
  const body = await c.req.json();
  const result = createFunnelSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const funnel = await funnelService.create(result.data);
    return c.json(funnel, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar funil";
    return c.json({ error: message }, 500);
  }
});

// PUT /funnels/:id - Atualizar funil
funnelController.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = updateFunnelSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const funnel = await funnelService.update(id, result.data);

    if (!funnel) {
      return c.json({ error: "Funil não encontrado" }, 404);
    }

    return c.json(funnel);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar funil";
    return c.json({ error: message }, 500);
  }
});

// DELETE /funnels/:id - Deletar funil
funnelController.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deleted = await funnelService.delete(id);

  if (!deleted) {
    return c.json({ error: "Funil não encontrado" }, 404);
  }

  return c.json({ message: "Funil deletado com sucesso" });
});
