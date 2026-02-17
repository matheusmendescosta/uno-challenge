"use client";

import { useWebSocketContext } from "@/src/providers/websocket-provider";
import { Badge } from "@/src/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface WebSocketStatusProps {
  showLabel?: boolean;
}

export function WebSocketStatus({ showLabel = true }: WebSocketStatusProps) {
  const { isConnected, reconnect } = useWebSocketContext();

  return (
    <Badge
      variant={isConnected ? "default" : "destructive"}
      className="gap-1.5 cursor-pointer"
      onClick={() => !isConnected && reconnect()}
      title={
        isConnected
          ? "Conectado - Atualizações em tempo real ativas"
          : "Desconectado - Clique para reconectar"
      }
    >
      {isConnected ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {showLabel && (isConnected ? "Tempo real" : "Desconectado")}
    </Badge>
  );
}
