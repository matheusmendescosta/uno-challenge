import { useQuery } from "@tanstack/react-query"

export interface Contact {
  id: string
  name: string
  phone: string
  email: string
}

async function fetchContacts(): Promise<Contact[]> {
  const response = await fetch("http://localhost:3333/contacts")
  
  if (!response.ok) {
    throw new Error("Erro ao buscar contatos")
  }
  
  return response.json()
}

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  })
}
