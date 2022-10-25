import { ForbidReasons, SessionCheckType } from './useSession'
import CustomerShape from '../shapes/CustomerShape'
import { buildParametrizedUrl, useFetchWith } from './useFetch'
import Message from '../shapes/Message'
import { useState } from 'react'
import { assign } from 'lodash'
import Errors from '../shapes/Errors'

// noinspection SpellCheckingInspection
export interface GetCustomers {
  Request: {
    telname: string
    page: number
    customers_number: number
  }
  Response:
    { customers: CustomerShape[], pages: number }
    | Errors
    | ForbidReasons
}

export enum CustomerMessageTypes {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export type CustomerMessage = Message<CustomerMessageTypes>

/**
 * Hook that manages the customers' creation, modification and destruction using the crud api services.
 */
function useCustomers(sessionCheck: SessionCheckType) {

  // noinspection SpellCheckingInspection
  const { doRequest: doGetCustomerRequest } =
    useFetchWith.urlPlaceholders<GetCustomers['Request'], GetCustomers['Response']>(
      buildParametrizedUrl
        `api/obtain_customers?telname=${ 'telname' }&page=${ 'page' }&customers_number=${ 'customers_number' }`,
    )

  const [collectiveMessage, setCollectiveMessage] = useState<CustomerMessage>()
  const [customers, setCustomers] = useState<CustomerShape[]>()
  const [activePage, setActivePage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const getCustomers = (data: GetCustomers['Request']) => {
    sessionCheck(() => {
      setCollectiveMessage(undefined)
      doGetCustomerRequest(assign(data, { page: activePage }))
        .then((res) => {
          if ('customers' in res && 'pages' in res) {
            setCustomers(res['customers'])
            setTotalPages(res['pages'])
          }

          if ('empty' in res) {
            setCustomers(undefined)
            setTotalPages(1)
            setCollectiveMessage({ content: res['empty'], type: CustomerMessageTypes.Info })
          }
          manageErrors(res, setCollectiveMessage, () => {
            setCustomers(undefined)
            setTotalPages(1)
          })

        }).catch(reason => {
        setCollectiveMessage({ content: reason, type: CustomerMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const manageErrors = (
    res: Errors | {},
    callback: (CustomerMessage: CustomerMessage | undefined) => void,
    finalFunction?: () => void,
  ) => {

    if ('message' in res) {
      callback({ content: res['message'], type: CustomerMessageTypes.Warning })
    }

    if ('error' in res) {
      callback({ content: res['error'], type: CustomerMessageTypes.Error })
      if (console && console.error) {
        console.error(res['error'])
      }
    }

    if (('message' in res || 'error' in res) && finalFunction) {
      finalFunction()
    }
  }

  return {
    collectiveMessage,
    customers,
    activePage,
    totalPages,
    setCollectiveMessage,
    setActivePage,
    getCustomers,
  }
}

export default useCustomers