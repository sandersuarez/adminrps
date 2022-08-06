import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import { css } from '@emotion/react'
import ButtonTypes from '../shapes/ButtonTypes'

export type ButtonProps = typeof Button.propTypes

interface IProps {
  className?: string
  customType: ButtonTypes
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
    border-radius: 999rem;
    font-weight: bold;
    white-space: nowrap;

    &[disabled] {
      opacity: .6
    }
  `,
  ({ customType }) => {
    switch (customType) {
      case ButtonTypes.Primary:
        return css`
          background: ${ colors.primary };
          color: #fff;
        `

      case ButtonTypes.Secondary:
        return css`
          background: ${ colors.secondary }
        `

      case ButtonTypes.FlattenedSecondary:
        return css`
          background: ${ colors.secondary };
          font-size: 1.4rem;
          font-weight: normal;
        `

      case ButtonTypes.Danger:
        return css`
          background: ${ colors.danger };
          color: #fff;

          &[disabled] {
            background: ${ colors.danger + '99' };
            opacity: .5;
            color: #000;
          }
        `
      case ButtonTypes.Auxiliar:
        return css`
          background: ${ colors.section };
        `

      case ButtonTypes.Empty:
        return css`
          background: ${ colors.background };
          border: 1px solid ${ colors.primary };
        `
    }
  },
)

export default Button
