import { SessionCheckType, ForbidReasons } from './useSession'
import Message from '../shapes/Message'
import { buildParametrizedUrl, useFetch, useFetchWith } from './useFetch'
import { useState } from 'react'
import Draft, { DraftContent } from '../shapes/Draft'

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
    { draft: (Draft & DraftContent)[] }
    | { message: string }
    | { error: string }
    | ForbidReasons
}

// noinspection SpellCheckingInspection
export interface EditDraft {
  Request: { coddraft: number & DraftContent },
  Response:
    { success_message: string }
    | { message: string }
    | { error: string }
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
    buildParametrizedUrl`api/obtain_draft?coddraft=${ 'coddraft' }`,
  )

  const { doRequest: doEditDraftRequest } =
    useFetchWith.bodyParams<EditDraft['Request'], EditDraft['Response']>('api/edit_draft', { method: 'PUT' })

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
          setDraft(undefined)
          // noinspection SpellCheckingInspection
          setNewDraftID(res['coddraft'])
        }

        if ('message' in res) {
          setIndividualMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        }

        if ('error' in res) {
          setIndividualMessage({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        }

        if ('overflow' in res) {
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
        }

        if ('message' in res) {
          setCollectiveMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        }

        if ('empty' in res) {
          setCollectiveMessage({ content: res['empty'], type: DraftMessageTypes.Info })
        }

        if ('error' in res) {
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
          setDraft(res['draft'][0])
        }

        if ('message' in res) {
          setIndividualMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        }

        if ('error' in res) {
          setIndividualMessage({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        }
      })
    })
  }

  const editDraft = (data: EditDraft['Request']) => {
    sessionCheck(() => {
      setIndividualMessage(undefined)
      doEditDraftRequest(data).then(res => {
        console.log(res)
        if ('success_message' in res) {
          setNewDraftID(undefined)
          getDraft(data.coddraft)
        }

        if ('message' in res) {
          setIndividualMessage({ content: res['message'], type: DraftMessageTypes.Warning })
        }

        if ('error' in res) {
          setIndividualMessage({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        }
      }).catch(reason => {
        setIndividualMessage({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
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
    editDraft,
  }
}

export default useDrafts