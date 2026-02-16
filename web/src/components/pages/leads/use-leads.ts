import { useQuery } from "@tanstack/react-query"

export enum LeadStatus {
  NOVO = "novo",
  CONTACTADO = "contactado",
  QUALIFICADO = "qualificado",
  CONVERTIDO = "convertido",
  PERDIDO = "perdido",
}

export interface Lead {
  id: string
  contactId: string
  name: string
  company: string
  status: LeadStatus
  contact?: {
    id: string
    name: string
    email: string
    phone: string
  }
}

async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch("http://localhost:3333/leads")

  if (!response.ok) {
    throw new Error("Erro ao buscar leads")
  }

  return response.json()
}

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  })
}
