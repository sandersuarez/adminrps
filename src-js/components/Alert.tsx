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
    background: ${ colors.background };

    p {
      margin: 0;
    }
  `,
  ({ type }) => {
    if (type === AlertTypes.Warning || type === AlertTypes.Error) {
      return css`
        border-color: ${ colors.danger };

        p {
          color: ${ colors.danger };
        }
      `
    }
    if (type === AlertTypes.Info) {
      return css`
        i {
          color: ${ colors.primary };
        }
      `
    }
    if (type === AlertTypes.Success) {
      return css`
        border-color: ${ colors.success };
        
        i {
          color: ${ colors.success };
        }
      `
    }
  },
)

/**
 * Component that is used as a message for errors or warnings from the server or another module of the application.
 */
const Alert: FC<IProps> = ({ className, message, type }) => {

  let iconClass
  switch (type) {
    case AlertTypes.Warning:
      iconClass = 'bi bi-exclamation-triangle-fill'
      break
    case AlertTypes.Info:
    case AlertTypes.Error:
      iconClass = 'bi bi-exclamation-circle-fill'
      break
    case AlertTypes.Success:
      iconClass = 'bi bi-check-circle-fill'
      break
  }

  return (
    <Container className={ className } type={ type! }>
      <p>
        {
          iconClass &&
          <i className={ iconClass }></i>
        }
        <span>{ '\t' + message }</span>
      </p>
    </Container>
  )
}

export default Alert