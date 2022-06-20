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
  zIndex: 1,
  [breakpoints.tablet]: {
    bottom: '8.5rem',
    right: '3rem',
  },
  [breakpoints.desktop]: {
    bottom: '2rem',
    right: '4rem',
  },
})

/**
 * This component is the main section of the application, the home page. It contains the welcome message for the user,
 * the logout button, the active orders component and the drafts component.
 */
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