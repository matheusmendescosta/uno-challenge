"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Contact, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useDashboardStats } from "./use-dashboard-stats";
import { LeadStatus } from "../leads/use-leads";

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

const DashboardPage = () => {
  const { isLoading, error, stats, recentLeads } = useDashboardStats();

  const statsData = [
    {
      title: "Total de Leads",
      value: stats.totalLeads.toString(),
      description: "Leads cadastrados no sistema",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: "Total de Contatos",
      value: stats.totalContacts.toString(),
      description: "Contatos cadastrados no sistema",
      icon: Contact,
      trend: "up" as const,
    },
    {
      title: "Leads Convertidos",
      value: stats.convertedLeads.toString(),
      description: "Leads com status convertido",
      icon: TrendingUp,
      trend: "up" as const,
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.conversionRate}%`,
      description: "Percentual de conversão",
      icon: stats.convertedLeads > 0 ? TrendingUp : TrendingDown,
      trend: stats.convertedLeads > 0 ? ("up" as const) : ("down" as const),
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Erro ao carregar dados: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p
                    className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Placeholder */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>
              Leads e conversões nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted/50">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-10 w-10" />
                <span className="text-sm">Gráfico de desempenho</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
            <CardDescription>Últimos 5 leads cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum lead cadastrado
              </p>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead, index) => {
                  const recentLead = lead as {
                    id?: string | number;
                    name?: string;
                    company?: string;
                    status: LeadStatus;
                  };

                  return (
                    <div
                      key={recentLead.id ?? `${recentLead.status}-${index}`}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {recentLead.name ?? "Lead sem nome"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {recentLead.company ?? "Empresa não informada"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusColors[recentLead.status]}>
                          {statusLabels[recentLead.status]}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
