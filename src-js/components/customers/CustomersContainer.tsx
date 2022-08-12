import React, { FC, ReactElement } from 'react'
import { CustomerProps } from './EditableCustomer'
import styled from '@emotion/styled'
import margins from '../../styles/margins'

interface IProps {
  customerList: ReactElement<CustomerProps>[]
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${margins.mobile.vertical};
`

const CustomersContainer: FC<IProps> = ({ customerList }) => {
  return (
    <Container children={ customerList } />
  )
}

export default CustomersContainer