import React, { FC, Key } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import { css } from '@emotion/react/dist/emotion-react.cjs'
import IconDown from '../svg/IconDown'
import IconUp from '../svg/IconUp'
import AmountInput from '../buttons/AmountInput'

const Container = styled.div`
  display: flex;
  border-radius: .5rem;
  border: 1px solid ${ colors.primary };
  padding: .75em 1em;

  p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
  }
`

interface IProps {
  key: Key
  id: number
  name: string
  price: string
  stock?: number
}

const SelectableProduct: FC<IProps> = ({ id, name, price, stock }) => {
  return (
    <Container>
      <p>{ name }{ '(' + price + ')' }</p>
      {
        stock &&
        <p>{ 'Stock: ' + stock }</p>
      }
      <AmountInput />
    </Container>
  )
}

export default SelectableProduct