import User from '../shapes/User'
import { useFetch, useFetchWith } from './useFetch'
import Message from '../shapes/Message'
import { useEffect, useRef, useState } from 'react'

export interface Login {
  Request: { username: string, key: string }
  Response: { user: User } | { message: string } | { error: string }
}

export type ForbidReasons = { no_logged: string } | { forbidden: string } | { time: string }

export interface Session {
  Response: { user: User } | ForbidReasons
}

export enum SessionMessageTypes {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export type SessionMessage = Message<SessionMessageTypes>
export type SessionCheckType = (action?: () => void) => void

/**
 * Hook that manages the app user session. Checks the session, creates one by the login method, and destroys it by
 * the logout method.
 */
function useSession() {
  const { doRequest: doSessionRequest } = useFetch<Session['Response']>('api/session_status')
  const { doRequest: doSessionRenewRequest } = useFetch<Session['Response']>('api/session_status_renew')
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

  const sessionCheck: SessionCheckType = (action) => {
    doSessionRequest().then(res => {
      handleSessionInfo(res)
      if (!('time' in res || 'forbidden' in res || 'error' in res) && action) {
        action()
      }
    })
      .catch(reason => {
        setUser(undefined)
        setMessage({ content: reason, type: SessionMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
  }

  const sessionRenew = () => {
    doSessionRenewRequest().then(res => handleSessionInfo(res))
      .catch(reason => {
        setUser(undefined)
        setMessage({ content: reason, type: SessionMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
  }

  const handleSessionInfo = (res: Session['Response']) => {
    if ('user' in res) {
      setUser(res['user'])
    } else {

      if ('time' in res) {
        sessionClear()
        setMessage({ content: res['time'], type: SessionMessageTypes.Info })
      }

      if ('forbidden' in res) {
        sessionClear()
        setMessage({ content: res['forbidden'], type: SessionMessageTypes.Error })
        if (console && console.error) {
          console.error(res['forbidden'])
        }
      }

      if ('error' in res) {
        setUser(undefined)
        setMessage({ content: res['error'], type: SessionMessageTypes.Error })
        if (console && console.error) {
          console.error(res['error'])
        }
      }
    }
  }

  const login = (credentials: Login['Request']) => {
    setMessage(undefined)
    doLoginRequest(credentials).then(res => {

      if ('message' in res) {
        setMessage({ content: res['message'], type: SessionMessageTypes.Warning })
      }

      if ('error' in res) {
        setMessage({ content: res['error'], type: SessionMessageTypes.Error })
        if (console && console.error) {
          console.error(res['error'])
        }
      }

      if ('already_session' in res) {
        sessionCheck()
      }

      if ('user' in res) {
        setUser(res['user'])
      }
    }).catch(reason => {
      setMessage({ content: reason, type: SessionMessageTypes.Error })
      if (console && console.error) {
        console.error(reason)
      }
    })
  }

  const logout = () => doLogoutRequest().then(sessionClear)

  useEffect(() => {
    sessionRenew()
    sessionInterval.current = window.setInterval(sessionCheck, 60000)
    return sessionClear
  }, [])

  return { user, message, login, sessionCheck, sessionRenew, logout }
}

export default useSession