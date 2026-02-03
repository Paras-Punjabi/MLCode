"use client"

import axios from "@/configs/axios.config"
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useClerk,
} from "@clerk/nextjs"
import { AxiosError } from "axios"
import { createContext, useContext, useEffect } from "react"
import { toast } from "sonner"

const AuthContext = createContext(null)

const AuthProvider = (props: React.PropsWithChildren) => {
  const { sessionClaims } = useClerkAuth()
  const { signOut } = useClerk()
  const { isSignedIn } = useClerkUser()

  useEffect(() => {
    if (!isSignedIn || !!sessionClaims?.metadata.isMLCodeUser) return

    const sync = async () => {
      try {
        await axios.put('/auth/sync-user')
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error('An error occured while login. Please try again!')
          signOut()
        }
      }
    }
    sync()
  }, [isSignedIn])

  return (
    <AuthContext.Provider value={null}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthContext)
  return auth
}

export default AuthProvider
