import { useState } from 'react'

async function baseDoRequest<R>(url: string, requestProps: RequestInit = {}): Promise<R> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...requestProps,
  })
  const text = await response.text()
  return JSON.parse(text) as R
}

function useApiBase<R>() {
  const [pending, setPending] = useState(false)

  function doRequest(url: string, requestProps: RequestInit = {}) {
    setPending(true)
    return baseDoRequest<R>(url, requestProps)
      .then(result => {
        setPending(false)
        return result
      })
  }

  return { doRequest, pending }
}

export function useFetch<R>(url: string, requestProps: RequestInit = {}) {
  const { doRequest: hookDoRequest, pending } = useApiBase<R>()
  const doRequest = () => hookDoRequest(url, requestProps)
  return { doRequest, pending }
}

export type ParametrizedUrl<P> = (params: P) => string

export function buildParametrizedUrl<P>(url: TemplateStringsArray, ...tParams: Extract<keyof P, string>[]) {
  return (params: P) => tParams.reduce((prev, curr, i) => prev + params[curr] + url[i + 1], url[0])
}

export const useFetchWith = {
  bodyParams<P, R = void>(url: string, requestProps: RequestInit = {}) {
    const { doRequest: hookDoRequest, pending } = useApiBase<R>()
    const doRequest = (params: P) => hookDoRequest(url, {
      method: 'POST',
      body: JSON.stringify(params),
      ...requestProps,
    })
    return { doRequest, pending }
  },

  urlPlaceholders<P, R = void>(paramUrl: ParametrizedUrl<P>, requestProps: RequestInit = {}) {
    const { doRequest: hookDoRequest, pending } = useApiBase<R>()
    const doRequest = (params: P) => hookDoRequest(paramUrl(params), requestProps)
    return { doRequest, pending }
  },
}
