import React, { FC } from 'react'
import styled from '@emotion/styled'
import OrderProductsTable from './OrderProductsTable'
import margins from '../../styles/margins'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Form from '../Form'
import Label from '../Label'
import Input from '../Input'
import { css } from '@emotion/react'
import Options from '../Options'
import TitleWrapper from '../TitleWrapper'
import ExitButton from '../buttons/ExitButton'

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  row-gap: ${ margins.mobile.vertical };
`

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };

  p {
    margin: 0;
  }
`

const formStyles = css`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${ margins.mobile.mediumVertical };

  div {
    flex-grow: 1;
  }
`

interface OrderSectionProps {
  handleCloseSidePanel: () => void
  handleOpenSecondSidePanel: () => void
}

const OrderPanel: FC<OrderSectionProps> = ({ handleCloseSidePanel, handleOpenSecondSidePanel }) => {
  const [editMode, setEditMode] = React.useState<boolean>(false)

  const handleExitClick = () => {
    handleCloseSidePanel()
    setEditMode(false)
  }

  const handleEditClick = () => {
    setEditMode(true)
  }

  return (
    <Container>
      <TitleWrapper>
        <h2>{ 'Pedido Nº 1 - 06/04/2022' }</h2>
        <ExitButton onClick={ handleExitClick }>
          <i className={ 'bi bi-x' } />
        </ExitButton>
      </TitleWrapper>
      <p><b>{ 'Hora aproximada de recogida: ' }</b>{ '12:43' }</p>
      <p><b>{ 'Luisa Santos' }</b><br /><b>{ 'Teléfono: ' }</b>{ '676676676' }</p>
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
      <OrderProductsTable editable={ editMode } />
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
            <Form css={ formStyles } noValidate>
              <div>
                <Label htmlFor={ 'given-money' }>{ 'Ingrese el dinero entregado por el cliente:' }</Label>
                <Input id={ 'given-money' } />
              </div>
              <p>{ 'El cambio es: ' }<b>{ '4,00 €' }</b></p>
              <Button customType={ ButtonTypes.Primary }>{ 'Entregar pedido' }</Button>
            </Form>
          </>
      }
    </Container>
  )
}

export default OrderPanel
