import React, { FC, Key, MouseEventHandler, useEffect } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import { css } from '@emotion/react'

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

export interface CustomerProps {
  key: Key
  id: number
  name: string
  phoneNumber: string
  setSelected: (id: number) => void
  selectedCustomer: number | undefined
  draftCustomerID: number | undefined
}

const Customer: FC<CustomerProps> = (
  {
    name,
    id,
    phoneNumber,
    setSelected,
    selectedCustomer,
    draftCustomerID,
  },
) => {

  const handleClick: MouseEventHandler<HTMLElement> = () => {
    if (draftCustomerID !== id) {
      setSelected(id)
    }
  }

  return (
    <Container
      onClick={ handleClick }
      css=
        {
          draftCustomerID === id ?
            css`background: ${ colors.secondary }`
            :
            selectedCustomer === id ? css`background: ${ colors.section }` : null
        }
    >
      <p>{ name } ({ phoneNumber })</p>
    </Container>
  )
}

export default Customer