import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'

/**
 * Component that defines a custom input to be reused across the application
 */
const Input = styled.input`
  // reset styling
  appearance: none;
  font: inherit;
  // custom styling
  display: block;
  padding: .75em 1.25em;
  max-width: 51.2rem;
  background: ${ colors.background };
  border-radius: .5rem;
  border: 1px solid ${ colors.primary };

  &:focus {
    outline: none;
    box-shadow: none;
  }
`

export default Input