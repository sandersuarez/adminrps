import { FormEvent, FormEventHandler, useState } from 'react'
import { omit } from 'lodash'

/**
 * Hook that works as a utility to validate data.
 */
const useValid = (callback: () => void) => {
  const [values, setValues] = useState<{ [name: string]: string }>({})
  const [errors, setErrors] = useState<{ [name: string]: string }>({})

  const validate = (e:FormEvent<HTMLInputElement>, name: string, value: string) => {
    switch (name) {
      case 'username':
        if (value.length == 0 && e.type === 'blur') {
          setErrors({
            ...errors,
            username: 'El nombre de usuario es obligatorio',
          })
        } else {
          let newObj = omit(errors, 'username')
          setErrors(newObj)
        }
        break

      default:
        break
    }
  }

  const handleChange: FormEventHandler<HTMLInputElement> = (e) => {
    e.persist()

    let name = e.currentTarget.name
    let val = e.currentTarget.value

    validate(e, name, val)

    setValues({
      ...values,
      [name]: val,
    })
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (e) e.preventDefault()

    if (Object.keys(errors).length === 0 && Object.keys(values).length !== 0) {
      callback()
    } else {
      alert('There is an Error!')
    }
  }

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  }
}

export default useValid