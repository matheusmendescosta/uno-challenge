import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@/src/lib/env";

export interface CreateFunnelInput {
  name: string;
  description?: string | null;
}

export interface Funnel {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

async function createFunnel(data: CreateFunnelInput): Promise<Funnel> {
  const response = await fetch(`${env.API_URL}/funnels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar funil");
  }

  return response.json();
}

export function useCreateFunnel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFunnel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funnels"] });
    },
  });
}
