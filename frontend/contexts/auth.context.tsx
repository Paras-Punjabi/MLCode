"use client"

import useAxios from "@/hooks/useAxios"
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useClerk,
  useUser,
} from "@clerk/nextjs"
import { SignOut, UserResource } from "@clerk/types"
import { AxiosError } from "axios"
import { createContext, useContext, useEffect } from "react"
import { toast } from "sonner"

const AuthContext = createContext<{
  signOut: SignOut;
  isSignedIn: boolean;
  user?: UserResource | null
}>({
  signOut: () => Promise.reject(
    new Error('AuthContext: signout called outside of AuthProvider')
  ),
  isSignedIn: false
})

const AuthProvider = (props: React.PropsWithChildren) => {
  const { sessionClaims, getToken } = useClerkAuth()
  const { signOut } = useClerk()
  const { isSignedIn, user } = useClerkUser()
  const [_, syncUser] = useAxios({
    url: '/auth/sync-user',
    method: 'PUT'
  }, { manual: true })

  const isMLCodeUser = sessionClaims?.metadata?.isMLCodeUser

  useEffect(() => {
    if (!isSignedIn || !!isMLCodeUser) return

    const sync = async () => {
      try {
        await syncUser()
        await getToken({ skipCache: true })
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message ?? 'An error occured while login. Please try again!')
          await signOut()
        }
      }
    }
    sync()
  }, [isSignedIn])

  return (
    <AuthContext.Provider value={{
      signOut,
      isSignedIn: !!isSignedIn && !!isMLCodeUser,
      user
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthContext)
  return auth
}

export default AuthProvider
