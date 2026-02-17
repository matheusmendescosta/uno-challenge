import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { env } from "@/src/lib/env"

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

export interface UpdateLeadInput {
  contactId?: string
  name?: string
  company?: string
  status?: LeadStatus
}

export interface PaginatedLeadsResponse {
  data: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LeadsQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: LeadStatus
}

async function fetchLeads(params: LeadsQueryParams = {}): Promise<PaginatedLeadsResponse> {
  const searchParams = new URLSearchParams()

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page))
  }
  if (params.limit) {
    searchParams.set("limit", String(params.limit))
  }
  if (params.search) {
    searchParams.set("search", params.search)
  }
  if (params.status) {
    searchParams.set("status", params.status)
  }

  const queryString = searchParams.toString()
  const url = `${env.API_URL}/leads${queryString ? `?${queryString}` : ""}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Erro ao buscar leads")
  }

  return response.json()
}

export function useLeads(params: LeadsQueryParams = {}) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => fetchLeads(params),
  })
}

async function fetchLead(id: string): Promise<Lead> {
  const response = await fetch(`${env.API_URL}/leads/${id}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar lead")
  }

  return response.json()
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => fetchLead(id),
    enabled: !!id,
  })
}

async function updateLead(id: string, data: UpdateLeadInput): Promise<Lead> {
  const response = await fetch(`${env.API_URL}/leads/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Erro ao atualizar lead")
  }

  return response.json()
}

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadInput }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      queryClient.invalidateQueries({ queryKey: ["stages"] })
    },
  })
}

async function deleteLead(id: string): Promise<void> {
  const response = await fetch(`${env.API_URL}/leads/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Erro ao deletar lead")
  }
}

export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      queryClient.invalidateQueries({ queryKey: ["stages"] })
    },
  })
}
