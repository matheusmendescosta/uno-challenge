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
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { LeadStatus, useLeads } from "./use-leads";

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
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
                        <Badge variant={statusColors[lead.status] || "default"}>
                          {statusLabels[lead.status] || lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.contact?.name || "-"}</TableCell>
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
    </Card>
  );
};
