import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

/**
 * Component that defines a custom input to be reused across the application
 */
const Input = styled.input(
  {
    // reset styling
    appearance: 'none',
    font: 'inherit',
    // custom styling
    display: 'block',
    height: '3.5rem',
    padding: '0 0 0 1rem',
    maxWidth: '51.2rem',
    background: colors.background,
    border: '1px solid',
    borderRadius: '0.5rem',
    borderColor: colors.primary,
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
    [breakpoints.tablet]: {
      height: '4.5rem',
      padding: '0 0 0 1.5rem',
    },
  },
)

export default Input