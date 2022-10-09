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
import { AddDraft, DraftMessage, DraftMessageTypes } from '../hooks/useDrafts'
import AlertTypes from '../shapes/AlertTypes'
import Alert from './Alert'
import FieldWrapper from './forms/FieldWrapper'
import Draft, { DraftContent } from '../shapes/Draft'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };

  p {
    margin: 0;
  }

  ${ Options } {
    margin-top: ${ margins.mobile.mediumVertical };
    flex-direction: initial;
  }
`

interface DraftSectionProps {
  draftID?: number
  handleCloseSidePanel: () => void
  handleOpenSecondSidePanel: () => void
  message: DraftMessage | undefined
  newDraftID: number | undefined
  setNewDraftID: React.Dispatch<React.SetStateAction<number | undefined>>
  draft: (Draft & DraftContent) | undefined
  addDraft: (data: AddDraft['Request']) => void
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
    addingDraft,
  }) => {

  const [customerName, setCustomerName] = useState<string>()
  const [customerNameDisabled, setCustomerNameDisabled] = useState<boolean>(false)

  const [customerPhone, setCustomerPhone] = useState<string>()
  const [customerPhoneDisabled, setCustomerPhoneDisabled] = useState<boolean>(false)

  const [pickUpTime, setPickUpTime] = useState<string>()

  const handleBlur: FormEventHandler<HTMLInputElement> = (e) => {
    if (newDraftID === undefined && draft === undefined && !addingDraft) {
      addDraft({})
    }
  }

  const handleClose = () => {
    handleCloseSidePanel()
    setNewDraftID(undefined)
  }

  useEffect(() => {
    if (draft !== undefined) {

      if (draft.namecustomertmp !== null) {
        setCustomerName(draft.namecustomertmp)
        setCustomerNameDisabled(false)
      } else if (draft.namecustomer !== null) {
        setCustomerName(draft.namecustomer)
        setCustomerNameDisabled(true)
      } else {
        setCustomerName(undefined)
        setCustomerNameDisabled(false)
      }

      if (draft.telcustomertmp !== null) {
        setCustomerPhone(draft.telcustomertmp)
        setCustomerPhoneDisabled(false)
      } else if (draft.telcustomer !== null) {
        setCustomerPhone(draft.telcustomer)
        setCustomerPhoneDisabled(true)
      } else {
        setCustomerPhone(undefined)
        setCustomerPhoneDisabled(false)
      }

      if (draft.pickuptime !== null) {
        setPickUpTime(draft.pickuptime)
      } else {
        setPickUpTime(undefined)
      }
    } else if (newDraftID !== undefined) {
      setCustomerName(undefined)
      setCustomerNameDisabled(false)
      setCustomerPhone(undefined)
      setCustomerPhoneDisabled(false)
      setPickUpTime(undefined)
    }
  }, [newDraftID, draft])

  return (
    <Container>
      <TitleWrapper>
        <h2>{ draft !== undefined ? 'Borrador ' + draft.coddraft : 'Nuevo pedido' }</h2>
        <ExitButton onClick={ handleClose }>
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
              onBlur={ handleBlur }
              defaultValue={ customerName }
              disabled={ customerNameDisabled }
            />
          </FieldWrapper>
          <FieldWrapper>
            <Label htmlFor={ 'customer-phone' }>{ 'Teléfono del cliente:' }</Label>
            <Input
              type={ 'tel' }
              name={ 'customer-phone' }
              id={ 'customer-phone' }
              maxLength={ 9 }
              onBlur={ handleBlur }
              defaultValue={ customerPhone }
              disabled={ customerPhoneDisabled }
            />
          </FieldWrapper>
          <Button customType={ ButtonTypes.Primary }>{ 'Buscar cliente' }</Button>
          <FieldWrapper>
            <Label htmlFor={ 'pick-up-hour' }>{ 'Hora aproximada de recogida:' }</Label>
            <Input type={ 'time' } name={ 'pick-up-hour' } id={ 'pick-up-hour' } defaultValue={ pickUpTime } />
          </FieldWrapper>
          <Options>
            <Button customType={ ButtonTypes.Danger }>{ 'Cancelar' }</Button>
            <Button customType={ ButtonTypes.Primary }>{ 'Guardar pedido' }</Button>
          </Options>
        </Form>
      }
    </Container>
  )
}

export default DraftPanel