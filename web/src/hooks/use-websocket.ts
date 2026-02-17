"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export type WebSocketEventType =
  | "connected"
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

export type WebSocketEventHandler = (event: WebSocketEvent) => void;

interface UseWebSocketOptions {
  url?: string;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  onEvent?: WebSocketEventHandler;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastEvent: WebSocketEvent | null;
  reconnect: () => void;
}

const DEFAULT_WS_URL = "ws://localhost:3333/ws";
const DEFAULT_RECONNECT_DELAY = 3000;
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    url = DEFAULT_WS_URL,
    reconnectDelay = DEFAULT_RECONNECT_DELAY,
    maxReconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS,
    onEvent,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onEventRef = useRef(onEvent);

  // Mantém a referência do callback atualizada
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    // Não reconecta se já estiver conectado
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Limpa conexão anterior
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("[WebSocket] Conectado");
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketEvent;
          setLastEvent(data);

          // Chama o callback se fornecido
          if (onEventRef.current) {
            onEventRef.current(data);
          }
        } catch (error) {
          console.error("[WebSocket] Erro ao parsear mensagem:", error);
        }
      };

      ws.onclose = () => {
        console.log("[WebSocket] Desconectado");
        setIsConnected(false);

        // Tenta reconectar
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            console.log(
              `[WebSocket] Tentando reconectar... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
            );
            connectRef.current?.();
          }, reconnectDelay);
        } else {
          console.log("[WebSocket] Máximo de tentativas de reconexão atingido");
        }
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] Erro:", error);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("[WebSocket] Erro ao criar conexão:", error);
    }
  }, [url, reconnectDelay, maxReconnectAttempts]);

  // Mantém a referência do connect atualizada
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      // Limpa timeout de reconexão
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Fecha conexão
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastEvent,
    reconnect,
  };
}
