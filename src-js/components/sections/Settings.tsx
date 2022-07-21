import React from 'react'
import PasswordChange from '../PasswordChange'
import Input from '../Input'
import Button from '../Button'
import Label from '../Label'
import styled from '@emotion/styled'
import fonts from '../../styles/fonts'
import breakpoints from '../../styles/breakpoints'
import { css } from '@emotion/react'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  row-gap: 1rem;

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
  column-gap: 1rem;
  row-gap: 1rem;

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
    <section>
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
    </section>
  )
}

export default Settings