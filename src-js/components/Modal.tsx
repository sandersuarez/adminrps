import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import { ButtonProps } from './Button'

const Container = styled.article({ background: colors.section })

const TopBar = styled.div({
  height: '3.3rem',
  background: colors.primary,
})

const CloseButton = styled.button({
  width: '3.3rem',
  height: '3.3rem',
  display: 'flex',

  '& > svg': {
    margin: 'auto',
    width: '2rem',
  },
})

export interface AlertProps {
  onClose: () => void
  message: string
  leftButton: ReactElement<ButtonProps>
  rightButton: ReactElement<ButtonProps>
}

const Modal: FC<AlertProps> = () => {
  return (
    <Container>

    </Container>
  )
}

export default Modal
