import { useEffect, useState } from 'react'
import { assign, forEach, omit } from 'lodash'

export enum ValidEvents { Change = 'Change', Blur = 'Blur', Submit = 'Submit'}

type FieldsType = { name: string, value: string, event?: ValidEvents }

/**
 * Hook that works as a utility to validate data.
 */
const useValid = (callback: () => void) => {
  const [values, setValues] = useState<{ [name: string]: string }>({})
  const [errors1, setErrors1] = useState<{ [name: string]: string }>({})
  const [errors2, setErrors2] = useState<{ [name: string]: string }>({})
  const [submitState, setSubmitState] = useState<boolean>(false)

  useEffect(() => {
    if (submitState) {
      if (Object.keys(errors1).length === 0 && Object.keys(errors2).length === 0 && Object.keys(values).length !== 0) {
        callback()
      }
      setSubmitState(false)
    }
  }, [values, errors2, submitState])

  const validate = (fields: FieldsType[]) => {
    if (validate1(fields)) {
      validate2(fields)
    }
  }

  /**
   * First stage validation
   */
  const validate1 = (fields: FieldsType[]) => {

    let tmpErrors = { ...errors1 }

    forEach(fields, (element) => {

      // If the event is from change, the second stage errors get reset
      if (element.event === ValidEvents.Change) {
        setErrors2({})
      }

      switch (element.name) {
        case 'username':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            tmpErrors = assign(tmpErrors, { username: 'El nombre de usuario es obligatorio' })
          } else {
            tmpErrors = omit(tmpErrors, 'username')
          }
          break

        case 'password':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            tmpErrors = assign(tmpErrors, { password: 'La contraseña es obligatoria' })
          } else {
            tmpErrors = omit(tmpErrors, 'password')
          }
          break

        case 'product-name':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            tmpErrors = assign(tmpErrors, { productName: 'El nombre de producto es obligatorio' })
          } else {
            tmpErrors = omit(tmpErrors, 'productName')
          }
          break

        case 'product-price':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            tmpErrors = assign(tmpErrors, { productPrice: 'El precio de producto es obligatorio' })
          } else {
            if (!/^\d{1,3}[,.]\d{0,2}$|^\d{1,3}$/g.test(element.value) &&
              (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
              tmpErrors = assign(tmpErrors, { productPrice: 'El precio de producto es inválido' })
            } else {
              tmpErrors = omit(tmpErrors, 'productPrice')
            }
          }
          break

        default:
          break
      }
    })

    // Commit changes
    setErrors1(tmpErrors)

    return Object.keys(tmpErrors).length === 0
  }

  /**
   * Second stage validation
   */
  const validate2 = (fields: FieldsType[]) => {

    let tmpErrors = { ...errors2 }

    forEach(fields, (element) => {
      switch (element.name) {
        case 'username':
          if (element.value.length > 60) {
            tmpErrors = assign(tmpErrors, { username: 'El nombre usuario o la contraseña son incorrectos' })
          } else {
            tmpErrors = omit(tmpErrors, 'username')
          }
          break

        case 'password':
          if (element.value.length != 8) {
            tmpErrors = assign(tmpErrors, { password: 'El nombre usuario o la contraseña son incorrectos' })
          } else {
            tmpErrors = omit(tmpErrors, 'password')
          }
          break

        case 'product-name':
          if (element.value.length > 240) {
            tmpErrors = assign(tmpErrors, { productName: 'El nombre de producto es inválido' })
          } else {
            tmpErrors = omit(tmpErrors, 'productName')
          }
          break

        default:
          break
      }
    })

    // Commit changes
    setErrors2(tmpErrors)
  }

  const validateField = (field: FieldsType) => {
    validate1([field])
    setValues(assign(values, { [field.name]: field.value }))
  }

  const commit = (fields: FieldsType[]) => {

    fields.forEach((field) => {
      setValues(assign(values, { [field.name]: field.value }))
    })

    validate(fields)
    setSubmitState(true)
  }

  return {
    values,
    errors1,
    errors2,
    setErrors1,
    setErrors2,
    validateField,
    commit,
  }
}

export default useValid