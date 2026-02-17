"use client"

import { useParams } from "next/navigation"
import { useFunnel } from "./use-funnels"
import { useStagesByFunnel, useMoveLeadToStage, type StageWithLeads } from "./use-stages"
import { Card, CardContent } from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { ArrowLeft, GripVertical, Building2, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AddLeadToStageDialog } from "./AddLeadToStageDialog"
import { AddStageDialog } from "./AddStageDialog"
import { WebSocketStatus } from "@/src/components/ui/websocket-status"

interface KanbanColumnProps {
  stage: StageWithLeads
  allStages: StageWithLeads[]
  onDragStart: (e: React.DragEvent, leadId: string, sourceStageId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetStageId: string) => void
  isDragging: boolean
}

const KanbanColumn = ({ stage, allStages, onDragStart, onDragOver, onDrop, isDragging }: KanbanColumnProps) => {
  return (
    <div
      className={`flex flex-col min-w-75 max-w-75 bg-muted/30 rounded-lg border ${
        isDragging ? "border-primary border-dashed" : "border-border"
      }`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage.id)}
    >
      <div
        className="p-3 border-b flex items-center gap-2"
        style={{ borderLeftColor: stage.color || "#3B82F6", borderLeftWidth: "4px" }}
      >
        <h3 className="font-semibold text-sm flex-1">{stage.name}</h3>
        <Badge variant="secondary" className="text-xs">
          {stage.leads?.length ?? 0}
        </Badge>
      </div>

      <div className="p-2 flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-320px)]">
        {stage.leads && stage.leads.length > 0 ? (
          stage.leads.map((lead) => (
            <Card
              key={lead.id}
              className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => onDragStart(e, lead.id, stage.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground shrink-0" />
                      <p className="font-medium text-sm truncate">{lead.name}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhum lead nesta etapa
          </div>
        )}
      </div>

      <div className="p-2 border-t">
        <AddLeadToStageDialog stage={stage} allStages={allStages} />
      </div>
    </div>
  )
}

const FunnelKanbanPage = () => {
  const params = useParams()
  const funnelId = params.funnelId as string

  const { data: funnel, isLoading: isLoadingFunnel, error: funnelError } = useFunnel(funnelId)
  const { data: stages, isLoading: isLoadingStages, error: stagesError } = useStagesByFunnel(funnelId)
  const moveLeadMutation = useMoveLeadToStage()

  const [draggedLead, setDraggedLead] = useState<{ leadId: string; sourceStageId: string } | null>(null)

  const handleDragStart = (e: React.DragEvent, leadId: string, sourceStageId: string) => {
    setDraggedLead({ leadId, sourceStageId })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()

    if (draggedLead && draggedLead.sourceStageId !== targetStageId) {
      await moveLeadMutation.mutateAsync({
        leadId: draggedLead.leadId,
        stageId: targetStageId,
      })
    }

    setDraggedLead(null)
  }

  const isLoading = isLoadingFunnel || isLoadingStages
  const error = funnelError || stagesError

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Skeleton className="h-96 min-w-75" />
          <Skeleton className="h-96 min-w-75" />
          <Skeleton className="h-96 min-w-75" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/crm">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar funil: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sortedStages = stages?.sort((a, b) => a.order - b.order) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/crm">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{funnel?.name}</h1>
          <p className="text-muted-foreground">
            {funnel?.description || "Arraste os leads entre as etapas para atualizar o progresso"}
          </p>
        </div>
        <WebSocketStatus />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {sortedStages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            allStages={sortedStages}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={draggedLead !== null}
          />
        ))}
        <AddStageDialog funnelId={funnelId} existingStages={sortedStages} />
      </div>
    </div>
  )
}

export default FunnelKanbanPage
