"use client";

import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Pagination } from "@/src/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { usePaginationParams } from "@/src/hooks/use-pagination-params";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { LeadStatus, useLeads, useUpdateLead, useDeleteLead, type Lead } from "./use-leads";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { toast } from "sonner";

const statusColors: Record<
  LeadStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [LeadStatus.NOVO]: "default",
  [LeadStatus.CONTACTADO]: "secondary",
  [LeadStatus.QUALIFICADO]: "outline",
  [LeadStatus.CONVERTIDO]: "default",
  [LeadStatus.PERDIDO]: "destructive",
};

const statusLabels: Record<LeadStatus, string> = {
  [LeadStatus.NOVO]: "Novo",
  [LeadStatus.CONTACTADO]: "Contatado",
  [LeadStatus.QUALIFICADO]: "Qualificado",
  [LeadStatus.CONVERTIDO]: "Convertido",
  [LeadStatus.PERDIDO]: "Perdido",
};

export const LeadsPage = () => {
  const { page, limit, search, setPage, setLimit, setSearch } =
    usePaginationParams();
  const [searchInput, setSearchInput] = useState(search);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const { mutate: updateLead } = useUpdateLead();
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead();

  const { data, isLoading, error } = useLeads({
    page,
    limit,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleDeleteConfirm = () => {
    if (leadToDelete) {
      deleteLead(leadToDelete.id, {
        onSuccess: () => {
          toast.success("Lead excluído com sucesso!");
          setLeadToDelete(null);
        },
        onError: () => {
          toast.error("Erro ao excluir lead");
        },
      });
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>Lista de todos os leads cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Erro ao carregar leads: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <CardDescription>Lista de todos os leads cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou empresa..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as LeadStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.values(LeadStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      Nenhum lead encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) =>
                            updateLead({
                              id: lead.id,
                              data: { status: value as LeadStatus },
                            })
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <Badge variant={statusColors[lead.status] || "default"}>
                              {statusLabels[lead.status] || lead.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(LeadStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {statusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{lead.contact?.name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Link href={`/leads/${lead.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLeadToDelete(lead)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {data && data.totalPages > 0 && (
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </>
        )}
      </CardContent>

      <Dialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o lead &quot;{leadToDelete?.name}&quot;? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeadToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
