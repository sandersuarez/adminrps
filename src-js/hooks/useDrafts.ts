import { SessionCheckType, ForbidReasons } from './useSession'
import Message from '../shapes/Message'
import { buildParametrizedUrl, useFetch, useFetchWith } from './useFetch'
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

export interface GetDrafts {
  Response:
    { drafts: (Draft & DraftContent)[] }
    | { message: string }
    | { error: string }
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
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export type DraftMessage = Message<DraftMessageTypes>

/**
 * Hook that manages the drafts' creation, modification and destruction using the crud api services.
 */
function useDrafts(sessionCheck: SessionCheckType) {

  const { doRequest: doAddDraftRequest, pending: addingDraft } =
    useFetchWith.bodyParams<AddDraft['Request'], AddDraft['Response']>('api/add_draft')

  const { doRequest: doGetDraftsRequest } = useFetch<GetDrafts['Response']>('api/obtain_drafts')

  // noinspection SpellCheckingInspection
  const { doRequest: doGetDraftRequest } = useFetchWith.urlPlaceholders<GetDraft['Request'], GetDraft['Response']>(
    buildParametrizedUrl`api/obtain_draft/${ 'coddraft' }`,
  )

  const [newDraftID, setNewDraftID] = useState<number>()
  const [individualMessage, setIndividualMessage] = useState<DraftMessage>()
  const [collectiveMessage, setCollectiveMessage] = useState<DraftMessage>()
  const [draft, setDraft] = useState<Draft & DraftContent>()
  const [drafts, setDrafts] = useState<(Draft & DraftContent)[]>()

  const addDraft = (data: AddDraft['Request']) => {
    sessionCheck(() => {
      setIndividualMessage(undefined)
      doAddDraftRequest(data).then(res => {
        if ('success_message' in res) {
          // noinspection SpellCheckingInspection
          setNewDraftID(res['coddraft'])
        } else if ('message' in res) {
          setIndividualMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        } else if ('error' in res) {
          setIndividualMessage({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        } else if ('overflow' in res) {
          setIndividualMessage({ content: res['overflow'], type: DraftMessageTypes.Error })
        }
      }).catch(reason => {
        setIndividualMessage({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const getDrafts = () => {
    sessionCheck(() => {
      setCollectiveMessage(undefined)
      doGetDraftsRequest().then((res) => {
        if ('drafts' in res) {
          setDrafts(res['drafts'])
        } else if ('message' in res) {
          setCollectiveMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        } else if ('empty' in res) {
          setCollectiveMessage({ content: res['empty'], type: DraftMessageTypes.Info })
        } else if ('error' in res) {
          setCollectiveMessage({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        }
      })
    })
  }

  const getDraft = (draftID: number) => {
    sessionCheck(() => {
      setIndividualMessage(undefined)
      // noinspection SpellCheckingInspection
      doGetDraftRequest({ coddraft: draftID }).then((res) => {
        if ('draft' in res) {
          setNewDraftID(undefined)
          setDraft(res['draft'])
        } else if ('message' in res) {
          setIndividualMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        } else if ('error' in res) {
          setIndividualMessage({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        }
      })
    })
  }

  return {
    newDraftID,
    individualMessage,
    collectiveMessage,
    draft,
    addingDraft,
    drafts,
    setNewDraftID,
    setCollectiveMessage,
    addDraft,
    getDrafts,
    getDraft,
  }
}

export default useDrafts