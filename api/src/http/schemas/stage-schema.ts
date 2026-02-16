import { z } from "zod";

export const createStageSchema = z.object({
  funnelId: z
    .string({ message: "O ID do funil é obrigatório" })
    .uuid("O ID do funil deve ser um UUID válido"),
  name: z
    .string({ message: "O nome da etapa é obrigatório" })
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  order: z
    .number()
    .int("A ordem deve ser um número inteiro")
    .min(0, "A ordem deve ser maior ou igual a 0")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve ser um código hexadecimal válido (ex: #3B82F6)")
    .optional(),
});

export const updateStageSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .optional(),
  order: z
    .number()
    .int("A ordem deve ser um número inteiro")
    .min(0, "A ordem deve ser maior ou igual a 0")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve ser um código hexadecimal válido (ex: #3B82F6)")
    .optional(),
});

export const reorderStagesSchema = z.object({
  stageIds: z
    .array(z.string().uuid("Cada ID deve ser um UUID válido"))
    .min(1, "A lista de IDs deve ter pelo menos 1 elemento"),
});

export const moveLeadToStageSchema = z.object({
  leadId: z
    .string({ message: "O ID do lead é obrigatório" })
    .uuid("O ID do lead deve ser um UUID válido"),
  stageId: z
    .string()
    .uuid("O ID da etapa deve ser um UUID válido")
    .nullable(),
});

export type CreateStageInput = z.infer<typeof createStageSchema>;
export type UpdateStageInput = z.infer<typeof updateStageSchema>;
export type ReorderStagesInput = z.infer<typeof reorderStagesSchema>;
export type MoveLeadToStageInput = z.infer<typeof moveLeadToStageSchema>;
