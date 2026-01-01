"use client"

import { formatTime } from "@/lib/time-utils"

interface SessionModeProps {
  remainingSeconds: number
  onTerminate: () => void
}

export function SessionMode({ remainingSeconds, onTerminate }: SessionModeProps) {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Status Indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-2 h-2 bg-red-500 animate-pulse" />
        <span className="text-red-500 font-mono text-xs tracking-widest">SESSION ACTIVE</span>
      </div>

      {/* Timer Display with Pulse Effect */}
      <div className="text-center">
        <div className="text-red-500 font-mono text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight tabular-nums animate-pulse">
          {formatTime(Math.max(0, remainingSeconds))}
        </div>
      </div>

      {/* Terminate Button */}
      <button
        onClick={onTerminate}
        className="mt-16 border-[1px] border-red-900 bg-black text-red-500 font-mono text-sm px-12 py-4 hover:border-red-500 hover:bg-red-500/10 transition-colors tracking-widest"
      >
        TERMINATE
      </button>

      {/* Minimal Footer */}
      <div className="absolute bottom-8 text-slate-700 font-mono text-xs tracking-widest">[ESC TO ABORT]</div>
    </main>
  )
}
