import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import fonts from '../styles/fonts'

const H1 = styled.h1`
  ${ fonts.titleBar }
  margin: 0;
  cursor: default;

  &::selection {
    background: transparent;
  }
`

const Container = styled.header`
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

/**
 * Component that contains the header styles.
 */
const Header = () => {
  return (
    <Container>
      <H1>AdminRPS</H1>
    </Container>
  )
}

export default Header