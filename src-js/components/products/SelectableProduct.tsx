import React, { FC, Key } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import { css } from '@emotion/react/dist/emotion-react.cjs'
import IconDown from '../svg/IconDown'
import IconUp from '../svg/IconUp'
import AmountInput from '../buttons/AmountInput'

const Container = styled.div`
  --rigth-round: 2.5rem;
  --left-round: .5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--left-round) var(--rigth-round) var(--rigth-round) var(--left-round);
  border: 1px solid ${ colors.primary };
  padding: .25em .35em .25em 1em;

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
  amount: number
  setAmount: (amount: number) => void
}

const SelectableProduct: FC<IProps> = (
  {
    id,
    name,
    price,
    stock,
    amount,
    setAmount,
  }) => {

  return (
    <Container>
      <p>{ name }{ ' (' + price + ')' }</p>
      {
        stock &&
        <p>{ 'Stock: ' + stock }</p>
      }
      <AmountInput num={ amount } setNum={ setAmount } max={ stock } />
    </Container>
  )
}

export default SelectableProduct