import type { WSContext } from "hono/ws";

// Tipos de eventos WebSocket
export type WebSocketEventType =
  | "lead:moved"
  | "lead:created"
  | "lead:updated"
  | "lead:deleted"
  | "stage:created"
  | "stage:updated"
  | "stage:deleted";

export interface WebSocketEvent {
  type: WebSocketEventType;
  payload: unknown;
  timestamp: string;
}

// Gerenciador de conexões WebSocket
class WebSocketManager {
  private connections: Set<WSContext> = new Set();

  // Adiciona uma nova conexão
  addConnection(ws: WSContext) {
    this.connections.add(ws);
    console.log(
      `[WebSocket] Nova conexão. Total: ${this.connections.size} conexões`,
    );
  }

  // Remove uma conexão
  removeConnection(ws: WSContext) {
    this.connections.delete(ws);
    console.log(
      `[WebSocket] Conexão encerrada. Total: ${this.connections.size} conexões`,
    );
  }

  // Envia evento para todas as conexões
  broadcast(event: WebSocketEvent) {
    const message = JSON.stringify(event);
    console.log(
      `[WebSocket] Broadcast: ${event.type} para ${this.connections.size} conexões`,
    );

    for (const ws of this.connections) {
      try {
        ws.send(message);
      } catch (error) {
        console.error("[WebSocket] Erro ao enviar mensagem:", error);
        this.removeConnection(ws);
      }
    }
  }

  // Atalhos para eventos específicos
  emitLeadMoved(data: {
    leadId: string;
    fromStageId: string | null;
    toStageId: string | null;
    funnelId?: string;
  }) {
    this.broadcast({
      type: "lead:moved",
      payload: data,
      timestamp: new Date().toISOString(),
    });
  }

  emitLeadCreated(leadId: string, stageId?: string | null) {
    this.broadcast({
      type: "lead:created",
      payload: { leadId, stageId },
      timestamp: new Date().toISOString(),
    });
  }

  emitLeadUpdated(leadId: string) {
    this.broadcast({
      type: "lead:updated",
      payload: { leadId },
      timestamp: new Date().toISOString(),
    });
  }

  emitLeadDeleted(leadId: string) {
    this.broadcast({
      type: "lead:deleted",
      payload: { leadId },
      timestamp: new Date().toISOString(),
    });
  }

  emitStageCreated(stageId: string, funnelId: string) {
    this.broadcast({
      type: "stage:created",
      payload: { stageId, funnelId },
      timestamp: new Date().toISOString(),
    });
  }

  emitStageUpdated(stageId: string, funnelId: string) {
    this.broadcast({
      type: "stage:updated",
      payload: { stageId, funnelId },
      timestamp: new Date().toISOString(),
    });
  }

  emitStageDeleted(stageId: string, funnelId: string) {
    this.broadcast({
      type: "stage:deleted",
      payload: { stageId, funnelId },
      timestamp: new Date().toISOString(),
    });
  }

  // Retorna o número de conexões ativas
  getConnectionCount() {
    return this.connections.size;
  }
}

// Singleton do gerenciador
export const wsManager = new WebSocketManager();
