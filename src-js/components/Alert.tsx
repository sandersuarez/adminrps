import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'


interface IProps {
  message: string
  type?: 'normal' | 'error'
}

const Container = styled.article<{ type?: 'normal' | 'error' }>(
  {
    margin: '1rem 0 0 0',
    background: colors.section,
    padding: '1rem',
    p: {
      margin: 0,
    },
    [breakpoints.tablet]: {
      margin: '2rem 0 0 0',
      padding: '1.5rem',
    },
  },
  ({ type }) => {
    if (type === 'error')
      return {
        p: {
          color: colors.danger,
        },
      }
  },
)

const Alert: FC<IProps> = ({ message, type }) => {
  return (
    <Container type={ type! }>
      <p>{ message }</p>
    </Container>
  )
}

export default Alert