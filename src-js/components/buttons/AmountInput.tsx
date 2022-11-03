import React, { FC } from 'react'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import IconDown from '../svg/IconDown'
import IconUp from '../svg/IconUp'
import colors from '../../styles/colors'

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${ margins.mobile.littleGap };
`

const ArrowButton = styled.button`
  // reset styles
  border: none;
  font: inherit;
  opacity: 1;
  appearance: none;

  display: flex;
  background: ${ colors.primary };
  border-radius: 999em;
  padding: .85em .7em;

  svg {
    fill: ${ colors.background };
    width: .8em;
  }
`

interface IProps {
  className?: string
  num: number
  setNum: (num: number) => void
  max?: number
}

/**
 * Component that defines an interactive amount controller.
 */
const AmountInput: FC<IProps> = ({num, setNum, max}) => {
  return (
    <Container>
      <ArrowButton>
        <IconDown />
      </ArrowButton>
      { num }
      <ArrowButton>
        <IconUp />
      </ArrowButton>
    </Container>
  )
}

export default AmountInput