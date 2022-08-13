import React, { FC } from 'react'
import styled from '@emotion/styled'
import Label from '../Label'
import Input from '../Input'
import Button from '../Button'
import Form from '../Form'
import ButtonTypes from '../../shapes/ButtonTypes'
import fonts from '../../styles/fonts'
import margins from '../../styles/margins'

const Options = styled.div`
  align-items: flex-start;
  --horizontal-margin: ${ margins.mobile.vertical };
  --vertical-margin: ${ margins.mobile.vertical };
  
  column-gap: var(--horizontal-margin);
  row-gap: var(--vertical-margin);
  
  div {
    align-items: start;
    flex-basis: min-content;
    flex-grow: 1;
    
    p {
      margin: 0
    }
  }
`

const Container = styled.article`
  display: flex;
  flex-direction: column;
  padding: ${ margins.mobile.lateral };
  row-gap: ${ margins.mobile.mediumVertical };

  ${ Options } {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

interface IProps {
  removable: boolean
  handleCloseSidePanel: () => void
}

const EditCustomer: FC<IProps> = ({ removable, handleCloseSidePanel }) => {
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
        <Options>
          <Button type={ 'button' } customType={ ButtonTypes.Secondary }
                  onClick={ handleCloseSidePanel }>Cancelar</Button>
          <Button type={ 'button' } customType={ ButtonTypes.Primary }>Guardar cambios</Button>
          <div>
            <Button type={ 'button' } customType={ ButtonTypes.Danger } disabled={ !removable }>Eliminar</Button>
            {
              !removable &&
              <p css={ fonts.formMessage }>No es posible eliminar este cliente porque tiene pedidos registrados a su
                nombre.</p>
            }
          </div>
        </Options>
      </Form>
    </Container>
  )
}

export default EditCustomer