import React, { FC } from 'react'
import styled from '@emotion/styled'
import Button from './buttons/Button'
import breakpoints from '../styles/breakpoints'
import ButtonTypes from '../shapes/ButtonTypes'

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

interface IProps {
  userName: string
  logout: () => void
}

/**
 * This component contains the welcome message for the user and the logout button.
 */
const WelcomeLayer: FC<IProps> = ({ userName, logout }) => {
  return (
    <Container>
      <p>{ 'Bienvenido, ' + userName + '.' }</p>
      <Button customType={ ButtonTypes.FlattenedSecondary } onClick={ logout }>{ 'Cerrar sesión' }</Button>
    </Container>
  )
}

export default WelcomeLayer