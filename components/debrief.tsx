"use client"

import type React from "react"

import { useState } from "react"
import { formatTime } from "@/lib/time-utils"

interface DebriefProps {
  duration: number
  onSubmit: (note: string, intensity: number) => void
  onCancel: () => void
}

export function Debrief({ duration, onSubmit, onCancel }: DebriefProps) {
  const [note, setNote] = useState("")
  const [intensity, setIntensity] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(note, intensity)
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="border-[1px] border-slate-800 p-6 md:p-8">
          {/* Header */}
          <div className="text-slate-500 font-mono text-xs tracking-widest mb-6">SYS::DEBRIEF</div>

          {/* Session Summary */}
          <div className="border-[1px] border-slate-800 p-4 mb-6">
            <div className="text-slate-600 font-mono text-xs mb-1">SESSION DURATION</div>
            <div className="text-amber-500 font-mono text-2xl tabular-nums">{formatTime(duration)}</div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Log Entry */}
            <div className="mb-6">
              <label className="block text-slate-500 font-mono text-xs mb-2 tracking-widest">LOG ENTRY</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-black border-[1px] border-slate-800 text-white font-mono px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-700 min-h-[100px] resize-none"
                placeholder="DOCUMENT ACTIVITIES..."
              />
            </div>

            {/* Intensity Slider */}
            <div className="mb-8">
              <label className="block text-slate-500 font-mono text-xs mb-3 tracking-widest">
                INTENSITY: {intensity}/10
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-mono text-xs">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="flex-1 h-1 bg-slate-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-slate-600 font-mono text-xs">10</span>
              </div>
              <div className="flex justify-between mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${i < intensity ? "bg-amber-500" : "bg-slate-800"}`} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border-[1px] border-slate-800 bg-black text-slate-500 font-mono text-sm py-3 hover:border-slate-600 transition-colors"
              >
                [DISCARD]
              </button>
              <button
                type="submit"
                className="flex-1 border-[1px] border-amber-900 bg-black text-amber-500 font-mono text-sm py-3 hover:border-amber-500 hover:bg-amber-500/10 transition-colors"
              >
                [CONFIRM BURN]
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
