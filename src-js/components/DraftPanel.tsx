import styled from '@emotion/styled'
import margins from '../styles/margins'
import React, { FC, FormEventHandler} from 'react'
import TitleWrapper from './TitleWrapper'
import ExitButton from './buttons/ExitButton'
import Options from './buttons/Options'
import Button from './buttons/Button'
import ButtonTypes from '../shapes/ButtonTypes'
import Label from './forms/Label'
import Input from './forms/Input'
import Form from './forms/Form'
import { AddDraft, Draft, DraftContent, DraftMessage, DraftMessageTypes } from '../hooks/useDrafts'
import AlertTypes from '../shapes/AlertTypes'
import Alert from './Alert'
import FieldWrapper from './forms/FieldWrapper'

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

  const handleBlur: FormEventHandler<HTMLInputElement> = (e) => {
    if (newDraftID === undefined && draft === undefined && !addingDraft) {
      addDraft({})
    }
    if (newDraftID !== undefined) {
      console.log(newDraftID)
    }
  }

  const handleClose = () => {
    handleCloseSidePanel()
    setNewDraftID(undefined)
  }

  let DraftID
  if (draft !== undefined) {
    // noinspection SpellCheckingInspection
    DraftID = draft['coddraft']
  }

  return (
    <Container>
      <TitleWrapper>
        <h2>{ draft ? 'Borrador ' + DraftID : 'Nuevo pedido' }</h2>
        <ExitButton onClick={ handleClose }>
          <i className={ 'bi bi-x' } />
        </ExitButton>
        {
          message && message.type === DraftMessageTypes.Error &&
          <Alert message={ message.content + '. Contacte con el administrador.' }
                 type={ AlertTypes.Error } />
        }
        {
          message && message.type === DraftMessageTypes.Warning &&
          <Alert message={ message.content } type={ AlertTypes.Warning } />
        }
      </TitleWrapper>
      <Form>
        <FieldWrapper>
          <Label htmlFor={ 'customer-name' }>{ 'Nombre del cliente:' }</Label>
          <Input
            type={ 'text' }
            name={ 'customer-name' }
            id={ 'customer-name' }
            maxLength={ 60 }
            onBlur={ handleBlur }
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
          />
        </FieldWrapper>
        <Button customType={ ButtonTypes.Primary }>{ 'Buscar cliente' }</Button>
        <FieldWrapper>
          <Label htmlFor={ 'pick-up-hour' }>{ 'Hora aproximada de recogida:' }</Label>
          <Input type={ 'time' } name={ 'pick-up-hour' } id={ 'pick-up-hour' } />
        </FieldWrapper>
        <Options>
          <Button customType={ ButtonTypes.Danger }>{ 'Cancelar' }</Button>
          <Button customType={ ButtonTypes.Primary }>{ 'Guardar pedido' }</Button>
        </Options>
      </Form>
    </Container>
  )
}

export default DraftPanel