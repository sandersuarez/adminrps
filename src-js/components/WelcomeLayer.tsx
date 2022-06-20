import React, { FC } from 'react'
import styled from '@emotion/styled'
import Button from './Button'
import breakpoints from '../styles/breakpoints'

interface IProps {
  userName: string
}

const Container = styled.article({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  p: {
    margin: 0,
  },
  [breakpoints.smallTablet]: {
    justifyContent: 'flex-start',
    p: {
      margin: '0 4rem 0 0',
    },
  },
})

const WelcomeLayer: FC<IProps> = ({ userName }) => {
  return (
    <Container>
      <p>Bienvenido, { userName }.</p>
      <Button customType={ 'flattened-secondary' }>Cerrar sesión</Button>
    </Container>
  )
}

export default WelcomeLayer