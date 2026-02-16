import { z } from "zod";

export const createFunnelSchema = z.object({
  name: z
    .string({ message: "O nome do funil é obrigatório" })
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres")
    .optional()
    .nullable(),
});

export const updateFunnelSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .optional(),
  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres")
    .optional()
    .nullable(),
});

export type CreateFunnelInput = z.infer<typeof createFunnelSchema>;
export type UpdateFunnelInput = z.infer<typeof updateFunnelSchema>;
