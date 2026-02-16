import { useQuery } from "@tanstack/react-query"

export interface Contact {
  id: string
  name: string
  phone: string
  email: string
}

export interface PaginatedContactsResponse {
  data: Contact[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ContactsQueryParams {
  page?: number
  limit?: number
  search?: string
}

async function fetchContacts(params: ContactsQueryParams = {}): Promise<PaginatedContactsResponse> {
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

  const queryString = searchParams.toString()
  const url = `http://localhost:3333/contacts${queryString ? `?${queryString}` : ""}`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error("Erro ao buscar contatos")
  }
  
  return response.json()
}

export function useContacts(params: ContactsQueryParams = {}) {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: () => fetchContacts(params),
  })
}
