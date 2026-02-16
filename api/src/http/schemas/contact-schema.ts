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

export const contactQuerySchema = z.object({
  search: z.string().optional(),
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

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactQueryInput = z.infer<typeof contactQuerySchema>;
