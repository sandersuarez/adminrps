import React, { FC } from 'react'
import { Login, SessionMessage } from '../hooks/useSession'
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
import AlertTypes from '../shapes/AlertTypes'
import { css } from '@emotion/react'
import breakpoints from '../styles/breakpoints'

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

  ${ breakpoints.tablet } {
    --lateral-margin: ${ margins.tablet.lateral };
  }

  ${ breakpoints.desktop } {
    --lateral-margin: 6rem;
    justify-content: start;
  }
`

interface IProps {
  login: (details: Login['Request']) => void
  message: SessionMessage | undefined
}

const LoginForm: FC<IProps> = ({ login, message }) => {

  const doLogin = () => {
    login({
      username: values['username'],
      key: values['password'],
    })
  }

  const { handleChange, values, errors1, errors2, setErrors2, handleSubmit } = useValid(doLogin)

  return (
    <Container>
      <div>
        <h2>Iniciar sesión</h2>
        <Form onSubmit={ handleSubmit } noValidate={ true }>
          {
            Object.values(errors2)[0] &&
            <Alert css={ css`margin-bottom: 2rem` } message={ Object.values(errors2)[0] }
                   type={ AlertTypes.Warning } />
          }
          <div>
            <Label htmlFor={ 'username' }>{ 'Usuario:' }</Label>
            <Input
              type={ 'text' }
              id={ 'username' }
              name={ 'username' }
              maxLength={ 60 }
              onChange={ handleChange }
              onBlur={ handleChange }
              valid={ errors1['username'] === undefined }
            />
            <InputMessage message={ errors1['username'] } />
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
              valid={ errors1['password'] === undefined }
            />
            <InputMessage message={ errors1['password'] } />
          </div>
          <Button customType={ ButtonTypes.Primary }>{ 'Iniciar Sesión' }</Button>
        </Form>
      </div>
    </Container>
  )
}

export default LoginForm