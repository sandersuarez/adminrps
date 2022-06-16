import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

export type ButtonProps = typeof Button.propTypes

interface IProps {
  customType: 'secondary' | 'flattened-secondary' | 'danger'
}

const Button = styled.button<IProps>(
  {
    // reset styling
    border: 'none',
    font: 'inherit',
    opacity: 1,
    appearance: 'none',
    // custom styling
    height: '4.5rem',
    padding: '0 1.7rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '2.2rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    [breakpoints.tablet]: {
      padding: '0 2rem',
    },
    '&[disabled]': {
      opacity: .6,
    },
  },
  ({ customType }) => {
    switch (customType) {
      case 'secondary':
        return { background: colors.secondary }

      case 'flattened-secondary':
        return {
          fontWeight: 'normal',
          background: colors.secondary,
          height: '3.5rem',
          [breakpoints.tablet]: {
            height: '4.5rem',
          },
        }

      case 'danger':
        return {
          background: colors.danger,
          color: '#fff',

          '&[disabled]': {
            opacity: .3,
            color: '#000',
          },
        }
    }
  },
)

export default Button
