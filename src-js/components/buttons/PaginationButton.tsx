import React, { FC, MouseEventHandler, ReactNode } from 'react'
import ButtonTypes from '../../shapes/ButtonTypes'
import Button from './Button'
import styled from '@emotion/styled'

const Container = styled(Button)`
  position: relative;
  border-radius: 0;
  padding: 1.4em;

  p {
    position: absolute;
    font-weight: normal;
    margin: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

interface IProps {
  className?: string
  customType: ButtonTypes
  onClick?: () => void
  children?: ReactNode
}

const PaginationButton: FC<IProps> =
  ({
     className,
     customType,
     onClick,
     children,
   }) => {
    return (
      <Container className={ className } customType={ customType } onClick={ onClick }>
        <p>{ children }</p>
      </Container>
    )
  }

export default PaginationButton