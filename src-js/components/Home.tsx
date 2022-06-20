import React from 'react'
import Button from './Button'
import WelcomeLayer from './WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import ActiveOrders from './ActiveOrders'

const NewOrderButton = styled(Button)({
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
})

const Home = () => {
  return (
    <section>
      <WelcomeLayer userName={ 'sandy' } />
      <NewOrderButton customType={ 'secondary' }>Nuevo pedido</NewOrderButton>
      <ActiveOrders />
    </section>
  )
}

export default Home