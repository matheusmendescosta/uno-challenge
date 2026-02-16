"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Skeleton } from "@/src/components/ui/skeleton"
import { useLeads, LeadStatus } from "./use-leads"

const statusColors: Record<LeadStatus, "default" | "secondary" | "destructive" | "outline"> = {
  [LeadStatus.NOVO]: "default",
  [LeadStatus.CONTACTADO]: "secondary",
  [LeadStatus.QUALIFICADO]: "outline",
  [LeadStatus.CONVERTIDO]: "default",
  [LeadStatus.PERDIDO]: "destructive",
}

const statusLabels: Record<LeadStatus, string> = {
  [LeadStatus.NOVO]: "Novo",
  [LeadStatus.CONTACTADO]: "Contatado",
  [LeadStatus.QUALIFICADO]: "Qualificado",
  [LeadStatus.CONVERTIDO]: "Convertido",
  [LeadStatus.PERDIDO]: "Perdido",
}

export const LeadsPage = () => {
  const { data: leads, isLoading, error } = useLeads()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>Lista de todos os leads cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>Lista de todos os leads cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar leads: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <CardDescription>Lista de todos os leads cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
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
            {leads?.map((lead) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
