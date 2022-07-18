import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import SlideButton from './SlideButton'
import { css } from '@emotion/react'
import Button from './Button'
import fonts from '../styles/fonts'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  height: 3.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${ colors.primary };
  overflow: hidden;
  padding-left: 1rem;
  transition: height 1s ease;

  p {
    margin: 0;
  }

  ${ breakpoints.tablet } {
    height: 4.5rem;
    padding-left: 1.5rem;
  }
`

const ShownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;

  p {
    overflow: hidden;
    white-space: nowrap;
  }

  ${ breakpoints.tablet } {
    height: 4.5rem;
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
  height: 14rem;

  ${ breakpoints.tablet } {
    height: 14rem;
  }
`

interface IProps {
  name: string
  phoneNumber: string
  editable: boolean
  removable: boolean
}

const Customer: FC<IProps> = ({ name, phoneNumber, editable, removable }) => {
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