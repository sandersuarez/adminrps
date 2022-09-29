import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import Input from './Input'
import Button from '../buttons/Button'
import Label from './Label'
import margins from '../../styles/margins'
import Form from './Form'
import ButtonTypes from '../../shapes/ButtonTypes'

const Container = styled.article`
  margin-top: ${ margins.mobile.bigVertical };
  display: flex;
  flex-direction: column;
  gap: ${ margins.mobile.mediumVertical };

  ${ breakpoints.tablet } {
    margin: 2.5rem 0 0 0;
  }
`

const PasswordChange = () => {
  return (
    <Container>
      <h2>Cambiar contraseña</h2>
      <Form noValidate>
        <div>
          <Label htmlFor={ 'old-password' }>Contraseña anterior:</Label>
          <Input id={ 'old-password' } />
        </div>
        <div>
          <Label htmlFor={ 'new-password' }>Nueva contraseña:</Label>
          <Input id={ 'new-password' } />
        </div>
        <div>
          <Label htmlFor={ 'rep-new-password' }>Repetir nueva contraseña:</Label>
          <Input id={ 'rep-new-password' } />
        </div>
        <Button customType={ ButtonTypes.Secondary }>Cambiar contraseña</Button>
      </Form>
    </Container>
  )
}

export default PasswordChange