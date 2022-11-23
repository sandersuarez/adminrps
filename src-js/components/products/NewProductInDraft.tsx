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
import AmountInput from '../buttons/AmountInput'
import styled from '@emotion/styled'
import margins from '../../styles/margins'

const AmountFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  column-gap: ${ margins.mobile.lateral };
`

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
  const [minProductAmount] = useState<number>(1)
  const [draftProductAmount, setDraftProductAmount] = useState<number>(minProductAmount)

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
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    new FormData(e.currentTarget).forEach((entry, name) => {
      if (name === 'product-name') {
        setProductName(entry.toString())
      }
      if (name === 'product-price') {
        setProductPrice(entry.toString())
      }
    })

    validateSubmit([
      { name: 'product-name', value: productName, event: ValidEvents.Submit },
      { name: 'product-price', value: productPrice, event: ValidEvents.Submit },
    ])
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
        <div>
          <AmountFieldWrapper>
            <Label htmlFor={ 'draft-product-amount' }>{ 'Cantidad:' }</Label>
            <AmountInput
              pushNum={ setDraftProductAmount }
              max={ 32767 }
              initialNum={ minProductAmount }
              min={ minProductAmount }
            />
          </AmountFieldWrapper>
        </div>
        <Options>
          <Button customType={ ButtonTypes.Secondary } onClick={ back }>{ 'Atrás' }</Button>
        </Options>
      </Form>

    </article>
  )
}

export default NewProductInDraft