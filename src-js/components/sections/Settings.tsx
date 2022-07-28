import React from 'react'
import PasswordChange from '../PasswordChange'
import Input from '../Input'
import Button from '../Button'
import Label from '../Label'
import styled from '@emotion/styled'
import fonts from '../../styles/fonts'
import breakpoints from '../../styles/breakpoints'
import { css } from '@emotion/react'
import margins from '../../styles/margins'

const Container = styled.section`
  padding: ${ margins.mobile.lateral };

  ${ breakpoints.tablet } {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  ${ breakpoints.desktop } {
    order: 2;
    padding: 1.5rem 3rem 2rem 3rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: ${ margins.mobile.mediumVertical };
  row-gap: ${ margins.mobile.mediumVertical };

  ${ breakpoints.tablet } {
    margin-top: 2rem;
    row-gap: 1.5rem;
  }
`
const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${ margins.mobile.vertical };

  ${ breakpoints.tablet } {
    column-gap: 2rem;
  }
`

const Note = styled.p`
  ${ fonts.formMessage }
  display: block;
  max-width: 46rem;
  margin: 0;
`

const ivaInputStyles = css`
  max-width: 6.3rem;

  ${ breakpoints.tablet } {
    max-width: 8rem;
  }
`

const Settings = () => {
  return (
    <Container>
      <h2>Ajustes</h2>
      <Form>
        <FieldWrapper css={
          css`
            ${ breakpoints.tablet } {
              column-gap: 3rem;
            }
          `
        }>
          <Label>IVA aplicado:</Label>
          <Input css={ ivaInputStyles } />
        </FieldWrapper>
        <FieldWrapper>
          <Button customType={ 'secondary' }>Aplicar IVA</Button>
          <Note>Nota: un cambio en el IVA aplicado a los productos se verá reflejado en todos los pedidos, incluidos los
            antiguos.</Note>
        </FieldWrapper>
      </Form>
      <PasswordChange />
    </Container>
  )
}

export default Settings