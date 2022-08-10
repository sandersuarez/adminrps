import React, { FC } from 'react'
import styled from '@emotion/styled'
import SearchBar from '../SearchBar'
import Alert from '../Alert'
import Pagination from '../Pagination'
import CustomersContainer from './CustomersContainer'
import EditableCustomer from './EditableCustomer'

interface IProps {
  title?: boolean
}

const Container = styled.article`
  
`

const Customers: FC<IProps> = ({ title }) => {
  return (
    <Container>
      { title ? <h2>{ 'Clientes' }</h2> : null }
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <CustomersContainer
        customerList=
          { [
            <EditableCustomer key={ 0 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 1 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 2 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ false } />,
            <EditableCustomer key={ 3 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 4 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ false } />,
            <EditableCustomer key={ 5 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ false } />,
            <EditableCustomer key={ 6 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 7 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 8 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ false } />,
            <EditableCustomer key={ 9 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 10 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 11 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ false } />,
            <EditableCustomer key={ 12 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
            <EditableCustomer key={ 13 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } removable={ true } />,
          ] }
      />
      <Pagination />
    </Container>
  )
}

export default Customers