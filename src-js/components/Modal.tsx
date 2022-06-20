import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import { ButtonProps } from './Button'

const Wrapper = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vw',
  backgroundColor: 'rgba(255, 255, 255, .7)',
})

const Container = styled.article({
  maxWidth: '40rem',
  background: colors.section,
})

const TopBar = styled.div({
  position: 'relative',
  height: '3.3rem',
  background: colors.primary,
})

const CloseButton = styled.button({
  position: 'absolute',
  top: '0',
  right: 0,
  width: '3.3rem',
  height: '3.3rem',
  display: 'flex',

  '& > svg': {
    margin: 'auto',
    width: '2rem',
  },
})

const P = styled.p({
  margin: '1.5rem 0 1.8rem',
})

const ButtonsContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '1rem',
})

export interface AlertProps {
  onCloseClick: () => void
  message: string
  leftButton: ReactElement<ButtonProps>
  rightButton: ReactElement<ButtonProps>
}

const Modal: FC<AlertProps> = (
  { onCloseClick, message, leftButton, rightButton },
) => (
  <Wrapper>
    <Container>
      <TopBar>
        <CloseButton onClick={ onCloseClick } />
      </TopBar>
      <P>{ message }</P>
      <ButtonsContainer>
        { leftButton }
        { rightButton }
      </ButtonsContainer>
    </Container>
  </Wrapper>
)

export default Modal
