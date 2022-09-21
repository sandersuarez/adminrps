import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { forEach, omit } from 'lodash'

type FieldsType = { name: string; value: string; e?: FormEvent<HTMLInputElement> }[] | any[]

/**
 * Hook that works as a utility to validate data.
 */
const useValid = (callback: () => void) => {
  const [values, setValues] = useState<{ [name: string]: string }>({})
  const [errors, setErrors] = useState<{ [name: string]: string }>({})
  const [submitState, setSubmitState] = useState<boolean>(false)

  useEffect(() => {
    if (submitState) {
      if (Object.keys(errors).length === 0 && Object.keys(values).length !== 0) {
        callback()
      }
      setSubmitState(false)
    }
  }, [values, errors, submitState])

  const validate = (fields: FieldsType) => {

    let tmpErrors = { ...errors }

    forEach(fields, (element) => {

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

            if (element.e === undefined && element.value.length != 8) {
              tmpErrors = {
                ...tmpErrors,
                form: 'La contraseña es incorrecta',
              }
            } else {
              tmpErrors = omit(tmpErrors, 'form')
            }
          }

          break

        default:
          break
      }
    })

    // Commit changes
    setErrors(tmpErrors)
  }

  const handleChange: FormEventHandler<HTMLInputElement> = (e) => {
    e.persist()

    let name = e.currentTarget.name
    let value = e.currentTarget.value

    validate([{ name, value, e }])

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
    errors,
    setErrors,
    handleChange,
    handleSubmit,
  }
}

export default useValid