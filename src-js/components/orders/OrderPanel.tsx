import React, { FC, FormEventHandler, useEffect, useState } from 'react'
import OrderProductsTable from './OrderProductsTable'
import margins from '../../styles/margins'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Form from '../forms/Form'
import Label from '../forms/Label'
import Input from '../forms/Input'
import { css } from '@emotion/react'
import Options from '../buttons/Options'
import TitleWrapper from '../TitleWrapper'
import ExitButton from '../buttons/ExitButton'
import FieldWrapper from '../forms/FieldWrapper'
import { DraftMessageTypes, EditDraft } from '../../hooks/useDrafts'
import { assign, isEqual, replace } from 'lodash'
import Panels from '../../shapes/Panels'
import { OrderMessage, OrderMessageTypes } from '../../hooks/useOrders'
import OrderShape from '../../shapes/OrderShape'
import Panel from '../Panel'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import useValid, { ValidEvents } from '../../hooks/useValid'
import InputMessage from '../forms/InputMessage'
import NormalFontSpan from '../NormalFontSpan'
import Alert from '../Alert'
import AlertTypes from '../../shapes/AlertTypes'

const P = styled.p`

  &:first-of-type {
    margin-bottom: .5em;
  }

  span {
    margin-left: .5em;
  }
`

const formStyles = css`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${ margins.mobile.vertical };

  div {
    flex-grow: 1;
  }

  ${ breakpoints.tablet } {
    margin-top: ${ margins.tablet.gridSpace };
  }
}
`

interface OrderSectionProps {
  handleCloseSidePanel: () => void
  handleOpenSecondSidePanel: () => void
  changeSecondSidePanel: (panel: Panels) => void
  message: OrderMessage | undefined
  setMessage: (message: OrderMessage | undefined) => void
  order: OrderShape | undefined
}

const OrderPanel: FC<OrderSectionProps> = (
  {
    handleCloseSidePanel,
    handleOpenSecondSidePanel,
    changeSecondSidePanel,
    message,
    setMessage,
    order,
  }) => {

  const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

  const [customerName, setCustomerName] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [pickUpTime, setPickUpTime] = useState<string>('')
  const [editMode, setEditMode] = React.useState<boolean>(false)

  // noinspection SpellCheckingInspection
  const [total, setTotal] = useState<number>(order !== undefined ?
    order.products.reduce((acc, product) => {
      return acc + parseFloat(product.priceproduct) * product.amountproductorder
    }, 0)
    : 0,
  )

  const calculateExchange = () => {

    if (order === undefined) {
      return '0,00'
    }

    let givenMoneyStandard = replace(givenMoney, /,/g, '.')
    let givenMoneyNumeric = Number.parseFloat(givenMoneyStandard)

    if (isNaN(givenMoneyNumeric)) {
      return formatter.format(0)
    }

    return formatter.format(givenMoneyNumeric - total)
  }

  const [givenMoney, setGivenMoney] = useState<string>('0,00')
  const [exchange, setExchange] = useState<string>('0,00 €')

  const handleExitClick = () => {
    setEditMode(false)
  }

  const handleEditClick = () => {
    setEditMode(true)
  }

  const {
    validateField,
    errors1,
    commit: validateSubmit,
  } = useValid(() => {

  })

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

    if (name === 'given-money') {
      setGivenMoney(value)
      validateField({ name: 'given-money', value: givenMoney, event: event })
    }
  }

  const handleSubmitEditOrder: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }

  const handleSubmitCloseOrder: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    validateSubmit([{ name: 'given-money', value: givenMoney, event: ValidEvents.Submit }])
  }

  const doUpdateDraft = (addAnyway: boolean = false) => {

    // noinspection SpellCheckingInspection
    let data: EditDraft['Request'] = { coddraft: 0 }
    let modified = false

    let customerNameTrimmed: null | string = customerName.trim()
    let customerPhoneTrimmed: null | string = customerPhone.trim()
    customerNameTrimmed = customerNameTrimmed === '' ? null : customerNameTrimmed
    customerPhoneTrimmed = customerPhoneTrimmed === '' ? null : customerPhoneTrimmed

    let pickUpTimeSet = pickUpTime === '' ? null : pickUpTime

    if (newDraftID !== undefined) {
      // noinspection SpellCheckingInspection
      assign(data, { coddraft: newDraftID })

      if (customerNameTrimmed !== null || customerPhoneTrimmed !== null || pickUpTimeSet !== null) {

        if (customerNameTrimmed !== null) {
          // noinspection SpellCheckingInspection
          assign(data, { namecustomertmp: customerNameTrimmed })
        }

        if (customerPhoneTrimmed !== null) {
          // noinspection SpellCheckingInspection
          assign(data, { telcustomertmp: customerPhoneTrimmed })
        }

        if (pickUpTimeSet !== null) {
          // noinspection SpellCheckingInspection
          assign(data, { pickuptime: pickUpTime })
        }

        modified = true
      }

      if (draftProducts !== undefined && draftProducts.length > 0) {
        // noinspection SpellCheckingInspection
        assign(data, { products: draftProducts })
        modified = true
      }
    }

    if (draft !== undefined) {
      // noinspection SpellCheckingInspection
      assign(data, { coddraft: draft.coddraft })

      if (draft.codcustomer === null) {
        if (draft.namecustomertmp !== customerNameTrimmed) {
          // noinspection SpellCheckingInspection
          assign(data, { namecustomertmp: customerNameTrimmed })
          modified = true
        }

        if (draft.telcustomertmp !== customerPhoneTrimmed) {
          // noinspection SpellCheckingInspection
          assign(data, { telcustomertmp: customerPhoneTrimmed })
          modified = true
        }

        if (draftCustomerID !== undefined) {
          // noinspection SpellCheckingInspection
          assign(data, { namecustomertmp: '', telcustomertmp: '', codcustomer: draftCustomerID })
          modified = true
        }
      } else {
        if (draft.codcustomer !== draftCustomerID) {
          // noinspection SpellCheckingInspection
          assign(data, { codcustomer: draftCustomerID === undefined ? 0 : draftCustomerID })
          modified = true
        }
      }

      if (draft.pickuptime !== pickUpTimeSet) {
        // noinspection SpellCheckingInspection
        assign(data, { pickuptime: pickUpTimeSet })
        modified = true
      }

      let previousProducts = draft?.products?.map(product => {
        // noinspection SpellCheckingInspection
        return { codproduct: product.codproduct, amountproduct: product.amountproductdraft }
      })

      if (!isEqual(draftProducts, previousProducts)) {
        // noinspection SpellCheckingInspection
        assign(data, { products: draftProducts === undefined ? [] : draftProducts })
        modified = true
      }
    }

    if (modified) {
      editDraft(data)
    }
  }

  useEffect(() => {
    if (order !== undefined) {
      setTotal(order.products !== undefined ?
        order.products.reduce((acc, product) => {
          return acc + parseFloat(product.priceproduct) * product.amountproductorder
        }, 0)
        : 0,
      )
    }
  }, [order])

  useEffect(() => {
    setExchange(calculateExchange())
  }, [total, givenMoney])

  useEffect(() => {
    validateField({ name: 'exchange', value: exchange, event: ValidEvents.Change })
  }, [exchange])

  return (
    <Panel>
      <TitleWrapper>
        <h2>{ 'Pedido ' + (order !== undefined ? order.numdayorder : '') }</h2>
        <ExitButton onClick={ close }>
          <i className={ 'bi bi-x' } />
        </ExitButton>
      </TitleWrapper>
      {
        message !== undefined && message.type === OrderMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
      {
        message !== undefined && message.type === OrderMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      {
        order !== undefined &&
        (
          editMode ?
            <>
              <Form onSubmit={ handleSubmitEditOrder }>
                <FieldWrapper>
                  <Label htmlFor={ 'customer-name' }>{ 'Nombre del cliente:' }</Label>
                  <Input
                    type={ 'text' }
                    name={ 'customer-name' }
                    id={ 'customer-name' }
                    maxLength={ 60 }
                    onChange={ handleChange }
                    onBlur={ handleChange }
                    value={ customerName }
                    disabled={ disableCustomerInputs }
                    valid={ errors1['customerName'] === undefined }
                  />
                  <InputMessage message={ errors1['customerName'] } />
                </FieldWrapper>
                <FieldWrapper>
                  <Label htmlFor={ 'customer-phone' }>{ 'Teléfono del cliente:' }</Label>
                  <Input
                    type={ 'tel' }
                    name={ 'customer-phone' }
                    id={ 'customer-phone' }
                    maxLength={ 9 }
                    onChange={ handleChange }
                    onBlur={ handleChange }
                    value={ customerPhone }
                    disabled={ disableCustomerInputs }
                    valid={ errors1['customerPhone'] === undefined }
                  />
                  <InputMessage message={ errors1['customerPhone'] } />
                </FieldWrapper>
                <Options>
                  <Button
                    customType={ ButtonTypes.Primary }
                    onClick={ searchCustomer }
                  >
                    { 'Buscar cliente' }
                  </Button>
                  {
                    disableCustomerInputs &&
                    <Button customType={ ButtonTypes.Primary } onClick={ resetCustomer }>{ 'Nuevo cliente' }</Button>
                  }
                </Options>
                <OrderProductsTable draftProducts={ draft?.products } css={ css`max-width: 75rem` } />
                <InputMessage message={ errors1['products'] } />
                <Button customType={ ButtonTypes.Primary }
                        onClick={ searchProducts }>{ 'Seleccionar productos' }</Button>
                <FieldWrapper css={ hourFieldStyles }>
                  <Label htmlFor={ 'pick-up-time' }>{ 'Hora aproximada de recogida:' }</Label>
                  <Input
                    type={ 'time' }
                    name={ 'pick-up-time' }
                    id={ 'pick-up-time' }
                    value={ pickUpTime }
                    onChange={ handleChange }
                    onBlur={ handleChange }
                    valid={ errors1['pickUpTime'] === undefined }
                  />
                  <InputMessage message={ errors1['pickUpTime'] } />
                </FieldWrapper>
                <Options>
                  {
                    draft !== undefined &&
                    <Button
                      customType={ ButtonTypes.Danger }
                      onClick={ (e) => {
                        e.preventDefault()
                        openDeleteModal()
                      } }
                    >
                      { 'Eliminar borrador' }
                    </Button>
                  }
                  <Button customType={ ButtonTypes.Primary }>{ 'Guardar pedido' }</Button>
                </Options>
              </Form>
            </>
            :
            <>
              <P><b>{ 'Hora aproximada de recogida:' }</b><span>{ order.pickuptime.substring(0, 5) }</span></P>
              <div>
                <P><b>{ order.namecustomer }</b></P>
                <P><b>{ 'Teléfono:' }</b><span>{ order.telcustomer }</span></P>
              </div>
              <OrderProductsTable orderProducts={ order.products } />
              <Button
                customType={ ButtonTypes.Secondary }
                onClick={ handleEditClick }
                css={ css`align-self: end` }
                children={ 'Editar pedido' }
              />
              <Form css={ formStyles } onSubmit={ handleSubmitCloseOrder } noValidate>
                <FieldWrapper>
                  <Label htmlFor={ 'given-money' }>
                    { 'Ingrese el dinero entregado por el cliente:' }
                    <NormalFontSpan>{ '(máximo 3 cifras)' }</NormalFontSpan>
                  </Label>
                  <Input
                    type={ 'text' }
                    id={ 'given-money' }
                    name={ 'given-money' }
                    onChange={ handleChange }
                    onBlur={ handleChange }
                    maxLength={ 6 }
                    valid={ errors1['givenMoney'] === undefined }
                    value={ givenMoney }
                  />
                  <InputMessage
                    message={ errors1['givenMoney'] !== undefined ? errors1['givenMoney'] : errors1['exchange'] } />
                </FieldWrapper>
                <P>{ 'El cambio es:' }<span><b>{ exchange }</b></span></P>
                <Button customType={ ButtonTypes.Primary }>{ 'Entregar pedido' }</Button>
              </Form>
            </>
        )
      }
    </Panel>
  )
}

export default OrderPanel
