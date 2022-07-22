import React, { FC, Key } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import SlideButton from './SlideButton'
import { css } from '@emotion/react'
import Button from './Button'
import fonts from '../styles/fonts'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  border-radius: 0.5rem;
  border: 1px solid ${ colors.primary };
  overflow: hidden;
  transition: height .5s ease;

  p {
    margin: 0;
  }
`

const ShownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    overflow: hidden;
    white-space: nowrap;
  }
`

const HiddenContainer = styled.div`
  --horizontal-margin: 1rem;
  --vertical-margin: 1rem;
  display: flex;
  flex-wrap: wrap;
  margin-top: .5rem;
  column-gap: var(--horizontal-margin);
  row-gap: var(--vertical-margin);

  p {
    flex-grow: 1;
    max-width: 36.5rem;
  }

  ${ breakpoints.smallTablet } {
    display: grid;
    grid-template-columns: min-content auto;

    p {
      grid-column: 2;
    }

    button {
      justify-self: start;
    }
  }

  ${ breakpoints.tablet } {
    --horizontal-margin: 2rem;
  }
`

const NoRemoveMessage = styled.p`
  ${ fonts.formMessage }
`

const openStyles = css`
`

export interface CustomerProps {
  key: Key
  name: string
  phoneNumber: string
  editable: boolean
  removable: boolean
}

const Customer: FC<CustomerProps> = ({ name, phoneNumber, editable, removable }) => {
  const [open, setOpen] = React.useState<boolean>(false)

  const onSlideButtonClick = () => {
    open ? setOpen(false) : setOpen(true)
  }

  return (
    <Container css={ open ? openStyles : null }>
      <ShownContainer>
        <p>{ name } ({ phoneNumber })</p>
        { editable ? <SlideButton onSlideButtonClick={ onSlideButtonClick } open={ open } /> : null }
      </ShownContainer>
      {
        editable ?
          <HiddenContainer>
            <Button customType={ 'secondary' }>Editar</Button>
            <Button customType={ 'danger' } disabled={ !removable }>Eliminar</Button>
            {
              removable ?
                null
                : <NoRemoveMessage>No es posible eliminar este cliente porque tiene pedidos registrados a su
                  nombre.</NoRemoveMessage>
            }
          </HiddenContainer>
          : null
      }
    </Container>
  )
}

export default Customer