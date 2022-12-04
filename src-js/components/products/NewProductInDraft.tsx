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
import Alert from '../Alert'
import { css } from '@emotion/react'
import AlertTypes from '../../shapes/AlertTypes'
import { AddProduct, ProductMessage, ProductMessageTypes } from '../../hooks/useProducts'
import { isUndefined } from 'lodash'
import { DraftProductReqData } from '../../shapes/ProductShape'
import breakpoints from '../../styles/breakpoints'

const Container = styled.article`
  ${ breakpoints.tablet } {
    h3 {
      margin-bottom: ${ margins.tablet.littleGap };
    }
    
    ${ Options } {
      margin-top: ${ margins.tablet.littleGap };
    }

    ${ Form } {
      flex-direction: row;
      flex-wrap: wrap;
      column-gap: ${ margins.tablet.bigLateral };

      ${ FieldWrapper } {
        flex-basis: 100%;
      }
    }
  }
`

const AmountFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  column-gap: ${ margins.mobile.gridSpace };

  ${ breakpoints.tablet } {
    margin-top: ${ margins.tablet.littleGap };
  }
`

interface IProps {
  changeSecondSidePanel: (panel: Panels) => void
  addProduct: (data: AddProduct['Request'], finalFunction?: (backValue?: number) => void) => void
  draftID: number | undefined
  message: ProductMessage | undefined
  setMessage: (message: ProductMessage | undefined) => void
  setNewProductToAdd: (product: DraftProductReqData | undefined) => void
}

const NewProductInDraft: FC<IProps> = (
  {
    changeSecondSidePanel,
    addProduct,
    draftID,
    message,
    setMessage,
    setNewProductToAdd,
  },
) => {

  const [productName, setProductName] = useState<string>('')
  const [productPrice, setProductPrice] = useState<string>('0,00')
  const [minProductAmount] = useState<number>(1)
  const [draftProductAmount, setDraftProductAmount] = useState<number>(minProductAmount)

  const doNewProductInDraft = () => {
    if (!isUndefined(draftID)) {
      // noinspection SpellCheckingInspection
      addProduct({
          nameproduct: values['product-name'],
          priceproduct: parseFloat(values['product-price'].replace(/,/, '.')),
        },
        (newProductID) => {
          changeSecondSidePanel(Panels.Products)

          if (!isUndefined(newProductID)) {
            // noinspection SpellCheckingInspection
            setNewProductToAdd({ codproduct: newProductID, amountproduct: draftProductAmount })
          }
        },
      )
    } else {
      setMessage({ content: 'There is no editing draft', type: ProductMessageTypes.Error })
    }
  }

  const {
    validateField,
    values,
    errors1,
    errors2,
    commit: validateSubmit,
  } = useValid(doNewProductInDraft)

  const handleChange: FormEventHandler<HTMLInputElement> = (e) => {
    e.persist()
    setMessage(undefined)

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
      let val
      let valAux = value.replace(/,/, '.')
      if (/^\d{4,6}/g.test(valAux)) {
        val = '999'
        if (valAux.indexOf('.') !== -1) {
          val = val + valAux.substring(valAux.indexOf('.'))
        }
      }
      if (/^\d\.\d{3,4}/g.test(valAux)) {
        val = valAux.substring(0, valAux.indexOf('.')) + valAux.substring(valAux.indexOf('.'), valAux.indexOf('.') + 3)
      }
      setProductPrice(val ? val : value)
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
    setMessage(undefined)
    changeSecondSidePanel(Panels.Products)
  }

  return (
    <Container>
      <h3>{ 'Añadir nuevo producto' }</h3>
      {
        message !== undefined && message.type === ProductMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      {
        message !== undefined && message.type === ProductMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
      <Form onSubmit={ handleSubmit } noValidate={ true }>
        {
          Object.values(errors2)[0] &&
          <Alert css={ css`margin-bottom: ${ margins.mobile.littleGap }` } message={ Object.values(errors2)[0] }
                 type={ AlertTypes.Warning } />
        }
        {
          message !== undefined && message.type === ProductMessageTypes.Info &&
          <Alert message={ message.content } type={ AlertTypes.Empty } />
        }
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
          <Button
            customType={ ButtonTypes.Primary }
            disabled={ Object.keys(values).length < 1 || Object.keys(errors1).length !== 0 }>
            { 'Añadir' }
          </Button>
        </Options>
      </Form>
    </Container>
  )
}

export default NewProductInDraft