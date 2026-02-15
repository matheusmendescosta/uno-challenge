import { Hono } from "hono";
import { ContactService } from "../../service/contact-service.js";
import { SequelizeContactRepository } from "../../repositories/sequelize/sequelize-contact.js";
import { createContactSchema, updateContactSchema } from "../schemas/contact-schema.js";

const contactRepository = new SequelizeContactRepository();
const contactService = new ContactService(contactRepository);

export const contactController = new Hono();

// GET /contacts - Listar todos os contatos
contactController.get("/", async (c) => {
  const contacts = await contactService.findAll();
  return c.json(contacts);
});

// GET /contacts/:id - Buscar contato por ID
contactController.get("/:id", async (c) => {
  const id = c.req.param("id");
  const contact = await contactService.findById(id);

  if (!contact) {
    return c.json({ error: "Contato não encontrado" }, 404);
  }

  return c.json(contact);
});

// GET /contacts/email/:email - Buscar contato por email
contactController.get("/email/:email", async (c) => {
  const email = c.req.param("email");
  const contact = await contactService.findByEmail(email);

  if (!contact) {
    return c.json({ error: "Contato não encontrado" }, 404);
  }

  return c.json(contact);
});

// POST /contacts - Criar novo contato
contactController.post("/", async (c) => {
  const body = await c.req.json();
  const result = createContactSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const contact = await contactService.create(result.data);
    return c.json(contact, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar contato";
    return c.json({ error: message }, 400);
  }
});

// PUT /contacts/:id - Atualizar contato
contactController.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = updateContactSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return c.json({ errors }, 400);
  }

  try {
    const contact = await contactService.update(id, result.data);

    if (!contact) {
      return c.json({ error: "Contato não encontrado" }, 404);
    }

    return c.json(contact);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar contato";
    return c.json({ error: message }, 400);
  }
});

// DELETE /contacts/:id - Deletar contato
contactController.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const deleted = await contactService.delete(id);

  if (!deleted) {
    return c.json({ error: "Contato não encontrado" }, 404);
  }

  return c.json({ message: "Contato deletado com sucesso" });
});
