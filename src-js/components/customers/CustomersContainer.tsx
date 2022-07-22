import React, { FC, ReactElement } from 'react'
import { CustomerProps } from './Customer'
import styled from '@emotion/styled'

interface IProps {
  customerList: ReactElement<CustomerProps>[]
}

const Container = styled.div`

`

const CustomersContainer: FC<IProps> = ({ customerList }) => {
  return (
    <Container children={ customerList } />
  )
}

export default CustomersContainer