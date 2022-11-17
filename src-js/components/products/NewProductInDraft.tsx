import React, { FC, FormEventHandler, MouseEventHandler, useState } from 'react'
import Panels from '../../shapes/Panels'
import ButtonTypes from '../../shapes/ButtonTypes'
import Button from '../buttons/Button'
import useValid, { ValidEvents } from '../../hooks/useValid'
import Form from '../forms/Form'
import Options from '../buttons/Options'
import Label from '../forms/Label'
import Input from '../forms/Input'
import InputMessage from '../forms/InputMessage'
import FieldWrapper from '../forms/FieldWrapper'

interface IProps {
  changeSecondSidePanel: (panel: Panels) => void
}

const NewProductInDraft: FC<IProps> = (
  {
    changeSecondSidePanel,
  },
) => {

  const [productName, setProductName] = useState<string>('')
  const [productPrice, setProductPrice] = useState<string>('0,00')
  const [draftProductAmount, setDraftProductAmount] = useState<number>(1)

  const doNewProductInDraft = () => {

  }

  const {
    validateField,
    values,
    errors1,
    errors2,
    setErrors2,
    commit: validateSubmit,
  } = useValid(doNewProductInDraft)

  const handleChange: FormEventHandler<HTMLInputElement> = (e) => {
    e.persist()

    const value = e.currentTarget.value
    const name = e.currentTarget.name

    let event
    if (e.type === 'change') {
      event = ValidEvents.Change
    }
    if (e.type === 'blur') {
      event = ValidEvents.Blur
    }

    if (name === 'product-name') {
      setProductName(value)
      validateField({ name: 'product-name', value: productName, event: event })
    }
    if (name === 'product-price') {
      setProductPrice(value)
      validateField({ name: 'product-price', value: productPrice, event: event })
    }
    if (name === 'draft-product-amount') {
      setDraftProductAmount(parseInt(value))
      validateField({ name: 'draft-product-amount', value: draftProductAmount.toString(), event: event })
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }

  const back: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    changeSecondSidePanel(Panels.Products)
  }

  return (
    <article>
      <h3>{ 'Añadir nuevo producto' }</h3>
      <Form onSubmit={ handleSubmit } noValidate={ true }>
        <FieldWrapper>
          <Label htmlFor={ 'product-name' }>{ 'Nombre:' }</Label>
          <div>
            <Input
              type={ 'text' }
              id={ 'product-name' }
              name={ 'product-name' }
              maxLength={ 240 }
              onChange={ handleChange }
              onBlur={ handleChange }
              valid={ errors1['productName'] === undefined }
              value={ productName }
            />
            <InputMessage message={ errors1['productName'] } />
          </div>
        </FieldWrapper>
        <FieldWrapper>
          <Label htmlFor={ 'product-price' }>{ 'Precio:' }</Label>
          <div>
            <Input
              type={ 'text' }
              id={ 'product-price' }
              name={ 'product-price' }
              maxLength={ 6 }
              onChange={ handleChange }
              onBlur={ handleChange }
              valid={ errors1['productPrice'] === undefined }
              value={ productPrice }
            />
            <InputMessage message={ errors1['productPrice'] } />
          </div>
        </FieldWrapper>
        <FieldWrapper>
          <Label htmlFor={ 'draft-product-amount' }>{ 'Cantidad:' }</Label>
          <div>
            <Input
              type={ 'number' }
              id={ 'draft-product-amount' }
              name={ 'draft-product-amount' }
              max={ 32767 }
              onChange={ handleChange }
              onBlur={ handleChange }
              valid={ errors1['draftProductAmount'] === undefined }
              value={ draftProductAmount }
            />
            <InputMessage message={ errors1['draftProductAmount'] } />
          </div>
        </FieldWrapper>
        <Options>
          <Button customType={ ButtonTypes.Secondary } onClick={ back }>{ 'Atrás' }</Button>
        </Options>
      </Form>

    </article>
  )
}

export default NewProductInDraft