import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface Contact {
  id: string
  name: string
  phone: string
  email: string
}

export interface UpdateContactInput {
  name?: string
  phone?: string
  email?: string
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

async function fetchContact(id: string): Promise<Contact> {
  const response = await fetch(`http://localhost:3333/contacts/${id}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar contato")
  }

  return response.json()
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: () => fetchContact(id),
    enabled: !!id,
  })
}

async function updateContact(id: string, data: UpdateContactInput): Promise<Contact> {
  const response = await fetch(`http://localhost:3333/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Erro ao atualizar contato")
  }

  return response.json()
}

export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactInput }) =>
      updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
    },
  })
}

async function deleteContact(id: string): Promise<void> {
  const response = await fetch(`http://localhost:3333/contacts/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Erro ao deletar contato")
  }
}

export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
    },
  })
}
