import React, { FC, Key } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'

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

export interface customerProps {
  key: Key
  name: string
  phoneNumber: string
}

const Customer: FC<customerProps> = (
  {
    name,
    phoneNumber,
  },
) => {
  return (
    <Container>
      <p>{ name } ({ phoneNumber })</p>
    </Container>
  )
}

export default Customer