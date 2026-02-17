import { useMutation, useQueryClient } from "@tanstack/react-query"
import { env } from "@/src/lib/env"

export enum LeadStatus {
  NOVO = "novo",
  CONTACTADO = "contactado",
  QUALIFICADO = "qualificado",
  CONVERTIDO = "convertido",
  PERDIDO = "perdido",
}

export interface CreateLeadInput {
  contactId: string
  name: string
  company: string
  status: LeadStatus
}

export interface Lead {
  id: string
  contactId: string
  name: string
  company: string
  status: LeadStatus
}

async function createLead(data: CreateLeadInput): Promise<Lead> {
  const response = await fetch(`${env.API_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Erro ao criar lead")
  }

  return response.json()
}

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })
}
