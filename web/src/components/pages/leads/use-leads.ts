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
  const url = `http://localhost:3333/leads${queryString ? `?${queryString}` : ""}`

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
