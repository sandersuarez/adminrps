import React, { FC } from 'react'
import styled from '@emotion/styled'
import IconUpDown from './svg/IconUpDown'
import { css } from '@emotion/react'

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

  svg {
    width: 1.5rem;
    transition: transform .3s ease;
  }
`

const activeStyles = css`
  transform: rotate(180deg);
`

interface IProps {
  onSlideButtonClick: () => void
  open: boolean
}

const SlideButton: FC<IProps> = ({ onSlideButtonClick, open }) => {
  return (
    <SlideButtonContainer onClick={ onSlideButtonClick }>
      <IconUpDown css={ open ? activeStyles : null } />
    </SlideButtonContainer>
  )
}

export default SlideButton