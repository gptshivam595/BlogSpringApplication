import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { getUsernameFromToken } from '../lib/token'

const TOKEN_KEY = 'blog_token'

function readToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readToken())
  const [currentUser, setCurrentUser] = useState(null)

  const isAuthenticated = useMemo(() => Boolean(token), [token])

  const hydrateCurrentUser = useCallback(async (targetToken) => {
    const email = getUsernameFromToken(targetToken)
    if (!email) {
      setCurrentUser(null)
      return null
    }

    const users = await api.getUsers(targetToken)
    const matchedUser = users.find((user) => user.email === email) || null
    setCurrentUser(matchedUser)
    return matchedUser
  }, [])

  const login = useCallback(async (payload) => {
    const result = await api.login(payload)
    saveToken(result.token)
    setToken(result.token)
    await hydrateCurrentUser(result.token)
    return result
  }, [hydrateCurrentUser])

  const register = useCallback(async (payload) => api.register(payload), [])

  const logout = useCallback(() => {
    removeToken()
    setToken('')
    setCurrentUser(null)
  }, [])

  const refreshCurrentUser = useCallback(async () => {
    if (!token) {
      setCurrentUser(null)
      return null
    }

    try {
      return await hydrateCurrentUser(token)
    } catch {
      setCurrentUser(null)
      return null
    }
  }, [hydrateCurrentUser, token])

  const value = useMemo(
    () => ({
      token,
      currentUser,
      isAuthenticated,
      login,
      register,
      logout,
      refreshCurrentUser,
      setCurrentUser,
    }),
    [currentUser, isAuthenticated, login, logout, refreshCurrentUser, register, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
