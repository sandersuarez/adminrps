import React, { FC, FormEventHandler, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import IconDown from '../svg/IconDown'
import IconUp from '../svg/IconUp'
import colors from '../../styles/colors'

const Container = styled.div`
  display: flex;
  flex-direction: row;
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

  &[disabled] {
    opacity: .6
  }

  svg {
    fill: ${ colors.background };
    width: .8em;
  }
`

interface IProps {
  className?: string
  initialNum?: number
  pushNum: (num: number) => void
  max?: number
  min?: number
}

/**
 * Component that defines an interactive amount controller.
 */
const AmountInput: FC<IProps> = ({ initialNum, pushNum, max, min }) => {

  const [num, setNum] = useState<number>(initialNum !== undefined ? initialNum : 0)

  const sum: FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    if (max !== undefined) {
      if (num < max) {
        setNum(num + 1)
      }
    } else {
      setNum(num + 1)
    }
  }

  const sub: FormEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    if (min !== undefined) {
      if (num > min) {
        setNum(num - 1)
      }
    } else {
      setNum(num - 1)
    }
  }

  useEffect(() => {
    pushNum(num)
  }, [num])

  useEffect(() => {
    if (initialNum !== undefined) {
      setNum(initialNum)
    }
  }, [initialNum])

  return (
    <Container>
      <ArrowButton onClick={ sub } disabled={ min !== undefined && num == min }>
        <IconDown />
      </ArrowButton>
      { num }
      <ArrowButton onClick={ sum } disabled={ max !== undefined && num == max }>
        <IconUp />
      </ArrowButton>
    </Container>
  )
}

export default AmountInput