import React, { FC } from 'react'
import styled from '@emotion/styled'
import Button from './Button'
import breakpoints from '../styles/breakpoints'

interface IProps {
  userName: string
}

const Container = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    margin: 0;
  }

  ${ breakpoints.smallTablet } {
    justify-content: flex-start;

    p {
      margin-right: 4rem;
    }
  }
`

/**
 * This component contains the welcome message for the user and the logout button.
 */
const WelcomeLayer: FC<IProps> = ({ userName }) => {
  return (
    <Container>
      <p>{ 'Bienvenido, ' + userName + '.' }</p>
      <Button customType={ 'flattened-secondary' }>{ 'Cerrar sesión' }</Button>
    </Container>
  )
}

export default WelcomeLayer