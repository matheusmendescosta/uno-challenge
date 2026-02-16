import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const response = await fetch("http://localhost:3333/funnels", {
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
