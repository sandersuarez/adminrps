import React, { FC, FormEventHandler, useEffect, useState } from 'react'
import { Login, SessionMessage, SessionMessageTypes } from '../../hooks/useSession'
import Form from './Form'
import Label from './Label'
import Input from './Input'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import useValid from '../../hooks/useValid'
import InputMessage from './InputMessage'
import Alert from '../Alert'
import AlertTypes from '../../shapes/AlertTypes'
import { css } from '@emotion/react'
import breakpoints from '../../styles/breakpoints'
import sizes from '../../styles/sizes'
import colors from '../../styles/colors'
import FieldWrapper from './FieldWrapper'

const Container = styled.div`
  --lateral-margin: ${ margins.mobile.lateral };

  display: flex;
  width: 100%;
  justify-content: start;
  margin-top: ${ margins.mobile.mediumVertical };
  padding-left: var(--lateral-margin);
  padding-right: var(--lateral-margin);

  & > div {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: ${ sizes.inputMaxWidth };
  }

  h2 {
    display: none;
  }

  ${ breakpoints.formLimits } {
    margin-top: auto;
    margin-bottom: auto;
    justify-content: center;

    h2 {
      display: inherit;
      margin-bottom: ${ margins.mobile.bigVertical };
    }

    & > div {
      padding: ${ margins.tablet.lateral };
      border: 1px solid ${ colors.primary };
    }
  }
`

interface IProps {
  login: (details: Login['Request']) => void
  message: SessionMessage | undefined
}

const LoginForm: FC<IProps> = ({ login, message }) => {

  const [serverError, setServerError] = useState<string | undefined>(undefined)
  const [serverMessage, setServerMessage] = useState<string | undefined>(undefined)

  const doLogin = () => {
    login({
      username: values['username'],
      key: values['password'],
    })
  }

  const {
    handleChange: handleValidChange,
    values,
    errors1,
    errors2,
    setErrors2,
    handleSubmit: handleValidSubmit,
  } = useValid(doLogin)

  useEffect(() => {
    if (message?.type === SessionMessageTypes.Warning || message?.type === SessionMessageTypes.Info) {
      if (serverError) {
        setServerError(undefined)
      }

      if (message?.type === SessionMessageTypes.Warning) {
        if (serverMessage) {
          setServerMessage(undefined)
        }
        setErrors2({ warning: message.content })
      } else {
        setServerMessage(message.content)
      }
    } else if (message?.type === SessionMessageTypes.Error) {
      if (serverMessage) {
        setServerMessage(undefined)
      }
      setServerError(message.content)
    }
  }, [message])

  const handleChange: FormEventHandler<HTMLInputElement> = (e) => {
    if (serverMessage) {
      setServerMessage(undefined)
    }
    handleValidChange(e)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    if (serverMessage) {
      setServerMessage(undefined)
    }
    if (serverError) {
      setServerError(undefined)
    }
    handleValidSubmit(e)
  }

  return (
    <Container>
      <div>
        {
          serverMessage &&
          <Alert css={ css`margin-bottom: ${ margins.mobile.bigVertical }` } message={ serverMessage }
                 type={ AlertTypes.Info } />
        }
        {
          serverError &&
          <Alert css={ css`margin-bottom: ${ margins.mobile.bigVertical }` }
                 message={ serverError + '. Contacte con el administrador.' } type={ AlertTypes.Error } />
        }
        <h2>Iniciar sesión</h2>
        <Form onSubmit={ handleSubmit } noValidate={ true }>
          {
            Object.values(errors2)[0] &&
            <Alert css={ css`margin-bottom: ${ margins.mobile.littleGap }` } message={ Object.values(errors2)[0] }
                   type={ AlertTypes.Warning } />
          }
          <FieldWrapper>
            <Label htmlFor={ 'username' }>{ 'Usuario:' }</Label>
            <div>
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
          </FieldWrapper>
          <FieldWrapper>
            <Label htmlFor={ 'password' }>{ 'Contraseña:' }</Label>
            <div>
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
          </FieldWrapper>
          <Button customType={ ButtonTypes.Primary }>{ 'Iniciar Sesión' }</Button>
        </Form>
      </div>
    </Container>
  )
}

export default LoginForm