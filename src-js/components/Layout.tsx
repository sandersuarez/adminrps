import React from 'react'
import styled from '@emotion/styled'
import fonts from '../styles/fonts'
import margins from '../styles/margins'
import Main from './Main'
import Header from './Header'

/**
 * Component that contains the layout styles.
 */
const Container = styled.div`
  ${ fonts.body }
  h2 {
    ${ fonts.title }
    margin-top: 0;
    margin-bottom: ${ margins.mobile.mediumVertical };
  }

  h3 {
    margin: 0;
  }
`

/**
 * The component that defines the layout of the application. Contains the header, the navbar and the main sections,
 * and contains the styles that make them responsive.
 */
const Layout = () => {
  return (
    <Container>
      <Header />
      <Main />
    </Container>
  )
}

export default Layout
