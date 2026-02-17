import { Hono } from "hono";
import { StageService } from "../../service/stage-service.js";
import { LeadService } from "../../service/lead-service.js";
import { SequelizeStageRepository } from "../../repositories/sequelize/sequelize-stage.js";
import { SequelizeLeadRepository } from "../../repositories/sequelize/sequelize-lead.js";
import {
  createStageSchema,
  updateStageSchema,
  reorderStagesSchema,
  moveLeadToStageSchema,
} from "../schemas/stage-schema.js";
import { wsManager } from "../../lib/websocket.js";

const stageRepository = new SequelizeStageRepository();
const stageService = new StageService(stageRepository);

const leadRepository = new SequelizeLeadRepository();
const leadService = new LeadService(leadRepository);

export const stageController = new Hono();

// GET /stages - Listar todas as etapas de um funil
stageController.get("/", async (c) => {
  const funnelId = c.req.query("funnelId");

  if (!funnelId) {
    return c.json({ error: "O parâmetro funnelId é obrigatório" }, 400);
  }

  const stages = await stageService.findByFunnelId(funnelId);
  return c.json(stages);
});

// GET /stages/:id - Buscar etapa por ID
stageController.get("/:id", async (c) => {
  const id = c.req.param("id");
  const stage = await stageService.findByIdWithLeads(id);

  if (!stage) {
    return c.json({ error: "Etapa não encontrada" }, 404);
  }

  return c.json(stage);
});

// POST /stages - Criar nova etapa
stageController.post("/", async (c) => {
  const body = await c.req.json();
  const result = createStageSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const stage = await stageService.create(result.data);

    // Emite evento WebSocket
    wsManager.emitStageCreated(stage.id, stage.funnelId);

    return c.json(stage, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar etapa";
    return c.json({ error: message }, 500);
  }
});

// PUT /stages/:id - Atualizar etapa
stageController.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = updateStageSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const stage = await stageService.update(id, result.data);

    if (!stage) {
      return c.json({ error: "Etapa não encontrada" }, 404);
    }

    // Emite evento WebSocket
    wsManager.emitStageUpdated(stage.id, stage.funnelId);

    return c.json(stage);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar etapa";
    return c.json({ error: message }, 500);
  }
});

// DELETE /stages/:id - Deletar etapa
stageController.delete("/:id", async (c) => {
  const id = c.req.param("id");

  // Busca a etapa antes de deletar para obter o funnelId
  const stageToDelete = await stageService.findById(id);
  if (!stageToDelete) {
    return c.json({ error: "Etapa não encontrada" }, 404);
  }

  const deleted = await stageService.delete(id);

  if (!deleted) {
    return c.json({ error: "Erro ao deletar etapa" }, 500);
  }

  // Emite evento WebSocket
  wsManager.emitStageDeleted(id, stageToDelete.funnelId);

  return c.json({ message: "Etapa deletada com sucesso" });
});

// POST /stages/reorder - Reordenar etapas de um funil
stageController.post("/reorder", async (c) => {
  const body = await c.req.json();
  const funnelId = c.req.query("funnelId");

  if (!funnelId) {
    return c.json({ error: "O parâmetro funnelId é obrigatório" }, 400);
  }

  const result = reorderStagesSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const success = await stageService.reorder(funnelId, result.data.stageIds);
    
    if (!success) {
      return c.json({ error: "Erro ao reordenar etapas" }, 500);
    }

    return c.json({ message: "Etapas reordenadas com sucesso" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao reordenar etapas";
    return c.json({ error: message }, 500);
  }
});

// POST /stages/move-lead - Mover lead para uma etapa
stageController.post("/move-lead", async (c) => {
  const body = await c.req.json();
  const result = moveLeadToStageSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const { leadId, stageId } = result.data;

    // Busca o lead atual para obter o stageId anterior
    const currentLead = await leadService.findById(leadId);
    const fromStageId = currentLead?.stageId ?? null;

    // Busca o stage de destino para obter o funnelId
    let funnelId: string | undefined;
    if (stageId) {
      const stage = await stageService.findById(stageId);
      if (!stage) {
        return c.json({ error: "Etapa não encontrada" }, 404);
      }
      funnelId = stage.funnelId;
    }

    const lead = await leadService.update(leadId, { stageId });

    if (!lead) {
      return c.json({ error: "Lead não encontrado" }, 404);
    }

    // Emite evento WebSocket para atualização em tempo real
    wsManager.emitLeadMoved({
      leadId,
      fromStageId,
      toStageId: stageId,
      funnelId,
    });

    return c.json(lead);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao mover lead";
    return c.json({ error: message }, 500);
  }
});
