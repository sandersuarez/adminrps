import React, { FC, Key, useState } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import AmountInput from '../buttons/AmountInput'
import { motion } from 'framer-motion'
import margins from '../../styles/margins'
import breakpoints from '../../styles/breakpoints'

const Container = styled(motion.div)`
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

  ${ breakpoints.tablet } {
    flex-basis: calc(50% - (${ margins.tablet.gridSpace } / 2));
    flex-grow: 1;
  }

  ${ breakpoints.desktop } {
    flex-basis: 100%;
  }

  ${ breakpoints.bigDesktop } {
    flex-basis: calc(50% - (${ margins.tablet.gridSpace } / 2));
  }
`

interface IProps {
  key: Key
  id: number
  name: string
  price: string
  stock?: number
  initialAmount?: number
  setAmount: (id: number, amount: number) => void
}

const SelectableProduct: FC<IProps> = (
  {
    id,
    name,
    price,
    stock,
    initialAmount,
    setAmount,
  }) => {

  const [added, setAdded] = useState<boolean>(initialAmount === undefined ? false : initialAmount > 0)

  const setNum = (amount: number) => {
    setAdded(amount > 0)
    setAmount(id, amount)
  }

  return (
    <Container
      initial={ (added) ? { backgroundColor: colors.menu } : { backgroundColor: colors.background } }
      animate={ (added) ? { backgroundColor: colors.menu } : { backgroundColor: colors.background } }
      transition={ { ease: 'easeInOut', duration: .2 } }
    >
      <p>{ name }{ ' (' + price + ')' }</p>
      {
        stock &&
        <p>{ 'Stock: ' + stock }</p>
      }
      <AmountInput initialNum={ initialAmount } pushNum={ setNum } max={ stock ? stock : 32767 } min={ 0 } />
    </Container>
  )
}

export default SelectableProduct