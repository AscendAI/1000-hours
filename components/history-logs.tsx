"use client"

import { X } from "lucide-react"
import { formatTime } from "@/lib/time-utils"
import type { SessionLog } from "@/app/page"

interface HistoryLogsProps {
  logs: SessionLog[]
  isOpen: boolean
  onClose: () => void
}

export function HistoryLogs({ logs, isOpen, onClose }: HistoryLogsProps) {
  if (!isOpen) return null

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-auto">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[1px] border-slate-800 pb-4 mb-6">
          <div className="text-slate-500 font-mono text-xs tracking-widest">SYS::LOGS [{logs.length} ENTRIES]</div>
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs */}
        {logs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-700 font-mono text-sm">NO ENTRIES LOGGED</div>
            <div className="text-slate-800 font-mono text-xs mt-2">INITIATE A SESSION TO BEGIN</div>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div key={log.id} className="border-[1px] border-slate-800 p-4 font-mono">
                {/* Log Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-slate-600 text-xs">
                    [{String(logs.length - index).padStart(3, "0")}] {formatDate(log.timestamp)}
                  </div>
                  <div className="text-amber-500 text-xs tabular-nums">{formatTime(log.duration)}</div>
                </div>

                {/* Log Content */}
                <div className="text-slate-400 text-sm mb-3">
                  {log.note || <span className="text-slate-700">[NO NOTE]</span>}
                </div>

                {/* Intensity Bar */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 text-xs">INT:</span>
                  <div className="flex gap-[2px]">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 ${i < log.intensity ? "bg-amber-500/80" : "bg-slate-800"}`} />
                    ))}
                  </div>
                  <span className="text-slate-600 text-xs">{log.intensity}/10</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="border-t-[1px] border-slate-800 mt-8 pt-4">
          <div className="text-slate-700 font-mono text-xs text-center">END OF LOG</div>
        </div>
      </div>
    </div>
  )
}
