import { ForbidReasons, SessionCheckType } from './useSession'
import Message from '../shapes/Message'
import Errors from '../shapes/Errors'
import { useState } from 'react'
import ProductShape from '../shapes/ProductShape'
import { buildParametrizedUrl, useFetchWith } from './useFetch'
import { assign } from 'lodash'

// noinspection SpellCheckingInspection
export interface GetProducts {
  Request: {
    name: string,
    page: number,
    products_number: number,
  }
  Response:
    { products: ProductShape[], pages: number }
    | Errors
    | ForbidReasons
}

export enum ProductMessageTypes {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export type ProductMessage = Message<ProductMessageTypes>

/**
 * Hook that manages the customers' creation, modification and destruction using the crud api services.
 */
function useProducts(sessionCheck: SessionCheckType) {

  // noinspection SpellCheckingInspection
  const { doRequest: doGetProductsRequest } =
    useFetchWith.urlPlaceholders<GetProducts['Request'], GetProducts['Response']>(
      buildParametrizedUrl
        `api/obtain_products?name=${ 'name' }&page=${ 'page' }&customers_number=${ 'products_number' }`,
    )

  const [collectiveMessage, setCollectiveMessage] = useState<ProductMessage>()
  const [products, setProducts] = useState<ProductShape[]>()
  const [activePage, setActivePage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const getProducts = (data: GetProducts['Request']) => {
    sessionCheck(() => {
      setCollectiveMessage(undefined)
      doGetProductsRequest(assign(data, { page: activePage }))
        .then((res) => {

          if ('products' in res && 'pages' in res) {
            setProducts(res['products'])
            setTotalPages(res['pages'])
          }

          if ('empty' in res) {
            setProducts(undefined)
            setTotalPages(1)
            setCollectiveMessage({ content: res['empty'], type: ProductMessageTypes.Info })
          }
          manageErrors(res, setCollectiveMessage, () => {
            setProducts(undefined)
            setTotalPages(1)
          })

        }).catch(reason => {
        setCollectiveMessage({ content: reason, type: ProductMessageTypes.Error })
        if (console && console.error) {
          console.error(reason)
        }
      })
    })
  }

  const manageErrors = (
    res: Errors | {},
    callback: (ProductMessage: ProductMessage | undefined) => void,
    finalFunction?: () => void,
  ) => {

    if ('message' in res) {
      callback({ content: res['message'], type: ProductMessageTypes.Warning })
    }

    if ('error' in res) {
      callback({ content: res['error'], type: ProductMessageTypes.Error })
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
    products,
    activePage,
    totalPages,
    setCollectiveMessage,
    setActivePage,
    getProducts,
  }
}

export default useProducts