import { useQuery } from "@tanstack/react-query"

export interface Stage {
  id: string
  funnelId: string
  name: string
  order: number
  color: string | null
  createdAt: string
  updatedAt: string
}

export interface Funnel {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  stages?: Stage[]
}

async function fetchFunnels(): Promise<Funnel[]> {
  const response = await fetch("http://localhost:3333/funnels")

  if (!response.ok) {
    throw new Error("Erro ao buscar funis")
  }

  return response.json()
}

async function fetchFunnelById(id: string): Promise<Funnel> {
  const response = await fetch(`http://localhost:3333/funnels/${id}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar funil")
  }

  return response.json()
}

export function useFunnels() {
  return useQuery({
    queryKey: ["funnels"],
    queryFn: fetchFunnels,
  })
}

export function useFunnel(id: string) {
  return useQuery({
    queryKey: ["funnels", id],
    queryFn: () => fetchFunnelById(id),
    enabled: !!id,
  })
}
