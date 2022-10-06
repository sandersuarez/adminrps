import { SessionCheckType, ForbidReasons } from './useSession'
import Message from '../shapes/Message'
import { useFetchWith } from './useFetch'
import { useState } from 'react'

// noinspection SpellCheckingInspection
export type Draft = {
  coddraft: number,
  namecustomer?: string,
  telcustomer?: string,
}

// noinspection SpellCheckingInspection
export type DraftContent = {
  namecustomertmp?: string,
  telcustomertmp?: string,
  pickuptime?: string,
  codcustomer?: number,
  products?: { codproduct: number, amountproduct: number, }[],
}

// noinspection SpellCheckingInspection
export interface AddDraft {
  Request: DraftContent,
  Response:
    { success_message: string, coddraft: number }
    | { message: string }
    | { error: string }
    | { overflow: string }
    | ForbidReasons
}

// noinspection SpellCheckingInspection
export interface GetDraft {
  Request: { coddraft: number },
  Response:
    { draft: Draft & DraftContent }
    | { message: string }
    | { error: string }
    | ForbidReasons
}

export enum DraftMessageTypes {
  Warning = 'warning',
  Error = 'error',
}

export type DraftMessage = Message<DraftMessageTypes>

/**
 * Hook that manages the drafts' creation, modification and destruction using the crud api services.
 */
function useDrafts(sessionCheck: SessionCheckType) {
  const { doRequest: doAddDraftRequest } =
    useFetchWith.bodyParams<AddDraft['Request'], AddDraft['Response']>('api/add_draft')

  const [newDraftID, setNewDraftID] = useState<number>()
  const [message, setMessage] = useState<DraftMessage>()

  const addDraft = (data: AddDraft['Request']) => {
    sessionCheck(() => {
      setMessage(undefined)
      doAddDraftRequest(data).then(res => {
        if ('success_message' in res) {
          // noinspection SpellCheckingInspection
          setNewDraftID(res['coddraft'])
        } else if ('message' in res) {
          setMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        } else if ('error' in res) {
          setMessage({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        } else if ('overflow' in res) {
          setMessage({ content: res['overflow'], type: DraftMessageTypes.Error })
        }
      }).catch(reason => {
        setMessage({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const getDraft = () => {
    sessionCheck(() => {
      setMessage(undefined)

    })
  }

  return { newDraftID, message, addDraft }
}

export default useDrafts