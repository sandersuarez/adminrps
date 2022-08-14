import React, { FC } from 'react'
import styled from '@emotion/styled'
import OrderProductsTable from './OrderProductsTable'
import margins from '../../styles/margins'
import fonts from '../../styles/fonts'
import colors from '../../styles/colors'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };

  p {
    margin: 0;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: start;
  column-gap: ${ margins.mobile.mediumVertical };

  h2 {
    flex-grow: 1;
  }

  button {
    --dimensions: 1.35em;

    // reset styling
    border: none;
    font: inherit;
    opacity: 1;
    appearance: none;

    background: ${ colors.primary };
    color: ${ colors.background };
    border-radius: .25em;
    padding: .22em .3em;
    ${ fonts.orderNumber }
  }
`

interface OrderSectionProps {
  handleCloseSidePanel: () => void
}

const OrderPanel: FC<OrderSectionProps> = ({ handleCloseSidePanel }) => (
  <Container>
    <TitleWrapper>
      <h2>{ 'Pedido Nº 1 - 06/04/2022' }</h2>
      <button onClick={ handleCloseSidePanel }>
        <i className={ 'bi bi-x' }></i>
      </button>
    </TitleWrapper>
    <p><b>{ 'Hora aproximada de recogida: ' }</b>{ '12:43' }</p>
    <p><b>{ 'Luisa Santos' }</b><br /><b>{ 'Teléfono: ' }</b>{ '676676676' }</p>
    <OrderProductsTable />
  </Container>
)

export default OrderPanel
