import { SessionCheckType, ForbidReasons } from './useSession'
import Message from '../shapes/Message'
import { buildParametrizedUrl, useFetch, useFetchWith } from './useFetch'
import { useState } from 'react'
import DraftShape, { DraftContent, DraftReqData } from '../shapes/DraftShape'
import Errors from '../shapes/Errors'

// noinspection SpellCheckingInspection
export interface AddDraft {
  Request: DraftReqData,
  Response:
    { success_message: string, coddraft: number }
    | Errors
    | { overflow: string }
    | ForbidReasons
}

export interface GetDrafts {
  Response:
    { drafts: (DraftShape & DraftContent)[] }
    | { empty: string }
    | Errors
    | ForbidReasons
}

// noinspection SpellCheckingInspection
export interface GetDraft {
  Request: { coddraft: number },
  Response:
    { draft: (DraftShape & DraftContent)[] }
    | Errors
    | ForbidReasons
}

// noinspection SpellCheckingInspection
export interface EditDraft {
  Request: { coddraft: number & DraftReqData },
  Response:
    { success_message: string }
    | Errors
}

// noinspection SpellCheckingInspection
export interface DeleteDraft {
  Request: { coddraft: number },
  Response:
    { success_message: string }
    | Errors
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
    useFetchWith.bodyParams<EditDraft['Request'], EditDraft['Response']>
    ('api/edit_draft', { method: 'PUT' })

  const { doRequest: doDeleteDraftRequest } =
    useFetchWith.bodyParams<DeleteDraft['Request'], DeleteDraft['Response']>
    ('api/delete_draft', { method: 'DELETE' })

  const [newDraftID, setNewDraftID] = useState<number>()
  const [individualMessage, setIndividualMessage] = useState<DraftMessage>()
  const [collectiveMessage, setCollectiveMessage] = useState<DraftMessage>()
  const [draft, setDraft] = useState<DraftShape & DraftContent>()
  const [drafts, setDrafts] = useState<(DraftShape & DraftContent)[]>()

  const addDraft = (data: AddDraft['Request']) => {
    sessionCheck(() => {
      setIndividualMessage(undefined)
      doAddDraftRequest(data).then(res => {

        if ('success_message' in res) {
          setDraft(undefined)
          // noinspection SpellCheckingInspection
          setNewDraftID(res['coddraft'])
          // noinspection SpellCheckingInspection
          getDraft(res['coddraft'])
        }

        if ('overflow' in res) {
          setIndividualMessage({ content: res['overflow'], type: DraftMessageTypes.Error })
        }
        manageErrors(res, setIndividualMessage)

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

        if ('empty' in res) {
          setCollectiveMessage({ content: res['empty'], type: DraftMessageTypes.Info })
        }
        manageErrors(res, setCollectiveMessage)

      }).catch(reason => {
        setCollectiveMessage({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
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
        manageErrors(res, setIndividualMessage)

      }).catch(reason => {
        setIndividualMessage({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const editDraft = (data: EditDraft['Request']) => {
    sessionCheck(() => {
      setIndividualMessage(undefined)
      doEditDraftRequest(data).then(res => {

        if ('success_message' in res) {
          setNewDraftID(undefined)
          getDraft(data.coddraft)
        }
        manageErrors(res, setIndividualMessage)

      }).catch(reason => {
        setIndividualMessage({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const deleteDraft = (data: DeleteDraft['Request']) => {
    sessionCheck(() => {
      setIndividualMessage(undefined)
      doDeleteDraftRequest(data).then(res => {

        if ('success_message' in res) {
          setNewDraftID(undefined)
          setDraft(undefined)
          getDrafts()
        }
        manageErrors(res, setIndividualMessage)

      }).catch(reason => {
        setIndividualMessage({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const manageErrors = (res: Errors | {}, callback: (DraftMessage: DraftMessage | undefined) => void) => {
    if ('message' in res) {
      callback({ content: res['message'], type: DraftMessageTypes.Warning })
    }

    if ('error' in res) {
      callback({ content: res['error'], type: DraftMessageTypes.Error })
      if (console && console.error) {
        console.error(res['error'])
      }
    }
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
    setIndividualMessage,
    addDraft,
    getDrafts,
    getDraft,
    editDraft,
    deleteDraft,
  }
}

export default useDrafts