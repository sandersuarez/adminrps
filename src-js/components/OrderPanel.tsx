import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import IconClose from './svg/IconClose'
import breakpoints from '../styles/breakpoints'

const Container = styled.section`
  background: ${ colors.section };
  --margin: 1rem;
  margin-left: var(--margin);
  margin-right: var(--margin);

  ${ breakpoints.tablet } {
    --margin: 1.5rem;
  }

  ${ breakpoints.desktop } {
    --margin: 3rem;
  }

  p {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  hr {
    --margin: 1.5rem;
    margin-top: var(--margin);
    margin-bottom: var(--margin);

    ${ breakpoints.tablet } {
      --margin: 2rem;
    }
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
  </Container>
)

export default OrderPanel
