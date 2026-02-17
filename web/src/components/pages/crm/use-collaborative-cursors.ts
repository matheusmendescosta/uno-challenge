"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useWebSocket, type WebSocketEvent } from "@/src/hooks/use-websocket"

export interface CursorPosition {
  oderId: string
  x: number
  y: number
  name: string
  color: string
  lastUpdate: number
}

interface CursorPayload {
  oderId: string
  x?: number
  y?: number
  name: string
  color: string
  funnelId: string
}

const CURSOR_COLORS = [
  "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
  "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
]

function getRandomColor(): string {
  return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]
}

function getUserName(): string {
  // Em produção, usar dados reais do usuário autenticado
  if (typeof window !== "undefined") {
    let name = sessionStorage.getItem("cursor_user_name")
    if (!name) {
      name = `Usuário ${Math.floor(Math.random() * 1000)}`
      sessionStorage.setItem("cursor_user_name", name)
    }
    return name
  }
  return `Usuário ${Math.floor(Math.random() * 1000)}`
}

function getUserId(): string {
  if (typeof window !== "undefined") {
    let oderId = sessionStorage.getItem("cursor_user_id")
    if (!oderId) {
      oderId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      sessionStorage.setItem("cursor_user_id", oderId)
    }
    return oderId
  }
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

function getUserColor(): string {
  if (typeof window !== "undefined") {
    let color = sessionStorage.getItem("cursor_user_color")
    if (!color) {
      color = getRandomColor()
      sessionStorage.setItem("cursor_user_color", color)
    }
    return color
  }
  return getRandomColor()
}

// Tempo limite para considerar um cursor como inativo (5 segundos)
const CURSOR_TIMEOUT = 5000

export function useCollaborativeCursors(funnelId: string) {
  const [cursors, setCursors] = useState<Map<string, CursorPosition>>(new Map())
  const containerRef = useRef<HTMLDivElement | null>(null)

  const userIdRef = useRef<string>("")
  const userNameRef = useRef<string>("")
  const userColorRef = useRef<string>("")
  const throttleRef = useRef<number>(0)
  const hasEnteredRef = useRef(false)

  // Inicializa dados do usuário no cliente
  useEffect(() => {
    userIdRef.current = getUserId()
    userNameRef.current = getUserName()
    userColorRef.current = getUserColor()
  }, [])

  const handleWebSocketEvent = useCallback((event: WebSocketEvent) => {
    const payload = event.payload as CursorPayload

    // Ignora mensagens do próprio usuário
    if (payload.oderId === userIdRef.current) return

    // Ignora mensagens de outros funis
    if (payload.funnelId !== funnelId) return

    if (event.type === "cursor:move") {
      setCursors((prev) => {
        const newCursors = new Map(prev)
        newCursors.set(payload.oderId, {
          oderId: payload.oderId,
          x: payload.x || 0,
          y: payload.y || 0,
          name: payload.name,
          color: payload.color,
          lastUpdate: Date.now(),
        })
        return newCursors
      })
    } else if (event.type === "cursor:leave") {
      setCursors((prev) => {
        const newCursors = new Map(prev)
        newCursors.delete(payload.oderId)
        return newCursors
      })
    } else if (event.type === "cursor:enter") {
      // Cursor entrou, será atualizado quando mover
    }
  }, [funnelId])

  const { isConnected, sendMessage } = useWebSocket({
    onEvent: handleWebSocketEvent,
  })

  // Envia entrada na página
  useEffect(() => {
    if (isConnected && !hasEnteredRef.current && userIdRef.current) {
      hasEnteredRef.current = true
      sendMessage({
        type: "cursor:enter",
        payload: {
          oderId: userIdRef.current,
          name: userNameRef.current,
          color: userColorRef.current,
          funnelId,
        },
        timestamp: new Date().toISOString(),
      })
    }

    return () => {
      if (hasEnteredRef.current && userIdRef.current) {
        sendMessage({
          type: "cursor:leave",
          payload: {
            oderId: userIdRef.current,
            name: userNameRef.current,
            color: userColorRef.current,
            funnelId,
          },
          timestamp: new Date().toISOString(),
        })
        hasEnteredRef.current = false
      }
    }
  }, [isConnected, funnelId, sendMessage])

  // Handler de movimento do mouse com throttle
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const now = Date.now()
      // Throttle de 50ms para não sobrecarregar o WebSocket
      if (now - throttleRef.current < 50) return
      throttleRef.current = now

      if (!containerRef.current || !isConnected) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      sendMessage({
        type: "cursor:move",
        payload: {
          oderId: userIdRef.current,
          x,
          y,
          name: userNameRef.current,
          color: userColorRef.current,
          funnelId,
        },
        timestamp: new Date().toISOString(),
      })
    },
    [isConnected, funnelId, sendMessage]
  )

  // Handler quando o mouse sai do container
  const handleMouseLeave = useCallback(() => {
    if (!isConnected) return

    sendMessage({
      type: "cursor:leave",
      payload: {
        oderId: userIdRef.current,
        name: userNameRef.current,
        color: userColorRef.current,
        funnelId,
      },
      timestamp: new Date().toISOString(),
    })
  }, [isConnected, funnelId, sendMessage])

  // Handler quando o mouse entra no container
  const handleMouseEnter = useCallback(() => {
    if (!isConnected) return

    sendMessage({
      type: "cursor:enter",
      payload: {
        oderId: userIdRef.current,
        name: userNameRef.current,
        color: userColorRef.current,
        funnelId,
      },
      timestamp: new Date().toISOString(),
    })
  }, [isConnected, funnelId, sendMessage])

  // Remove cursores inativos
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setCursors((prev) => {
        const newCursors = new Map(prev)
        let hasChanges = false

        for (const [id, cursor] of newCursors) {
          if (now - cursor.lastUpdate > CURSOR_TIMEOUT) {
            newCursors.delete(id)
            hasChanges = true
          }
        }

        return hasChanges ? newCursors : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    cursors: Array.from(cursors.values()),
    containerRef,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter,
    isConnected,
  }
}
