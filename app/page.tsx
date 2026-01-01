"use client"

import { useState, useEffect } from "react"
import { Onboarding } from "@/components/onboarding"
import { Dashboard } from "@/components/dashboard"
import { SessionMode } from "@/components/session-mode"
import { Debrief } from "@/components/debrief"
import { HistoryLogs } from "@/components/history-logs"

export interface SessionLog {
  id: string
  timestamp: Date
  duration: number // in seconds
  note: string
  intensity: number
}

export interface AppState {
  mission: string
  remainingSeconds: number
  logs: SessionLog[]
}

const INITIAL_HOURS = 1000
const INITIAL_SECONDS = INITIAL_HOURS * 60 * 60

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mission, setMission] = useState<string | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_SECONDS)
  const [logs, setLogs] = useState<SessionLog[]>([])
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [showDebrief, setShowDebrief] = useState(false)
  const [currentSessionDuration, setCurrentSessionDuration] = useState(0)
  const [showHistory, setShowHistory] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("1000hours-state")
    if (saved) {
      const state: AppState = JSON.parse(saved)
      setMission(state.mission)
      setRemainingSeconds(state.remainingSeconds)
      setLogs(state.logs.map((log) => ({ ...log, timestamp: new Date(log.timestamp) })))
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (isLoaded && mission) {
      const state: AppState = { mission, remainingSeconds, logs }
      localStorage.setItem("1000hours-state", JSON.stringify(state))
    }
  }, [mission, remainingSeconds, logs, isLoaded])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
        setCurrentSessionDuration(elapsed)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSessionActive, sessionStartTime])

  const handleMissionSubmit = (missionText: string) => {
    setMission(missionText)
  }

  const handleInitiate = () => {
    setIsSessionActive(true)
    setSessionStartTime(Date.now())
    setCurrentSessionDuration(0)
  }

  const handleTerminate = () => {
    setIsSessionActive(false)
    setShowDebrief(true)
  }

  const handleDebriefSubmit = (note: string, intensity: number) => {
    const newLog: SessionLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      duration: currentSessionDuration,
      note,
      intensity,
    }
    setLogs((prev) => [newLog, ...prev])
    setRemainingSeconds((prev) => Math.max(0, prev - currentSessionDuration))
    setShowDebrief(false)
    setSessionStartTime(null)
    setCurrentSessionDuration(0)
  }

  const handleDebriefCancel = () => {
    setShowDebrief(false)
    setSessionStartTime(null)
    setCurrentSessionDuration(0)
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <span className="text-slate-500 font-mono text-sm animate-pulse">INITIALIZING...</span>
      </main>
    )
  }

  if (!mission) {
    return <Onboarding onSubmit={handleMissionSubmit} />
  }

  if (showDebrief) {
    return <Debrief duration={currentSessionDuration} onSubmit={handleDebriefSubmit} onCancel={handleDebriefCancel} />
  }

  if (isSessionActive) {
    return <SessionMode remainingSeconds={remainingSeconds - currentSessionDuration} onTerminate={handleTerminate} />
  }

  return (
    <>
      <Dashboard
        mission={mission}
        remainingSeconds={remainingSeconds}
        logs={logs}
        onInitiate={handleInitiate}
        onShowHistory={() => setShowHistory(true)}
      />
      <HistoryLogs logs={logs} isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  )
}
