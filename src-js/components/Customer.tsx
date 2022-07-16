import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import SlideButton from './SlideButton'
import { css } from '@emotion/react'
import Button from './Button'
import fonts from '../styles/fonts'

const Container = styled.div`
  max-height: 3.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${ colors.primary };
  overflow: hidden;
  padding-left: 1rem;
  transition: max-height 1s ease;

  p {
    margin: 0;
  }
`

const ShownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 3.5rem;
`

const HiddenContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 1rem;

  p {
    flex-grow: 1;
  }
`

const NoRemoveMessage = styled.p`
  ${ fonts.formMessage }
`

const openStyles = css`
  max-height: 15rem;
`

interface IProps {
  name: string
  phoneNumber: string
  editable: boolean
  noRemoveMessage?: string
}

const Customer: FC<IProps> = ({ name, phoneNumber, editable, noRemoveMessage }) => {
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
      <HiddenContainer>
        <Button customType={ 'secondary' }>Editar</Button>
        <Button customType={ 'danger' } disabled={ noRemoveMessage !== undefined }>Eliminar</Button>
        { noRemoveMessage !== undefined ? <NoRemoveMessage>{ noRemoveMessage }</NoRemoveMessage> : null }
      </HiddenContainer>
    </Container>
  )
}

export default Customer