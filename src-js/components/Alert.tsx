import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import { css } from '@emotion/react'
import AlertTypes from '../shapes/AlertTypes'

interface IProps {
  className?: string,
  message: string
  type?: AlertTypes
}

const Container = styled.article<{ type?: AlertTypes }>(
  css`
    align-self: stretch;
    padding: .75em;
    border-radius: .5rem;
    border: 1px solid ${ colors.primary };

    p {
      margin: 0;
    }
  `,
  ({ type }) => {
    if (type === AlertTypes.Warning)
      return css`
        border-color: ${ colors.danger };

        p {
          color: ${ colors.danger };
        }
      `
  },
)

/**
 * Component that is used as a message for errors or warnings from the server or another module of the application.
 */
const Alert: FC<IProps> = ({ className, message, type }) => {
  return (
    <Container className={ className } type={ type! }>
      <p>
        <i className='bi bi-exclamation-triangle-fill'></i>
        <span>{ '\t' + message }</span>
      </p>
    </Container>
  )
}

export default Alert