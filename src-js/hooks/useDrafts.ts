import { ForbidReasons } from './useSession'
import Message from '../shapes/Message'
import { useFetchWith } from './useFetch'
import { useState } from 'react'

// noinspection SpellCheckingInspection
export type Draft = {
  namecustomertmp?: string,
  telcustomertmp?: string,
  pickuptime?: string,
  codcustomer?: number,
  products?: { codproduct: number, amountproduct: number, }[],
}

// noinspection SpellCheckingInspection
export interface AddDraft {
  Request: Draft,
  Response:
    { success_message: string, coddraft: number }
    | { message: string }
    | { error: string }
    | { overflow: string }
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
function useDrafts() {
  const { doRequest: doAddDraftRequest } =
    useFetchWith.bodyParams<AddDraft['Request'], AddDraft['Response']>('api/add_draft')

  const [draftID, setDraftID] = useState<number>()
  const [message, setMessage] = useState<DraftMessage>()

  const addDraft = (data: AddDraft['Request']) => {
    setMessage(undefined)
    doAddDraftRequest(data).then(res => {

    }).catch(reason => {
      setMessage({ content: reason, type: DraftMessageTypes.Error })
      if (console && console.error) {
        console.error(reason)
      }
    })
  }
}

export default useDrafts