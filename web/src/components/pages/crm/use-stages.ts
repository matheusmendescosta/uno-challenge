import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { env } from "@/src/lib/env"

export interface LeadInStage {
  id: string
  name: string
  company: string
  status: string
}

export interface StageWithLeads {
  id: string
  funnelId: string
  name: string
  order: number
  color: string | null
  createdAt: string
  updatedAt: string
  leads?: LeadInStage[]
}

export interface CreateStageInput {
  funnelId: string
  name: string
  order?: number
  color?: string
}

async function fetchStageWithLeads(stageId: string): Promise<StageWithLeads> {
  const response = await fetch(`${env.API_URL}/stages/${stageId}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar etapa")
  }

  return response.json()
}

async function fetchStagesByFunnel(funnelId: string): Promise<StageWithLeads[]> {
  const response = await fetch(`${env.API_URL}/stages?funnelId=${funnelId}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar etapas")
  }

  return response.json()
}

async function createStage(data: CreateStageInput): Promise<StageWithLeads> {
  const response = await fetch(`${env.API_URL}/stages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Erro ao criar etapa")
  }

  return response.json()
}

async function moveLeadToStage(leadId: string, stageId: string | null): Promise<void> {
  const response = await fetch(`${env.API_URL}/stages/move-lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ leadId, stageId }),
  })

  if (!response.ok) {
    throw new Error("Erro ao mover lead")
  }
}

export function useStageWithLeads(stageId: string) {
  return useQuery({
    queryKey: ["stages", stageId],
    queryFn: () => fetchStageWithLeads(stageId),
    enabled: !!stageId,
  })
}

export function useStagesByFunnel(funnelId: string) {
  return useQuery({
    queryKey: ["stages", "funnel", funnelId],
    queryFn: () => fetchStagesByFunnel(funnelId),
    enabled: !!funnelId,
  })
}

export function useMoveLeadToStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, stageId }: { leadId: string; stageId: string | null }) =>
      moveLeadToStage(leadId, stageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stages"] })
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })
}

export function useCreateStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stages", "funnel", data.funnelId] })
    },
  })
}
