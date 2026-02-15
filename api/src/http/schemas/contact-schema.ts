import { z } from "zod";

export const createContactSchema = z.object({
  name: z
    .string({ message: "O nome é obrigatório" })
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  email: z
    .string({ message: "O email é obrigatório" })
    .email("Formato de email inválido"),
  phone: z
    .string({ message: "O telefone é obrigatório" })
    .min(1, "O telefone não pode ser vazio"),
});

export const updateContactSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .optional(),
  email: z
    .string()
    .email("Formato de email inválido")
    .optional(),
  phone: z
    .string()
    .min(1, "O telefone não pode ser vazio")
    .optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
