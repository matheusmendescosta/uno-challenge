"use client"

import type { CursorPosition } from "./use-collaborative-cursors"

interface CollaborativeCursorProps {
  cursor: CursorPosition
}

export function CollaborativeCursor({ cursor }: CollaborativeCursorProps) {
  return (
    <div
      className="absolute pointer-events-none z-50 transition-all duration-75 ease-out"
      style={{
        left: `${cursor.x}%`,
        top: `${cursor.y}%`,
        transform: "translate(-2px, -2px)",
      }}
    >
      {/* Ícone do cursor */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-md"
        style={{ color: cursor.color }}
      >
        <path
          d="M5.5 3.21V20.79L11.2 13.29L19.5 13.29L5.5 3.21Z"
          fill="currentColor"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Nome do usuário */}
      <div
        className="absolute left-4 top-3 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap shadow-lg font-medium"
        style={{ backgroundColor: cursor.color }}
      >
        {cursor.name}
      </div>
    </div>
  )
}

interface CollaborativeCursorsOverlayProps {
  cursors: CursorPosition[]
}

export function CollaborativeCursorsOverlay({ cursors }: CollaborativeCursorsOverlayProps) {
  if (cursors.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {cursors.map((cursor) => (
        <CollaborativeCursor key={cursor.oderId} cursor={cursor} />
      ))}
    </div>
  )
}
