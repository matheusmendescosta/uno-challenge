"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useWebSocket,
  type WebSocketEvent,
  type WebSocketEventType,
} from "@/src/hooks/use-websocket";

interface WebSocketContextValue {
  isConnected: boolean;
  lastEvent: WebSocketEvent | null;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  showToasts?: boolean;
}

export function WebSocketProvider({
  children,
  showToasts = false,
}: WebSocketProviderProps) {
  const queryClient = useQueryClient();

  const handleEvent = useCallback(
    (event: WebSocketEvent) => {
      const { type, payload } = event;

      // Log para debug
      console.log("[WebSocket] Evento recebido:", type, payload);

      // Invalidação de queries baseada no tipo de evento
      switch (type as WebSocketEventType) {
        case "connected":
          if (showToasts) {
            toast.success("Conectado ao servidor em tempo real");
          }
          break;

        case "lead:moved": {
          // Invalida queries de stages para atualizar o Kanban
          queryClient.invalidateQueries({ queryKey: ["stages"] });
          queryClient.invalidateQueries({ queryKey: ["leads"] });

          if (showToasts) {
            toast.info("Um lead foi movido por outro usuário");
          }
          break;
        }

        case "lead:created":
          queryClient.invalidateQueries({ queryKey: ["leads"] });
          queryClient.invalidateQueries({ queryKey: ["stages"] });
          if (showToasts) {
            toast.info("Novo lead criado");
          }
          break;

        case "lead:updated":
          queryClient.invalidateQueries({ queryKey: ["leads"] });
          queryClient.invalidateQueries({ queryKey: ["stages"] });
          if (showToasts) {
            toast.info("Lead atualizado por outro usuário");
          }
          break;

        case "lead:deleted":
          queryClient.invalidateQueries({ queryKey: ["leads"] });
          queryClient.invalidateQueries({ queryKey: ["stages"] });
          if (showToasts) {
            toast.info("Lead removido por outro usuário");
          }
          break;

        case "stage:created": {
          const stagePayload = payload as { stageId: string; funnelId: string };
          queryClient.invalidateQueries({
            queryKey: ["stages", "funnel", stagePayload.funnelId],
          });
          if (showToasts) {
            toast.info("Nova etapa criada");
          }
          break;
        }

        case "stage:updated": {
          const stagePayload = payload as { stageId: string; funnelId: string };
          queryClient.invalidateQueries({
            queryKey: ["stages", "funnel", stagePayload.funnelId],
          });
          if (showToasts) {
            toast.info("Etapa atualizada por outro usuário");
          }
          break;
        }

        case "stage:deleted": {
          const stagePayload = payload as { stageId: string; funnelId: string };
          queryClient.invalidateQueries({
            queryKey: ["stages", "funnel", stagePayload.funnelId],
          });
          if (showToasts) {
            toast.info("Etapa removida por outro usuário");
          }
          break;
        }

        default:
          console.log("[WebSocket] Evento não tratado:", type);
      }
    },
    [queryClient, showToasts],
  );

  const { isConnected, lastEvent, reconnect } = useWebSocket({
    onEvent: handleEvent,
  });

  return (
    <WebSocketContext.Provider value={{ isConnected, lastEvent, reconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error(
      "useWebSocketContext deve ser usado dentro de um WebSocketProvider",
    );
  }

  return context;
}
