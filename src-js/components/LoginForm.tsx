import React, { FC, FormEventHandler } from 'react'
import { Login } from '../hooks/useSession'
import Form from './Form'
import Label from './Label'
import Input from './Input'
import Button from './buttons/Button'
import ButtonTypes from '../shapes/ButtonTypes'
import styled from '@emotion/styled'
import margins from '../styles/margins'

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: ${ margins.mobile.bigVertical };
`

interface IProps {
  login: (details: Login['Request']) => void
}

const LoginForm: FC<IProps> = ({ login }) => {

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    //login()
  }

  return (
    <Container>
      <h2>Iniciar sesión</h2>
      <Form onSubmit={ handleSubmit }>
        <Label htmlFor={ 'username' }>{ 'Usuario:' }</Label>
        <Input type={ 'text' } id={ 'username' } name={ 'username' } maxLength={ 60 } required />
        <Label htmlFor={ 'password' }>{ 'Contraseña:' }</Label>
        <Input type={ 'password' } id={ 'password' } name={ 'password' } maxLength={ 8 } required />
        <Button customType={ ButtonTypes.Primary }>{ 'Iniciar Sesión' }</Button>
      </Form>
    </Container>
  )
}

export default LoginForm