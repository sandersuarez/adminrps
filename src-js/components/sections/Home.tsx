import React from 'react'
import WelcomeLayer from '../WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import ActiveOrders from '../orders/ActiveOrders'
import Drafts from '../Drafts'
import margins from '../../styles/margins'

const Container = styled.section`
  padding: ${ margins.mobile.lateral };

  ${ breakpoints.tablet } {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  ${ breakpoints.desktop } {
    order: 2;
    padding: 1.5rem 3rem 2rem 3rem;
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
      <ActiveOrders />
      <Drafts />
    </Container>
  )
}

export default Home