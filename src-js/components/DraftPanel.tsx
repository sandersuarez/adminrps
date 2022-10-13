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
import useValid, { ValidEvents } from '../hooks/useValid'
import drafts from './Drafts'
import { assign } from 'lodash'

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
  handleCloseSidePanel: () => void
  handleOpenSecondSidePanel: () => void
  message: DraftMessage | undefined
  newDraftID: number | undefined
  setNewDraftID: React.Dispatch<React.SetStateAction<number | undefined>>
  draft: (Draft & DraftContent) | undefined
  addDraft: (data: AddDraft['Request']) => void
  editDraft: (data: EditDraft['Request']) => void
  addingDraft: boolean
}

const DraftPanel: FC<DraftSectionProps> = (
  {
    handleCloseSidePanel,
    handleOpenSecondSidePanel,
    message,
    newDraftID,
    setNewDraftID,
    draft,
    addDraft,
    editDraft,
    addingDraft,
  }) => {

  const [customerName, setCustomerName] = useState<string>()
  const [customerPhone, setCustomerPhone] = useState<string>()
  const [pickUpTime, setPickUpTime] = useState<string>()
  const [canSave, setCanSave] = useState<boolean>(true)

  const doUpdateDraft = () => {
    if (newDraftID === undefined && draft === undefined && !addingDraft) {
      addDraft({})
    } else {
      if (!addingDraft) {
        // noinspection SpellCheckingInspection
        let data: EditDraft['Request'] = { coddraft: 0 }

        if (newDraftID !== undefined) {
          // noinspection SpellCheckingInspection
          assign(data, { coddraft: newDraftID })

          if (customerName !== undefined) {
            // noinspection SpellCheckingInspection
            assign(data, { namecustomertmp: customerName })
          }

          if (customerPhone !== undefined) {
            // noinspection SpellCheckingInspection
            assign(data, { telcustomertmp: customerPhone })
          }

          if (pickUpTime !== undefined) {
            // noinspection SpellCheckingInspection
            assign(data, { pickuptime: pickUpTime })
          }
        }

        if (draft !== undefined) {
          // noinspection SpellCheckingInspection
          assign(data, { coddraft: draft.coddraft })

          if (draft.codcustomer === null) {
            if (customerName !== undefined && draft.namecustomertmp !== customerName.trim()) {
              // noinspection SpellCheckingInspection
              assign(data, { namecustomertmp: customerName.trim() })
            }

            if (customerPhone !== undefined && draft.telcustomertmp !== customerPhone.trim()) {
              // noinspection SpellCheckingInspection
              assign(data, { telcustomertmp: customerPhone.trim() })
            }
          }
        }

        editDraft(data)
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

    if (name === 'username') {
      setCustomerName(value)
    }
    if (name === 'password') {
      setCustomerPhone(value)
    }
    if (name === 'password') {
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

  const close = () => {
    handleCloseSidePanel()
    setNewDraftID(undefined)
  }

  useEffect(() => {
    if (draft !== undefined) {

      if (draft.namecustomertmp !== null) {
        setCustomerName(draft.namecustomertmp)
      } else if (draft.namecustomer !== null) {
        setCustomerName(draft.namecustomer)
      } else {
        setCustomerName(undefined)
      }

      if (draft.telcustomertmp !== null) {
        setCustomerPhone(draft.telcustomertmp)
      } else if (draft.telcustomer !== null) {
        setCustomerPhone(draft.telcustomer)
      } else {
        setCustomerPhone(undefined)
      }

      if (draft.pickuptime !== null) {
        setPickUpTime(draft.pickuptime)
      } else {
        setPickUpTime(undefined)
      }
    } else if (newDraftID !== undefined) {
      setCustomerName(undefined)
      setCustomerPhone(undefined)
      setPickUpTime(undefined)
    }
  }, [newDraftID, draft])

  const disableCustomerInputs = draft !== undefined && draft.codcustomer !== null

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
        message === undefined &&
        <Form>
          <FieldWrapper>
            <Label htmlFor={ 'customer-name' }>{ 'Nombre del cliente:' }</Label>
            <Input
              type={ 'text' }
              name={ 'customer-name' }
              id={ 'customer-name' }
              maxLength={ 60 }
              onChange={ handleChange }
              onBlur={ handleBlur }
              defaultValue={ customerName }
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
              defaultValue={ customerPhone }
              disabled={ disableCustomerInputs }
            />
          </FieldWrapper>
          <Options>
            <Button customType={ ButtonTypes.Primary }>{ 'Buscar cliente' }</Button>
            {
              disableCustomerInputs &&
              <Button customType={ ButtonTypes.Primary }>{ 'Nuevo cliente' }</Button>
            }
          </Options>
          <FieldWrapper css={ css`margin-top: ${ margins.mobile.littleGap }` }>
            <Label htmlFor={ 'pick-up-hour' }>{ 'Hora aproximada de recogida:' }</Label>
            <Input
              type={ 'time' }
              name={ 'pick-up-hour' }
              id={ 'pick-up-hour' }
              defaultValue={ pickUpTime }
              onChange={ handleChange }
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