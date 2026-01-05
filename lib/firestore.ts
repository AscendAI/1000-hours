import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"
import type { AppState } from "@/app/page"

export interface UserData {
  mission: string
  remainingSeconds: number
  logs: Array<{
    id: string
    timestamp: string
    duration: number
    note: string
    intensity: number
  }>
  sessionStartTime: number | null
  updatedAt: string
}

/**
 * Save user's app state to Firestore
 */
export async function saveUserData(userId: string, data: AppState): Promise<void> {
  const userRef = doc(db, "user", userId)
  
  const userData: UserData = {
    mission: data.mission,
    remainingSeconds: data.remainingSeconds,
    logs: data.logs.map((log) => ({
      ...log,
      timestamp: log.timestamp.toISOString(),
    })),
    sessionStartTime: data.sessionStartTime,
    updatedAt: new Date().toISOString(),
  }

  try {
    await setDoc(userRef, userData, { merge: true })
  } catch (error) {
    console.error("Error saving user data:", error)
    throw error
  }
}

/**
 * Load user's app state from Firestore
 */
export async function loadUserData(userId: string): Promise<AppState | null> {
  const userRef = doc(db, "user", userId)

  try {
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      const data = docSnap.data() as UserData
      return {
        mission: data.mission,
        remainingSeconds: data.remainingSeconds,
        logs: data.logs.map((log) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        })),
        sessionStartTime: data.sessionStartTime || null,
      }
    }

    return null
  } catch (error) {
    console.error("Error loading user data:", error)
    throw error
  }
}

/**
 * Update only the remaining seconds (for quick updates)
 */
export async function updateRemainingSeconds(userId: string, seconds: number): Promise<void> {
  const userRef = doc(db, "user", userId)

  try {
    await updateDoc(userRef, {
      remainingSeconds: seconds,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating remaining seconds:", error)
    throw error
  }
}
