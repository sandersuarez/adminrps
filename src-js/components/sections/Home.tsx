import React from 'react'
import Button from '../Button'
import WelcomeLayer from '../WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import ActiveOrders from '../orders/ActiveOrders'
import Drafts from '../Drafts'
import FixedButton from '../FixedButton'

const Container = styled.section`
  padding: 1rem;

  ${ breakpoints.tablet } {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  ${ breakpoints.desktop } {
    order: 2;
    padding: 1.5rem 3rem 2rem 3rem;
  }
`

const NewOrderButton = styled(Button)`
  position: fixed;
  bottom: 7.5rem;
  right: 2rem;
  z-index: 1;

  ${ breakpoints.tablet } {
    bottom: 8.5rem;
    right: 3rem;
  }

  ${ breakpoints.desktop } {
    bottom: 2rem;
    right: 4rem;
  }
`

/**
 * This component is the main section of the application, the home page. It contains the welcome message for the user,
 * the logout button, the active orders component and the drafts component.
 */
const Home = () => {
  return (
    <Container>
      <WelcomeLayer userName={ 'sandy' } />
      <FixedButton>Nuevo pedido</FixedButton>
      <ActiveOrders />
      <Drafts />
    </Container>
  )
}

export default Home