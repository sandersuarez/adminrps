import React, { FC } from 'react'
import styled from '@emotion/styled'
import Label from '../Label'
import Input from '../Input'
import Button from '../Button'
import Form from '../Form'
import ButtonTypes from '../../shapes/ButtonTypes'
import fonts from '../../styles/fonts'
import colors from '../../styles/colors'

const Container = styled.article`
background: ${colors.background};
`

interface IProps {
  removable: boolean
}

const EditCustomer: FC<IProps> = ({ removable }) => {
  return (
    <Container>
      <h2>Editar cliente</h2>
      <Form noValidate>
        <div>
          <Label htmlFor={ 'name' }>Nombre:</Label>
          <Input id={ 'name' } />
        </div>
        <div>
          <Label htmlFor={ 'phone-number' }>Número de teléfono:</Label>
          <Input id={ 'phone-number' } />
        </div>
        <div>
          <Button customType={ ButtonTypes.Secondary }>Cancelar</Button>
          <Button customType={ ButtonTypes.Primary }>Guardar cambios</Button>
          <div>
            <Button customType={ ButtonTypes.Danger } disabled={ !removable }>Eliminar</Button>
            {
              removable &&
              <p css={ fonts.formMessage }>No es posible eliminar este cliente porque tiene pedidos registrados a su
                nombre.</p>
            }
          </div>
        </div>
      </Form>
    </Container>
  )
}

export default EditCustomer