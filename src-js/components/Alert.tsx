import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import { css } from '@emotion/react'


interface IProps {
  message: string
  type?: 'normal' | 'error'
}

const Container = styled.article<{ type?: 'normal' | 'error' }>(
  css`
    background: ${ colors.section };
    padding: .75em;

    p {
      margin: 0;
    }

    ${ breakpoints.tablet } {
      margin-top: 2rem;
    }
  `,
  ({ type }) => {
    if (type === 'error')
      return css`
        p {
          color: ${ colors.danger };
        }
      `
  },
)

/**
 * Component that is used as a message for errors or warnings from the server or another module of the application.
 */
const Alert: FC<IProps> = ({ message, type }) => {
  return (
    <Container type={ type! }>
      <p>{ message }</p>
    </Container>
  )
}

export default Alert