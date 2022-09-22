import User from '../shapes/User'
import { useFetch, useFetchWith } from './useFetch'
import Message from '../shapes/Message'
import { useEffect, useRef, useState } from 'react'

export interface Login {
  Request: { username: string, key: string }
  Response: { user: User } | { message: string } | { error: string }
}

export interface Session {
  Response: { user: User } | { no_logged: string } | { forbidden: string } | { time: string }
}

export type SessionMessage = Message<'info' | 'warning' | 'error'>

/**
 * Hook that manages the app user session. Checks the session, creates one by the login method, and destroys it by
 * the logout method.
 */
function useSession() {
  const { doRequest: doSessionRequest } = useFetch<Session['Response']>('api/session_status')
  const { doRequest: doLoginRequest } = useFetchWith.bodyParams<Login['Request'], Login['Response']>('api/login')
  const { doRequest: doLogoutRequest } = useFetch('api/logout')

  const [user, setUser] = useState<User>()
  const [message, setMessage] = useState<SessionMessage>()
  const sessionInterval = useRef<number>()

  const sessionClear = () => {
    setUser(undefined)
    clearInterval(sessionInterval.current!)
    sessionInterval.current = undefined
  }

  const sessionCheck = () => {
    doSessionRequest().then(res => {
      if ('user' in res) {
        setUser(res['user'])
      } else {
        sessionClear()
        if ('time' in res) {
          setMessage({ content: res['time'], type: 'info' })
        } else if ('forbidden' in res) {
          setMessage({ content: res['forbidden'], type: 'error' })
        }
      }
    })
  }

  useEffect(() => {
    sessionCheck()
    sessionInterval.current = window.setInterval(sessionCheck, 60000)
    return sessionClear
  }, [])

  const login = (credentials: Login['Request']) => {
    setMessage(undefined)
    doLoginRequest(credentials).then(res => {
      if ('message' in res) {
        setMessage({ content: res['message'], type: 'warning' })
      } else if ('error' in res) {
        setMessage({ content: res['error'], type: 'error' })
      } else {
        setUser(res['user'])
      }
    })
  }

  const logout = () => doLogoutRequest()
    .then(() => setUser(undefined))

  const clearMessage = () => setMessage(undefined)

  return { user, message, login, logout, clearMessage }
}

export default useSession