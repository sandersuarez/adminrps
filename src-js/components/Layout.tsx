import React from 'react'
import styled from '@emotion/styled'
import fonts from '../styles/fonts'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import margins from '../styles/margins'
import Main from './Main'

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
 * Component that contains the header styles.
 */
const Header = styled.header`
  display: flex;
  align-items: center;
  background: ${ colors.primary };
  padding: 0 0 0 1rem;
  top: 0;
  left: 0;
  right: 0;
  height: 3rem;
  margin: 0;

  ${ breakpoints.tablet } {
    padding: 0 0 0 1.5rem;
    height: 3.5rem;
  }
`

const H1 = styled.h1`
  ${ fonts.titleBar }
  margin: 0;
  cursor: default;

  &::selection {
    background: transparent;
  }
`

/**
 * The component that defines the layout of the application. Contains the header, the navbar and the main sections,
 * and contains the styles that make them responsive.
 */
const Layout = () => {
  return (
    <Container>
      <Header>
        <H1>AdminRPS</H1>
      </Header>
      <Main/>
    </Container>
  )
}

export default Layout
