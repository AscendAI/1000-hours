"use client"

import type React from "react"

import { useState } from "react"

interface OnboardingProps {
  onSubmit: (mission: string) => void
}

export function Onboarding({ onSubmit }: OnboardingProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="border-[1px] border-slate-800 p-6 md:p-8">
          <div className="text-slate-500 font-mono text-xs mb-4 tracking-widest">SYS::INIT</div>
          <label className="block text-slate-500 font-mono text-sm mb-4">IDENTIFY MISSION OBJECTIVE {">"}</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-black border-[1px] border-slate-800 text-white font-mono px-4 py-3 text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-700"
            placeholder="ENTER OBJECTIVE..."
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="mt-6 w-full border-[1px] border-slate-800 bg-black text-slate-500 font-mono text-sm py-3 hover:border-amber-500 hover:text-amber-500 transition-colors disabled:opacity-30 disabled:hover:border-slate-800 disabled:hover:text-slate-500"
          >
            [CONFIRM]
          </button>
        </div>
        <div className="text-slate-700 font-mono text-xs mt-4 text-center">1000 HOURS ALLOCATED</div>
      </form>
    </main>
  )
}
