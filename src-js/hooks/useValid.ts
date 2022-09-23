import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { forEach, omit } from 'lodash'

type FieldsType = { name: string; value: string; e?: FormEvent<HTMLInputElement> }[] | any[]

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

  const validate = (fields: FieldsType) => {
    if (validate1(fields)) {
      validate2(fields)
    }
  }

  /**
   * First stage validation
   */
  const validate1 = (fields: FieldsType) => {

    let tmpErrors = { ...errors1 }

    forEach(fields, (element) => {

      // If the event is from change, the second stage errors get reset
      if (element.e !== undefined && element.e.type === 'change') {
        setErrors2({})
      }

      switch (element.name) {
        case 'username':
          if (element.value.length == 0 && (element.e === undefined || element.e.type === 'blur')) {
            tmpErrors = {
              ...tmpErrors,
              username: 'El nombre de usuario es obligatorio',
            }
          } else {
            tmpErrors = omit(tmpErrors, 'username')
          }
          break

        case 'password':
          if (element.value.length == 0 && (element.e === undefined || element.e.type === 'blur')) {
            tmpErrors = {
              ...tmpErrors,
              password: 'La contraseña es obligatoria',
            }
          } else {
            tmpErrors = omit(tmpErrors, 'password')
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
  const validate2 = (fields: FieldsType) => {

    let tmpErrors = { ...errors2 }

    forEach(fields, (element) => {
      switch (element.name) {
        case 'username':
          if (element.e === undefined && element.value.length > 60) {
            tmpErrors = {
              ...tmpErrors,
              username: 'El nombre usuario o la contraseña son incorrectos',
            }
          } else {
            tmpErrors = omit(tmpErrors, 'username')
          }
          break

        case 'password':
          if (element.e === undefined && element.value.length != 8) {
            tmpErrors = {
              ...tmpErrors,
              password: 'El nombre usuario o la contraseña son incorrectos',
            }
          } else {
            tmpErrors = omit(tmpErrors, 'password')
          }
          break

        default:
          break
      }
    })

    // Commit changes
    setErrors2(tmpErrors)
  }

  const handleChange: FormEventHandler<HTMLInputElement> = (e) => {
    e.persist()

    let name = e.currentTarget.name
    let value = e.currentTarget.value

    validate1([{ name, value, e }])

    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (e) e.preventDefault()

    let fields: FieldsType = []

    new FormData(e.currentTarget).forEach((entryVal, name) => {
      let value = entryVal.toString()

      fields.push({ name, value })

      setValues({
        ...values,
        [name]: value,
      })
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
    handleChange,
    handleSubmit,
  }
}

export default useValid