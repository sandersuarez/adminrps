import React, { FC, ReactNode } from 'react'
import { css } from '@emotion/react'
import breakpoints from '../styles/breakpoints'
import Button from './Button'

const FixedButtonStyles = css`
  position: fixed;
  bottom: 7.5rem;
  right: 2rem;
  z-index: 1;

  ${ breakpoints.tablet } {
    bottom: 8.5rem;
    right: 3rem;
  }

  ${ breakpoints.desktop } {
    bottom: 2rem;
    right: 4rem;
  }
`

interface IProps {
  children?: ReactNode
}

const FixedButton: FC<IProps> = ({ children }) => {
  return (
    <Button customType={ 'secondary' } css={ FixedButtonStyles }>{ children }</Button>
  )
}

export default FixedButton