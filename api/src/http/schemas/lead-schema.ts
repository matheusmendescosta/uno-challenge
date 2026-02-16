import { z } from "zod";

export enum LeadStatusEnum {
  NOVO = "novo",
  CONTACTADO = "contactado",
  QUALIFICADO = "qualificado",
  CONVERTIDO = "convertido",
  PERDIDO = "perdido",
}

export const createLeadSchema = z.object({
  contactId: z
    .string({ message: "O ID do contato é obrigatório" })
    .uuid("O ID do contato deve ser um UUID válido"),
  name: z
    .string({ message: "O nome é obrigatório" })
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  company: z
    .string({ message: "O nome da empresa é obrigatório" })
    .min(2, "A empresa deve ter no mínimo 2 caracteres")
    .max(255, "A empresa deve ter no máximo 255 caracteres"),
  status: z
    .enum(["novo", "contactado", "qualificado", "convertido", "perdido"], { message: "Status inválido" })
    .optional()
    .default("novo"),
  stageId: z
    .string()
    .uuid("O ID da etapa deve ser um UUID válido")
    .optional()
    .nullable(),
});

export const updateLeadSchema = z.object({
  contactId: z
    .string()
    .uuid("O ID do contato deve ser um UUID válido")
    .optional(),
  name: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .optional(),
  company: z
    .string()
    .min(2, "A empresa deve ter no mínimo 2 caracteres")
    .max(255, "A empresa deve ter no máximo 255 caracteres")
    .optional(),
  status: z
    .enum(["novo", "contactado", "qualificado", "convertido", "perdido"], { message: "Status inválido" })
    .optional(),
  stageId: z
    .string()
    .uuid("O ID da etapa deve ser um UUID válido")
    .optional()
    .nullable(),
});

export const leadQuerySchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(["novo", "contactado", "qualificado", "convertido", "perdido"], {
      message: "Status inválido",
    })
    .optional(),
  contactId: z.string().uuid("O ID do contato deve ser um UUID válido").optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, "Página deve ser maior que 0")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1, "Limite deve ser maior que 0").max(100, "Limite máximo é 100")),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
