import { ForbidReasons, SessionCheckType } from './useSession'
import Errors from '../shapes/Errors'
import Message from '../shapes/Message'
import { useFetchWith } from './useFetch'
import { useState } from 'react'
import { DraftMessage, DraftMessageTypes } from './useDrafts'

// noinspection SpellCheckingInspection
export interface AddOrder {
  Request: { coddraft: number },
  Response:
    { success_message: string, codorder: number }
    | Errors
    | { overflow: string }
    | ForbidReasons
}

export enum OrderMessageTypes {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export type OrderMessage = Message<OrderMessageTypes>

/**
 * Hook that manages the orders' creation, modification and destruction using the crud api services.
 */
function useOrders(sessionCheck: SessionCheckType) {

  const [individualMessage, setIndividualMessage] = useState<OrderMessage>()

  const { doRequest: doAddOrderRequest } =
    useFetchWith.bodyParams<AddOrder['Request'], AddOrder['Response']>('api/add_order')

  const addOrder = (
    data: AddOrder['Request'],
    action: () => void,
    callback: (DraftMessage: DraftMessage | undefined) => void,
  ) => {
    sessionCheck(() => {
      callback(undefined)
      doAddOrderRequest(data).then(res => {

        // noinspection SpellCheckingInspection
        if ('success_message' in res && 'codorder' in res) {
          //setOrder(undefined)
          action()
        }

        if ('overflow' in res) {
          callback({ content: res['overflow'], type: DraftMessageTypes.Error })
        }

        if ('message' in res) {
          callback({ content: res['message'], type: DraftMessageTypes.Warning })
        }

        if ('error' in res) {
          callback({ content: res['error'], type: DraftMessageTypes.Error })
          if (console && console.error) {
            console.error(res['error'])
          }
        }

      }).catch(reason => {
        callback({ content: reason, type: DraftMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const manageErrors = (res: Errors | {}, callback: (OrderMessage: OrderMessage | undefined) => void) => {
    if ('message' in res) {
      callback({ content: res['message'], type: OrderMessageTypes.Warning })
    }

    if ('error' in res) {
      callback({ content: res['error'], type: OrderMessageTypes.Error })
      if (console && console.error) {
        console.error(res['error'])
      }
    }
  }

  return {
    individualMessage,
    setIndividualMessage,
    addOrder,
  }
}

export default useOrders