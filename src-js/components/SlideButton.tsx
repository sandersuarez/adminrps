import React, { FC } from 'react'
import styled from '@emotion/styled'
import IconUpDown from './svg/IconUpDown'
import { css } from '@emotion/react'
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

  ${ breakpoints.tablet } {
    --dimensions: 4.5rem;
  }
`

const svgStyles = css`
  width: 1.5rem;
  transform: rotate(180deg);
  transition: transform .5s ease;
`

const activeStyles = css`
  transform: rotate(0deg);
`

interface IProps {
  onSlideButtonClick: () => void
  open: boolean
}

const SlideButton: FC<IProps> = ({ onSlideButtonClick, open }) => {
  return (
    <SlideButtonContainer onClick={ onSlideButtonClick }>
      <IconUpDown css={ [svgStyles, open ? activeStyles : undefined] } />
    </SlideButtonContainer>
  )
}

export default SlideButton