import React, { FC } from 'react'
import styled from '@emotion/styled'
import IconUpDown from './svg/IconUpDown'
import { css, keyframes } from '@emotion/react'
import breakpoints from '../styles/breakpoints'

const SlideButtonContainer = styled.button`
  --dimensions: 3.5rem;

  // reset styling
  border: none;
  font: inherit;
  opacity: 1;
  appearance: none;
  background: transparent;

  width: var(--dimensions);
  height: var(--dimensions);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;

  svg {
    width: 1.5rem;
  }

  ${ breakpoints.tablet } {
    --dimensions: 4.5rem;
  }
`

const roll = keyframes`
  from {
    transform: rotate(180deg);
  }

  to {
    transform: rotate(0deg);
  }
`

const unroll = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(180deg);
  }
`

const activeStyles = css`
  transform: rotate(0deg);
  animation: ${ roll } 1s ease;
`

const inactiveStyles = css`
  transform: rotate(180deg);
  animation: ${ unroll } 1s ease;
`

interface IProps {
  onSlideButtonClick: () => void
  open: boolean
}

const SlideButton: FC<IProps> = ({ onSlideButtonClick, open }) => {
  return (
    <SlideButtonContainer onClick={ onSlideButtonClick }>
      <IconUpDown css={ open ? activeStyles : inactiveStyles } />
    </SlideButtonContainer>
  )
}

export default SlideButton