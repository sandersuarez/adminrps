import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'

/**
 * Component that defines a custom input to be reused across the application
 */
const Input = styled.input`
  --lateral-margin: 1.25em;
  
  // reset styling
  appearance: none;
  font: inherit;
  // custom styling
  display: block;
  padding-left: var(--lateral-margin);
  padding-right: var(--lateral-margin);
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