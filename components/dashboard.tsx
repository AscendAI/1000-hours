"use client"

import { formatTime, formatHoursDecimal } from "@/lib/time-utils"
import { Clock, History, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { SessionLog } from "@/app/page"

interface DashboardProps {
  mission: string
  remainingSeconds: number
  logs: SessionLog[]
  onInitiate: () => void
  onShowHistory: () => void
}

const INITIAL_HOURS = 1000

export function Dashboard({ mission, remainingSeconds, logs, onInitiate, onShowHistory }: DashboardProps) {
  const { user, signOut } = useAuth()
  const completedHours = (INITIAL_HOURS * 60 * 60 - remainingSeconds) / 3600
  const totalBlocks = 100
  const filledBlocks = Math.floor((completedHours / INITIAL_HOURS) * totalBlocks)

  return (
    <main className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="border-b-[1px] border-slate-800 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-slate-500 font-mono text-xs tracking-widest">1000_HOURS</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onShowHistory}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="font-mono text-xs hidden sm:inline">LOGS [{logs.length}]</span>
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Mission */}
        <div className="text-slate-600 font-mono text-xs tracking-widest mb-8 text-center">
          MISSION: <span className="text-slate-400">{mission.toUpperCase()}</span>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-12">
          <div className="text-amber-500 font-mono text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight tabular-nums">
            {formatTime(remainingSeconds)}
          </div>
          <div className="text-slate-600 font-mono text-xs mt-4 tracking-widest">
            REMAINING · {formatHoursDecimal(remainingSeconds)} HRS
          </div>
        </div>

        {/* Initiate Button */}
        <button
          onClick={onInitiate}
          disabled={remainingSeconds <= 0}
          className="border-[1px] border-slate-800 bg-black text-white font-mono text-sm px-12 py-4 hover:border-amber-500 hover:text-amber-500 transition-colors tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
        >
          INITIATE
        </button>

        {/* The Void Visualizer */}
        <div className="mt-16 w-full max-w-2xl">
          <div className="text-slate-700 font-mono text-xs mb-3 tracking-widest">THE VOID</div>
          <div className="grid grid-cols-20 gap-[2px]">
            {Array.from({ length: totalBlocks }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square border-[1px] ${i < filledBlocks ? "bg-amber-500/80 border-amber-500/50" : "bg-transparent border-slate-800"
                  }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-slate-700 font-mono text-xs">
            <span>{completedHours.toFixed(1)}h BURNED</span>
            <span>{(remainingSeconds / 3600).toFixed(1)}h REMAIN</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-[1px] border-slate-800 p-4">
        <div className="text-center text-slate-700 font-mono text-xs">
          TOTAL SESSIONS: {logs.length} · STATUS:{" "}
          <span className={remainingSeconds > 0 ? "text-green-600" : "text-red-500"}>
            {remainingSeconds > 0 ? "ACTIVE" : "DEPLETED"}
          </span>
        </div>
        <div className="text-center text-slate-600 font-mono text-xs mt-2">
          Made by{" "}
          <a
            href="https://x.com/hex_paradus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500/70 hover:text-amber-500 transition-colors"
          >
            @hex_paradus
          </a>
        </div>
      </footer>
    </main>
  )
}
