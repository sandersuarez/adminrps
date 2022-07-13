import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Input from './Input'
import Button from './Button'
import Label from './Label'

const Container = styled.article`
  margin: 1rem 0 0 0;
  
  ${ breakpoints.tablet } {
    margin: 2rem 0 0 0;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  margin-top: 1.5rem;
  
  ${breakpoints.tablet} {
    margin-top: 2rem;
    row-gap: 1.5rem;
  }
`

const PasswordChange = () => {
  return (
    <Container>
      <h2>Cambiar contraseña</h2>
      <Form noValidate>
        <Label htmlFor={'old-password'}>Contraseña anterior:</Label>
        <Input id={'old-password'}/>
        <Label htmlFor={'new-password'}>Nueva contraseña:</Label>
        <Input id={'new-password'}/>
        <Label htmlFor={'rep-new-password'}>Repetir nueva contraseña:</Label>
        <Input id={'rep-new-password'}/>
        <Button customType={'secondary'}>Cambiar contraseña</Button>
      </Form>
    </Container>
  )
}

export default PasswordChange