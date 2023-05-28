import { useEffect, useState } from 'react'
import { type UserInfo } from '../types'
import { VITE_BACKEND_URL } from '../config/constants'

interface UseAuth {
  isLoading: boolean
  user: UserInfo | null
}

export const useAuth = (): UseAuth => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${VITE_BACKEND_URL}/api/userinfo`, {
      credentials: 'include',
    })
      .then(async (r) => await r.json())
      .then((data) => {
        setIsLoading(false)
        setUser(data)
      })
      .catch(() => {
        setIsLoading(false)
        setUser(null)
      })
  }, [])

  return {
    isLoading,
    user,
  }
}
