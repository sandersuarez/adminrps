import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import { css } from '@emotion/react'

export type ButtonProps = typeof Button.propTypes

interface IProps {
  customType: 'secondary' | 'flattened-secondary' | 'danger'
}

/**
 * Component that defines a customized button to be reused across the application
 */
const Button = styled.button<IProps>(
  css`
    // reset styling
    color: inherit;
    border: none;
    font: inherit;
    opacity: 1;
    appearance: none;

    // custom styling
    padding: .75em 1.25em;
    border-radius: 2.2rem;
    font-weight: bold;
    white-space: nowrap;

    &[disabled] {
      opacity: .6
    }
  `,
  ({ customType }) => {
    switch (customType) {
      case 'secondary':
        return css`
          background: ${ colors.secondary }
        `

      case 'flattened-secondary':
        return css`
          background: ${ colors.secondary };
          font-size: 1.4rem;
          font-weight: normal;
        `

      case 'danger':
        return css`
          background: ${ colors.danger };
          color: #fff;

          &[disabled] {
            opacity: .3;
            color: #000;
          }
        `
    }
  },
)

export default Button
