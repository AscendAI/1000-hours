"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, getAdditionalUserInfo } from "firebase/auth"
import { auth, googleProvider } from "./firebase"
import {posthog} from "posthog-js"
import { logToDiscord } from "./discord-logger"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const res = await getAdditionalUserInfo(cred);
      if (res?.isNewUser) {
        // Log new user signup to Discord
        logToDiscord({
          title: '🎉 New User Signed Up',
          color: 5763719, // Green color
          fields: [
            {
              name: '👤 User ID',
              value: cred.user.uid,
              inline: false
            },
            {
              name: '📧 Email',
              value: cred.user.email || 'No email',
              inline: false
            },
            {
              name: '📅 Sign Up Date',
              value: new Date().toLocaleString(),
              inline: false
            }
          ]
        }).catch(console.error)
      }
      posthog.identify(cred.user.uid, { email: cred.user.email })
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
