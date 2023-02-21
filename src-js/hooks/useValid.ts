import { useEffect, useState } from 'react'
import { assign, forEach, merge, unset } from 'lodash'

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
            assign(tmpErrors, { username: 'El nombre de usuario es obligatorio' })
          } else {
            unset(tmpErrors, 'username')
          }
          break

        case 'password':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            assign(tmpErrors, { password: 'La contraseña es obligatoria' })
          } else {
            unset(tmpErrors, 'password')
          }
          break

        case 'product-name':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            assign(tmpErrors, { productName: 'El nombre de producto es obligatorio' })
          } else {
            unset(tmpErrors, 'productName')
          }
          break

        case 'product-price':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            assign(tmpErrors, { productPrice: 'El precio de producto es obligatorio' })
          } else {
            if (!/^\d{1,3}[,.]\d{0,2}$|^\d{1,3}$/g.test(element.value) &&
              (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
              assign(tmpErrors, { productPrice: 'El precio de producto es inválido' })
            } else {
              unset(tmpErrors, 'productPrice')
            }
          }
          break

        case 'customer-name':
          if (element.value.length == 0 && element.event === ValidEvents.Submit) {
            assign(tmpErrors, { customerName: 'El nombre del cliente es obligatorio' })
          } else {
           unset(tmpErrors, 'customerName')
          }
          break

        case 'customer-phone':
          if (element.value.length == 0 && element.event === ValidEvents.Submit) {
            assign(tmpErrors, { customerPhone: 'El teléfono del cliente es obligatorio' })
          } else if (!/^[6-9](\d){8}$/g.test(element.value) && element.event === ValidEvents.Submit) {
            assign(tmpErrors, { customerPhone: 'El teléfono del cliente es inválido' })
          } else {
            unset(tmpErrors, 'customerPhone')
          }
          break

        case 'pick-up-time':
          if (element.value.length == 0 && element.event === ValidEvents.Submit) {
            assign(tmpErrors, { pickUpTime: 'La hora aproximada de recogida es obligatoria' })
          } else {
            unset(tmpErrors, 'pickUpTime')
          }
          break

        case 'products':
          if (element.value === '0' && element.event === ValidEvents.Submit) {
            assign(tmpErrors, { products: 'Un pedido debe contener como mínimo un producto' })
          } else {
            unset(tmpErrors, 'products')
          }
          break

        case 'given-money':
          if (element.value.length == 0 &&
            (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
            assign(tmpErrors, { givenMoney: 'El dinero entregado es obligatorio' })
          } else {
            if (!/^\d{1,3}[,.]\d{0,2}$|^\d{1,3}$/g.test(element.value) &&
              (element.event === ValidEvents.Submit || element.event === ValidEvents.Blur)) {
              assign(tmpErrors, { givenMoney: 'El formato de la cifra es inválida' })
            } else {
              unset(tmpErrors, 'givenMoney')
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
            assign(tmpErrors, { username: 'El nombre usuario o la contraseña son incorrectos' })
          } else {
            unset(tmpErrors, 'username')
          }
          break

        case 'password':
          if (element.value.length != 8) {
            assign(tmpErrors, { password: 'El nombre usuario o la contraseña son incorrectos' })
          } else {
            unset(tmpErrors, 'password')
          }
          break

        case 'product-name':
          if (element.value.length > 240) {
            assign(tmpErrors, { productName: 'El nombre de producto es inválido' })
          } else {
            unset(tmpErrors, 'productName')
          }
          break

        case 'customer-name':
          if (element.value.length > 60) {
            assign(tmpErrors, { customerName: 'El nombre del cliente es inválido' })
          } else {
            unset(tmpErrors, 'customerName')
          }
          break

        case 'customer-phone':
          if (element.value.length > 9) {
            assign(tmpErrors, { customerPhone: 'El teléfono del cliente es inválido' })
          } else {
            unset(tmpErrors, 'customerPhone')
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
    setValues(merge(values, { [field.name]: field.value }))
  }

  const commit = (fields: FieldsType[]) => {

    fields.forEach((field) => {
      setValues(merge(values, { [field.name]: field.value }))
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