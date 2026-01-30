"use client"

import { createContext, useContext } from "react"

const AuthContext = createContext(null)

const AuthProvider = (props: React.PropsWithChildren) => {
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
