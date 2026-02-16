"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Plus, User, Building2, Loader2 } from "lucide-react";
import { useLeads, type Lead } from "../leads/use-leads";
import { useMoveLeadToStage, type StageWithLeads } from "./use-stages";

interface AddLeadToStageDialogProps {
  stage: StageWithLeads;
  allStages: StageWithLeads[];
}

export function AddLeadToStageDialog({
  stage,
  allStages,
}: AddLeadToStageDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: leadsResponse, isLoading: isLoadingLeads } = useLeads();
  const moveLeadMutation = useMoveLeadToStage();

  // Filtrar leads que não estão em nenhuma etapa do funil
  const leadsInFunnel = allStages.flatMap(
    (s) => s.leads?.map((l) => l.id) || [],
  );
  const availableLeads =
    leadsResponse?.data?.filter((lead) => !leadsInFunnel.includes(lead.id)) ||
    [];

  const handleAddLead = async (lead: Lead) => {
    await moveLeadMutation.mutateAsync({
      leadId: lead.id,
      stageId: stage.id,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Lead à Etapa</DialogTitle>
          <DialogDescription>
            Selecione um lead para adicionar à etapa {stage.name}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto space-y-2 py-4">
          {isLoadingLeads ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : availableLeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum lead disponível para adicionar.</p>
              <p className="text-sm mt-2">
                Todos os leads já estão vinculados a alguma etapa deste funil.
              </p>
            </div>
          ) : (
            availableLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleAddLead(lead)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="font-medium truncate">{lead.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground truncate">
                      {lead.company}
                    </p>
                  </div>
                  {lead.contact && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.contact.email}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline">{lead.status}</Badge>
                  {moveLeadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
