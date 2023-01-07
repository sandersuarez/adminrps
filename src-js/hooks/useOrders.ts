import { ForbidReasons, SessionCheckType } from './useSession'
import Errors from '../shapes/Errors'
import Message from '../shapes/Message'
import { buildParametrizedUrl, useFetchWith } from './useFetch'
import { useState } from 'react'
import { DraftMessage, DraftMessageTypes } from './useDrafts'
import OrderShape from '../shapes/OrderShape'
import { assign } from 'lodash'

// noinspection SpellCheckingInspection
export interface GetOrders {
  Request: {
    telnamecustomer: string,
    orders_number: number,
    today: number,
  }
  Response:
    { orders: (OrderShape)[], pages: number }
    | { empty: string }
    | Errors
    | ForbidReasons
}

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
  const [collectiveMessage, setCollectiveMessage] = useState<OrderMessage>()
  const [orders, setOrders] = useState<OrderShape[]>()
  const [activePage, setActivePage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  // noinspection SpellCheckingInspection
  const { doRequest: doGetOrdersRequest } =
    useFetchWith.urlPlaceholders<GetOrders['Request'] & { page: number }, GetOrders['Response']>(
      buildParametrizedUrl
        `api/obtain_active_orders?telnamecustomer=${ 'telnamecustomer' }&page=${ 'page' }&
        orders_number=${ 'orders_number' }&today=${ 'today' }`,
    )

  const { doRequest: doAddOrderRequest } =
    useFetchWith.bodyParams<AddOrder['Request'], AddOrder['Response']>('api/add_order')

  const getOrders = (data: GetOrders['Request']) => {
    sessionCheck(() => {
      setCollectiveMessage(undefined)
      doGetOrdersRequest(assign(data, { page: activePage }))
        .then((res) => {

          if ('orders' in res && 'pages' in res) {
            setOrders(res['orders'])
            setTotalPages(res['pages'])
          }

          if ('empty' in res) {
            setOrders(undefined)
            setCollectiveMessage({ content: res['empty'], type: OrderMessageTypes.Info })
          }
          manageErrors(res, setCollectiveMessage)

        }).catch(reason => {
        setCollectiveMessage({ content: reason, type: OrderMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

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
    collectiveMessage,
    orders,
    activePage,
    totalPages,
    setIndividualMessage,
    setCollectiveMessage,
    setActivePage,
    getOrders,
    addOrder,
  }
}

export default useOrders