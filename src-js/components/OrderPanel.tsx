import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import IconClose from './svg/IconClose'
import breakpoints from '../styles/breakpoints'
import OrderProductsTable from './OrderProductsTable'

const Container = styled.section`
  --side-margin: 1rem;
  --content-margin: 1.5rem;

  ${ breakpoints.tablet } {
    --side-margin: 1.5rem;
    --content-margin: 2rem;
  }

  ${ breakpoints.desktop } {
    --side-margin: 3rem;
  }

  background: ${ colors.section };
  margin-left: var(--side-margin);
  margin-right: var(--side-margin);

  p {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  hr, ${OrderProductsTable} {
    margin-top: var(--content-margin);
    margin-bottom: var(--content-margin);
  }
`

const Title = styled.h2`
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: solid 1px ${ colors.text };

  button {
    position: absolute;
    top: 0;
    right: 0;
    width: 2rem;
    height: 2rem;

    svg {
      width: 100%;
    }
  }
`

interface OrderSectionProps {
  onClose: () => void
}

const OrderPanel: FC<OrderSectionProps> = ({ onClose }) => (
  <Container>
    <Title>
      Pedido Nº 1 - 06/04/2022
      <button onClick={ onClose } children={ <IconClose /> } />
    </Title>
    <p>
      <b>Hora aproximada de recogida:</b>
      12:43
    </p>
    <p>
      <b>Luisa Santos</b><br />
      <b>Teléfono:</b> 676676676
    </p>
    <OrderProductsTable />
  </Container>
)

export default OrderPanel
