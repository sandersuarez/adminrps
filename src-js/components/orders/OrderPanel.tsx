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
import { EditDraft } from '../../hooks/useDrafts'
import { assign, isEqual, replace } from 'lodash'
import Panels from '../../shapes/Panels'
import { OrderMessage } from '../../hooks/useOrders'
import OrderShape from '../../shapes/OrderShape'
import Panel from '../Panel'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import useValid, { ValidEvents } from '../../hooks/useValid'
import InputMessage from '../forms/InputMessage'
import NormalFontSpan from '../NormalFontSpan'

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

    return formatter.format(givenMoneyNumeric - total)
  }

  const [givenMoney, setGivenMoney] = useState<string>('0,00')
  const [exchange, setExchange] = useState<string>(calculateExchange())

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

  return (
    <Panel>
      <TitleWrapper>
        <h2>{ 'Pedido ' + (order !== undefined ? order.numdayorder : '') }</h2>
        <ExitButton onClick={ close }>
          <i className={ 'bi bi-x' } />
        </ExitButton>
      </TitleWrapper>
      {
        order !== undefined &&
        <>
          <P><b>{ 'Hora aproximada de recogida:' }</b><span>{ order.pickuptime }</span></P>
          <div>
            <P><b>{ order.namecustomer }</b></P>
            <P><b>{ 'Teléfono:' }</b><span>{ order.telcustomer }</span></P>
          </div>
        </>
      }
      {
        editMode ?
          <Options>
            <Button
              customType={ ButtonTypes.Secondary }
              onClick={ handleOpenSecondSidePanel }
            >
              { 'Cambiar cliente' }
            </Button>
            <Button customType={ ButtonTypes.Secondary }>{ 'Nuevo cliente' }</Button>
          </Options>
          :
          null
      }
      {
        order !== undefined &&
        <OrderProductsTable orderProducts={ order.products } />
      }
      {
        editMode ?
          <>
            <Button
              customType={ ButtonTypes.Primary }
              css={ css`align-self: start` }
              children={ 'Añadir producto' }
            />
            <FieldWrapper css={ css`margin-top: ${ margins.mobile.mediumVertical }` }>
              <Label htmlFor={ 'pick-up-hour' }>{ 'Hora aproximada de recogida:' }</Label>
              <Input id={ 'pick-up-hour' } />
            </FieldWrapper>
            <Options css={ css`margin-top: ${ margins.mobile.bigVertical }` }>
              <Button customType={ ButtonTypes.Primary }>{ 'Guardar cambios' }</Button>
              <Button customType={ ButtonTypes.Secondary }>{ 'Cancelar' }</Button>
              <Button customType={ ButtonTypes.Danger }>{ 'Cancelar pedido' }</Button>
            </Options>
          </>
          :
          <>
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
                <InputMessage message={ errors1['givenMoney'] } />
              </FieldWrapper>
              <P>{ 'El cambio es:' }<span><b>{ exchange }</b></span></P>
              <Button customType={ ButtonTypes.Primary }>{ 'Entregar pedido' }</Button>
            </Form>
          </>
      }
    </Panel>
  )
}

export default OrderPanel
