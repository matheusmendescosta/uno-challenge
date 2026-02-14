import { Hono } from "hono";
import { LeadService } from "../../service/lead-service.js";
import { SequelizeLeadRepository } from "../../repositories/sequelize/sequelize-lead.js";
import type { LeadStatusType } from "../../repositories/repository-lead.js";
import { createLeadSchema, updateLeadSchema } from "../schemas/lead-schema.js";

const leadRepository = new SequelizeLeadRepository();
const leadService = new LeadService(leadRepository);

export const leadController = new Hono();

// GET /leads - Listar todos os leads
leadController.get("/", async (c) => {
  const status = c.req.query("status") as LeadStatusType | undefined;
  const contactId = c.req.query("contactId");

  if (status) {
    const leads = await leadService.findByStatus(status);
    return c.json(leads);
  }

  if (contactId) {
    const leads = await leadService.findByContactId(contactId);
    return c.json(leads);
  }

  const leads = await leadService.findAll();
  return c.json(leads);
});

// GET /leads/:id - Buscar lead por ID
leadController.get("/:id", async (c) => {
  const id = c.req.param("id");
  const lead = await leadService.findById(id);

  if (!lead) {
    return c.json({ error: "Lead não encontrado" }, 404);
  }

  return c.json(lead);
});

// POST /leads - Criar novo lead
leadController.post("/", async (c) => {
  const body = await c.req.json();
  const result = createLeadSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const lead = await leadService.create(result.data);
    return c.json(lead, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar lead";
    return c.json({ error: message }, 500);
  }
});

// PUT /leads/:id - Atualizar lead
leadController.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = updateLeadSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const lead = await leadService.update(id, result.data);

    if (!lead) {
      return c.json({ error: "Lead não encontrado" }, 404);
    }

    return c.json(lead);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar lead";
    return c.json({ error: message }, 500);
  }
});

// DELETE /leads/:id - Deletar lead
leadController.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deleted = await leadService.delete(id);

  if (!deleted) {
    return c.json({ error: "Lead não encontrado" }, 404);
  }

  return c.json({ message: "Lead deletado com sucesso" });
});
