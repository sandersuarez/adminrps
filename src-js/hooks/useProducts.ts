import { ForbidReasons, SessionCheckType } from './useSession'
import Message from '../shapes/Message'
import Errors from '../shapes/Errors'
import { useState } from 'react'
import ProductShape from '../shapes/ProductShape'
import { buildParametrizedUrl, useFetchWith } from './useFetch'
import { assign, isUndefined } from 'lodash'
import { EditDraft } from './useDrafts'

// noinspection SpellCheckingInspection
export interface GetProducts {
  Request: {
    name: string,
    products_number: number,
  }
  Response:
    { products: ProductShape[], pages: number }
    | { empty: string }
    | Errors
    | ForbidReasons
}

// noinspection SpellCheckingInspection
export interface AddProduct {
  Request: {
    nameproduct: string,
    priceproduct: number,
    stockproduct?: number,
  }
  Response:
    { success_message: string, codproduct: number }
    | { overflow: string }
    | Errors
    | ForbidReasons
}

export enum ProductMessageTypes {
  Success = 'Success',
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
    useFetchWith.urlPlaceholders<GetProducts['Request'] & { page: number }, GetProducts['Response']>(
      buildParametrizedUrl
        `api/obtain_products?name=${ 'name' }&page=${ 'page' }&products_number=${ 'products_number' }`,
    )

  // noinspection SpellCheckingInspection
  const { doRequest: doAddProductRequest } =
    useFetchWith.bodyParams<AddProduct['Request'], AddProduct['Response']>('api/add_product')

  const [collectiveMessage, setCollectiveMessage] = useState<ProductMessage>()
  const [individualMessage, setIndividualMessage] = useState<ProductMessage>()
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

  const addProduct = (
    data: AddProduct['Request'],
    finalFunction?: () => void,
    addProductToDraft?: {
      callback: (data: EditDraft['Request']) => void,
      editDraftData: EditDraft['Request'],
      amount: number
    },
  ) => {
    sessionCheck(() => {
      setCollectiveMessage(undefined)
      doAddProductRequest(data)
        .then((res) => {

          // noinspection SpellCheckingInspection
          if ('success_message' in res && 'codproduct' in res) {

            setIndividualMessage({ content: res['success_message'], type: ProductMessageTypes.Success })
            if (!isUndefined(finalFunction)) {
              finalFunction()
            }

            if (!isUndefined(addProductToDraft)) {
              // noinspection SpellCheckingInspection
              assign(addProductToDraft.editDraftData,
                { products: [{ codproduct: res['codproduct'], amountproduct: addProductToDraft.amount }] })
              addProductToDraft.callback(addProductToDraft.editDraftData)
            }
          }

          if ('overflow' in res) {
            setIndividualMessage({ content: res['overflow'], type: ProductMessageTypes.Info })
          }
          manageErrors(res, setIndividualMessage)

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
    individualMessage,
    products,
    activePage,
    totalPages,
    setCollectiveMessage,
    setIndividualMessage,
    setActivePage,
    getProducts,
    addProduct,
  }
}

export default useProducts