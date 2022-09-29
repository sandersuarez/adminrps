import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import fonts from '../styles/fonts'
import margins from '../styles/margins'

const H1 = styled.h1`
  --vertical-margin: 0;
  --lateral-margin: ${ margins.mobile.lateral };

  ${ fonts.titleBar }
  margin-top: var(--vertical-margin);
  margin-bottom: var(--vertical-margin);
  margin-left: var(--lateral-margin);
  margin-right: var(--lateral-margin);
  cursor: default;

  &::selection {
    background: transparent;
  }
`

const Container = styled.header`
  display: flex;
  align-items: center;
  background: ${ colors.primary };
  top: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  margin: 0;
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