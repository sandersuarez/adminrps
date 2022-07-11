import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'

const Container = styled.article`
  margin: 1rem 0 0 0;
  
  ${ breakpoints.tablet } {
    margin: 2rem 0 0 0;
  }
`

const PasswordChange = () => {
  return (
    <Container>
      <h2>Cambiar contraseña</h2>
    </Container>
  )
}

export default PasswordChange