import React from 'react'
import Button from './Button'
import WelcomeLayer from './WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import ActiveOrders from './ActiveOrders'

const Container = styled.section(
  {
    'button.new-order-button': {
      position: 'fixed',
      bottom: '7.5rem',
      right: '2rem',
      [breakpoints.tablet]: {
        bottom: '8.5rem',
        right: '3rem',
      },
      [breakpoints.desktop]: {
        bottom: '2rem',
      },
    },

  },
)

const Home = () => {
  return (
    <Container>
      <WelcomeLayer userName={ 'sandy' } />
      <Button className='new-order-button' customType={ 'secondary' }>Nuevo pedido</Button>
      <ActiveOrders />
    </Container>
  )
}

export default Home