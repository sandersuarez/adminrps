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
import Draft, { DraftContent } from '../shapes/Draft'
import { css } from '@emotion/react'
import useValid from '../hooks/useValid'
import { assign } from 'lodash'
import Panels from '../shapes/Panels'
import { GetCustomers } from '../hooks/useCustomers'

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
`

interface DraftSectionProps {
  closeSidePanel: () => void
  openSecondSidePanel: () => void
  changeSecondSidePanel: (panel: Panels) => void
  message: DraftMessage | undefined
  newDraftID: number | undefined
  setNewDraftID: React.Dispatch<React.SetStateAction<number | undefined>>
  draft: (Draft & DraftContent) | undefined
  addDraft: (data: AddDraft['Request']) => void
  editDraft: (data: EditDraft['Request']) => void
  addingDraft: boolean
  getCustomers: (data: GetCustomers['Request']) => void
}

const DraftPanel: FC<DraftSectionProps> = (
  {
    closeSidePanel,
    openSecondSidePanel,
    changeSecondSidePanel,
    message,
    newDraftID,
    setNewDraftID,
    draft,
    addDraft,
    editDraft,
    addingDraft,
    getCustomers,
  }) => {

  const [customerName, setCustomerName] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [pickUpTime, setPickUpTime] = useState<string>('')
  const [canSave, setCanSave] = useState<boolean>(true)

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
        }

        if (draft !== undefined) {
          // noinspection SpellCheckingInspection
          assign(data, { coddraft: draft.coddraft })

          if (draft.codcustomer === null || draft.codcustomer === undefined) {
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
          } else {

          }

          if (draft.pickuptime !== pickUpTimeSet) {
            // noinspection SpellCheckingInspection
            assign(data, { pickuptime: pickUpTimeSet })
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
    values,
    errors1,
    errors2,
    setErrors2,
    commit,
  } = useValid(doUpdateDraft)

  const handleChange: FormEventHandler<HTMLInputElement> = (e) => {
    e.persist()

    const value = e.currentTarget.value
    const name = e.currentTarget.name

    if (name === 'customer-name') {
      setCustomerName(value)
    }
    if (name === 'customer-phone') {
      setCustomerPhone(value)
    }
    if (name === 'pick-up-time') {
      setPickUpTime(value)
    }
  }

  const handleBlur: FormEventHandler<HTMLInputElement> = (e) => {
    if (newDraftID === undefined && draft === undefined && !addingDraft) {
      addDraft({})
    } else if (!addingDraft) {
      doUpdateDraft()
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }

  const close = () => {
    closeSidePanel()
    setNewDraftID(undefined)
  }

  const searchCustomer = () => {
    // noinspection SpellCheckingInspection
    getCustomers({
      telname: '',
      page: 1,
      customers_number: 15,
    })
    changeSecondSidePanel(Panels.Customers)
    openSecondSidePanel()
  }

  useEffect(() => {
    if (draft !== undefined) {

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
              onBlur={ handleBlur }
              value={ customerName }
              disabled={ disableCustomerInputs }
            />
          </FieldWrapper>
          <FieldWrapper>
            <Label htmlFor={ 'customer-phone' }>{ 'Teléfono del cliente:' }</Label>
            <Input
              type={ 'tel' }
              name={ 'customer-phone' }
              id={ 'customer-phone' }
              maxLength={ 9 }
              onChange={ handleChange }
              onBlur={ handleBlur }
              value={ customerPhone }
              disabled={ disableCustomerInputs }
            />
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
              <Button customType={ ButtonTypes.Primary }>{ 'Nuevo cliente' }</Button>
            }
          </Options>
          <FieldWrapper css={ css`margin-top: ${ margins.mobile.littleGap }` }>
            <Label htmlFor={ 'pick-up-time' }>{ 'Hora aproximada de recogida:' }</Label>
            <Input
              type={ 'time' }
              name={ 'pick-up-time' }
              id={ 'pick-up-time' }
              value={ pickUpTime }
              onChange={ handleChange }
              onBlur={ handleBlur }
            />
          </FieldWrapper>
          <Options>
            <Button customType={ ButtonTypes.Danger }>{ 'Cancelar' }</Button>
            <Button customType={ ButtonTypes.Primary } disabled={ canSave }>{ 'Guardar pedido' }</Button>
          </Options>
        </Form>
      }
    </Container>
  )
}

export default DraftPanel