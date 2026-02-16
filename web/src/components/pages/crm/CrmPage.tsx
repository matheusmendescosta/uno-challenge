"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Badge } from "@/src/components/ui/badge"
import { useFunnels } from "./use-funnels"
import Link from "next/link"

const CrmPage = () => {
  const { data: funnels, isLoading, error } = useFunnels()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CRM - Funis de Vendas</h1>
          <p className="text-muted-foreground">Gerencie seus funis e etapas de vendas</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CRM - Funis de Vendas</h1>
          <p className="text-muted-foreground">Gerencie seus funis e etapas de vendas</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar funis: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CRM - Funis de Vendas</h1>
        <p className="text-muted-foreground">Gerencie seus funis e etapas de vendas</p>
      </div>

      {funnels && funnels.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Nenhum funil cadastrado ainda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {funnels?.map((funnel) => (
            <Link key={funnel.id} href={`/crm/${funnel.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {funnel.name}
                    <Badge variant="secondary">
                      {funnel.stages?.length ?? 0} etapas
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {funnel.description || "Sem descrição"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {funnel.stages && funnel.stages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {funnel.stages
                        .sort((a, b) => a.order - b.order)
                        .map((stage) => (
                          <Badge
                            key={stage.id}
                            variant="outline"
                            style={{
                              borderColor: stage.color || "#3B82F6",
                              color: stage.color || "#3B82F6",
                            }}
                          >
                            {stage.name}
                          </Badge>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default CrmPage
