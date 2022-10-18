import React, { FC, ReactElement } from 'react'
import { EditableCustomerProps } from './EditableCustomer'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import { CustomerProps } from './Customer'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.vertical };
`

interface IProps {
  customerList: ReactElement<EditableCustomerProps | CustomerProps>[] | undefined
}

const CustomersContainer: FC<IProps> = ({ customerList }) => {
  return (
    <Container children={ customerList } />
  )
}

export default CustomersContainer