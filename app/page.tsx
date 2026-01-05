"use client"

import { useState, useEffect } from "react"
import { Onboarding } from "@/components/onboarding"
import { Dashboard } from "@/components/dashboard"
import { SessionMode } from "@/components/session-mode"
import { Debrief } from "@/components/debrief"
import { HistoryLogs } from "@/components/history-logs"
import { useAuth } from "@/lib/auth-context"
import { loadUserData, saveUserData } from "@/lib/firestore"
import { LogIn } from "lucide-react"

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
  sessionStartTime: number | null
}

const INITIAL_HOURS = 1000
const INITIAL_SECONDS = INITIAL_HOURS * 60 * 60

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [mission, setMission] = useState<string | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_SECONDS)
  const [logs, setLogs] = useState<SessionLog[]>([])
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [showDebrief, setShowDebrief] = useState(false)
  const [currentSessionDuration, setCurrentSessionDuration] = useState(0)
  const [showHistory, setShowHistory] = useState(false)

  // Load from Firestore when user logs in
  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const data = await loadUserData(user.uid)
          if (data) {
            setMission(data.mission)
            setRemainingSeconds(data.remainingSeconds)
            setLogs(data.logs)
            // Restore active session if it exists
            if (data.sessionStartTime) {
              setSessionStartTime(data.sessionStartTime)
              setIsSessionActive(true)
              // Calculate elapsed time since session started
              const elapsed = Math.floor((Date.now() - data.sessionStartTime) / 1000)
              setCurrentSessionDuration(elapsed)
            }
          }
        } catch (error) {
          console.error("Failed to load user data:", error)
        }
      }
      setIsLoaded(true)
    }

    if (!authLoading) {
      loadData()
    }
  }, [user, authLoading])

  // Save to Firestore on state change
  useEffect(() => {
    if (isLoaded && mission && user) {
      const state: AppState = { mission, remainingSeconds, logs, sessionStartTime }
      saveUserData(user.uid, state).catch((error) => {
        console.error("Failed to save user data:", error)
      })
    }
  }, [mission, remainingSeconds, logs, sessionStartTime, isLoaded, user])

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

  if (!isLoaded || authLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <span className="text-slate-500 font-mono text-sm animate-pulse">INITIALIZING...</span>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-amber-500 font-mono text-4xl tracking-tight">1000_HOURS</h1>
            <p className="text-slate-500 font-mono text-sm">Sign in to track your progress</p>
          </div>
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-3 mx-auto px-6 py-3 bg-white text-black font-mono text-sm hover:bg-slate-200 transition-colors rounded"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
        </div>
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
