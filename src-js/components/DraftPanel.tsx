import styled from '@emotion/styled'
import margins from '../styles/margins'
import React, { FC, FormEventHandler, useEffect, useState } from 'react'
import TitleWrapper from './TitleWrapper'
import ExitButton from './buttons/ExitButton'
import Options from './buttons/Options'
import Button from './buttons/Button'
import ButtonTypes from '../shapes/ButtonTypes'
import Label from './forms/Label'
import Input from './forms/Input'
import Form from './forms/Form'
import { AddDraft, DraftMessage, DraftMessageTypes, EditDraft } from '../hooks/useDrafts'
import AlertTypes from '../shapes/AlertTypes'
import Alert from './Alert'
import FieldWrapper from './forms/FieldWrapper'
import DraftShape, { DraftContent } from '../shapes/DraftShape'
import { css } from '@emotion/react'
import useValid, { ValidEvents } from '../hooks/useValid'
import { assign, isEqual } from 'lodash'
import Panels from '../shapes/Panels'
import { GetCustomers } from '../hooks/useCustomers'
import { DraftProductReqData } from '../shapes/ProductShape'
import OrderProductsTable from './orders/OrderProductsTable'
import InputMessage from './forms/InputMessage'
import { AddOrder } from '../hooks/useOrders'
import breakpoints from '../styles/breakpoints'

const hourFieldStyles = css`
  margin-top: ${ margins.mobile.littleGap };

  ${ breakpoints.tablet } {
    margin-top: ${ margins.tablet.gridSpace };
  }
`

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };

  p {
    margin: 0;
  }

  ${ Options } {
    flex-direction: initial;

    &:nth-last-of-type(1) {
      margin-top: ${ margins.mobile.mediumVertical };
    }
  }

  ${ breakpoints.tablet } {
    row-gap: ${ margins.tablet.mediumVertical };
    padding: ${ margins.tablet.lateral };

    ${ Options } {
      margin-top: 0;

      &:nth-last-of-type(1) {
        margin-top: ${ margins.tablet.mediumVertical };
      }
    }
  }
`

interface DraftSectionProps {
  closeSidePanel: () => void
  openSecondSidePanel: () => void
  changeSecondSidePanel: (panel: Panels) => void
  message: DraftMessage | undefined
  setMessage: (message: DraftMessage | undefined) => void
  newDraftID: number | undefined
  setNewDraftID: React.Dispatch<React.SetStateAction<number | undefined>>
  draft: (DraftShape & DraftContent) | undefined
  addDraft: (data: AddDraft['Request']) => void
  editDraft: (data: EditDraft['Request']) => void
  addingDraft: boolean
  getCustomers: (data: GetCustomers['Request']) => void
  setDraftCustomerID: (id: number | undefined) => void
  draftCustomerID: number | undefined
  setSelectedCustomer: (id: number | undefined) => void
  draftProducts: DraftProductReqData[] | undefined
  addOrder: (
    data: AddOrder['Request'],
    action: () => void, callback:
      (DraftMessage: DraftMessage | undefined) => void,
  ) => void,
  getDrafts: () => void,
}

const DraftPanel: FC<DraftSectionProps> = (
  {
    closeSidePanel,
    openSecondSidePanel,
    changeSecondSidePanel,
    message,
    setMessage,
    newDraftID,
    setNewDraftID,
    draft,
    addDraft,
    editDraft,
    addingDraft,
    getCustomers,
    setDraftCustomerID,
    draftCustomerID,
    setSelectedCustomer,
    draftProducts,
    addOrder,
    getDrafts,
  }) => {

  const [customerName, setCustomerName] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [pickUpTime, setPickUpTime] = useState<string>('')

  const [matches, setMatches] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

  const doUpdateDraft = () => {
    if (newDraftID === undefined && draft === undefined && !addingDraft) {
      addDraft({})
    } else {
      if (!addingDraft) {
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
    }
  }

  const {
    validateField,
    errors1,
    commit: validateSubmit,
  } = useValid(() => {
    if (draft !== undefined) {
      // noinspection SpellCheckingInspection
      addOrder(
        { coddraft: draft.coddraft },
        () => {
          close()
          getDrafts()
        },
        setMessage,
      )
    }
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
      doUpdateDraft()
    }

    if (draftCustomerID === undefined) {
      if (name === 'customer-name') {
        setCustomerName(value)
        validateField({ name: 'customer-name', value: customerName, event: event })
      }
      if (name === 'customer-phone') {
        setCustomerPhone(value)
        validateField({ name: 'customer-phone', value: customerPhone, event: event })
      }
    }

    if (name === 'pick-up-time') {
      setPickUpTime(value)
      validateField({ name: 'pick-up-time', value: pickUpTime, event: event })
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    new FormData(e.currentTarget).forEach((entry, name) => {
      if (draftCustomerID === undefined) {
        if (name === 'customer-name') {
          setCustomerName(entry.toString())
        }
        if (name === 'customer-phone') {
          setCustomerPhone(entry.toString())
        }
      }
      if (name === 'pick-up-time') {
        setPickUpTime(entry.toString())
      }
    })

    let fields = [
      { name: 'pick-up-time', value: pickUpTime, event: ValidEvents.Submit },
      { name: 'products', value: draftProducts ? draftProducts.length.toString() : '0', event: ValidEvents.Submit },
    ]

    if (draftCustomerID === undefined) {
      fields.push(
        { name: 'customer-name', value: customerName, event: ValidEvents.Submit },
        { name: 'customer-phone', value: customerPhone, event: ValidEvents.Submit },
      )
    }
    validateSubmit(fields)
  }

  const close = () => {
    closeSidePanel()
    setNewDraftID(undefined)
  }

  const searchCustomer = () => {
    doUpdateDraft()
    // noinspection SpellCheckingInspection
    getCustomers({
      telname: '',
      customers_number: matches ? 30 : 15,
      page: 1,
    })
    changeSecondSidePanel(Panels.Customers)
    openSecondSidePanel()
  }

  const resetCustomer = () => {
    setSelectedCustomer(undefined)
    setDraftCustomerID(undefined)
  }

  const searchProducts: FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    doUpdateDraft()
    changeSecondSidePanel(Panels.Products)
    openSecondSidePanel()
  }

  useEffect(() => {
    if (draft !== undefined) {
      doUpdateDraft()
    }
  }, [draftCustomerID, draftProducts])

  useEffect(() => {
    validateField({
      name: 'products',
      value: draftProducts ? draftProducts.length.toString() : '0',
      event: ValidEvents.Change,
    })
  }, [draftProducts])

  useEffect(() => {
    window
      .matchMedia('(min-width: 700px)')
      .addEventListener('change', e => setMatches(e.matches))
  }, [])

  useEffect(() => {
    if (draft !== undefined) {

      if (draft.codcustomer !== null && draft.codcustomer !== undefined) {
        setDraftCustomerID(draft.codcustomer)
      } else {
        setDraftCustomerID(undefined)
      }

      if (draft.namecustomertmp !== null && draft.namecustomertmp !== undefined) {
        setCustomerName(draft.namecustomertmp)
      } else if (draft.namecustomer !== null && draft.namecustomer !== undefined) {
        setCustomerName(draft.namecustomer)
      } else {
        setCustomerName('')
      }

      if (draft.telcustomertmp !== null && draft.telcustomertmp !== undefined) {
        setCustomerPhone(draft.telcustomertmp)
      } else if (draft.telcustomer !== null && draft.telcustomer !== undefined) {
        setCustomerPhone(draft.telcustomer)
      } else {
        setCustomerPhone('')
      }

      if (draft.pickuptime !== null && draft.pickuptime !== undefined) {
        setPickUpTime(draft.pickuptime)
      } else {
        setPickUpTime('')
      }
    } else if (newDraftID !== undefined) {
      setCustomerName('')
      setCustomerPhone('')
      setPickUpTime('')
      setDraftCustomerID(undefined)
    }
  }, [newDraftID, draft])

  const disableCustomerInputs = draft !== undefined && draft.codcustomer !== null && draft.codcustomer !== undefined

  // noinspection SpellCheckingInspection
  return (
    <Container>
      <TitleWrapper>
        <h2>{ draft !== undefined ? 'Borrador ' + draft.coddraft : 'Nuevo pedido' }</h2>
        <ExitButton onClick={ close }>
          <i className={ 'bi bi-x' } />
        </ExitButton>
      </TitleWrapper>
      {
        message !== undefined && message.type === DraftMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
      {
        message !== undefined && message.type === DraftMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      {
        (draft !== undefined || newDraftID !== undefined) &&
        <Form onSubmit={ handleSubmit }>
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
          <OrderProductsTable products={ draft?.products } />
          <InputMessage message={ errors1['products'] } />
          <Button customType={ ButtonTypes.Primary } onClick={ searchProducts }>{ 'Seleccionar productos' }</Button>
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
            <Button
              customType={ ButtonTypes.Danger }
              onClick={ close }
            >
              { draft !== undefined ? 'Eliminar borrador' : 'Cancelar' }
            </Button>
            <Button customType={ ButtonTypes.Primary }>{ 'Guardar pedido' }</Button>
          </Options>
        </Form>
      }
    </Container>
  )
}

export default DraftPanel