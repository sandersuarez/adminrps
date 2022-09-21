import React, { FC } from 'react'
import { Login } from '../hooks/useSession'
import Form from './Form'
import Label from './Label'
import Input from './Input'
import Button from './buttons/Button'
import ButtonTypes from '../shapes/ButtonTypes'
import styled from '@emotion/styled'
import margins from '../styles/margins'
import useValid from '../hooks/useValid'
import InputMessage from './InputMessage'
import Alert from './Alert'

const Container = styled.div`
  --lateral-margin: ${ margins.mobile.lateral };

  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: ${ margins.mobile.bigVertical };
  padding-left: var(--lateral-margin);
  padding-right: var(--lateral-margin);

  & > div {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 51.2rem;
  }

  h2 {
    margin-bottom: 3.5rem;
  }
`

interface IProps {
  login: (details: Login['Request']) => void
}

const LoginForm: FC<IProps> = ({ login }) => {

  const doLogin = () => {
    login({
      username: values['username'],
      key: values['password'],
    })
    console.log('login')
  }

  const { handleChange, values, errors, setErrors, handleSubmit } = useValid(doLogin)

  return (
    <Container>
      <div>
        <h2>Iniciar sesión</h2>
        <Form onSubmit={ handleSubmit } noValidate={ true }>
          <div>
            <Label htmlFor={ 'username' }>{ 'Usuario:' }</Label>
            <Input
              type={ 'text' }
              id={ 'username' }
              name={ 'username' }
              maxLength={ 60 }
              onChange={ handleChange }
              onBlur={ handleChange }
              valid={ errors['username'] === undefined }
            />
            <InputMessage message={ errors['username'] } />
          </div>
          <div>
            <Label htmlFor={ 'password' }>{ 'Contraseña:' }</Label>
            <Input
              type={ 'password' }
              id={ 'password' }
              name={ 'password' }
              maxLength={ 8 }
              onChange={ handleChange }
              onBlur={ handleChange }
              valid={ errors['password'] === undefined }
            />
            <InputMessage message={ errors['password'] } />
          </div>
          {
            errors['form'] &&
            <Alert message={ errors['form'] } />
          }
          <Button customType={ ButtonTypes.Primary }>{ 'Iniciar Sesión' }</Button>
        </Form>
      </div>
    </Container>
  )
}

export default LoginForm