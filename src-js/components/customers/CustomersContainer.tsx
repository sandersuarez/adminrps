import React, { FC, ReactElement } from 'react'
import { editableCustomerProps } from './EditableCustomer'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import { customerProps } from './Customer'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.vertical };
`

interface IProps {
  customerList: ReactElement<editableCustomerProps | customerProps>[]
}

const CustomersContainer: FC<IProps> = ({ customerList }) => {
  return (
    <Container children={ customerList } />
  )
}

export default CustomersContainer