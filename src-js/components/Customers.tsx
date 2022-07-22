import React, { FC } from 'react'
import styled from '@emotion/styled'
import SearchBar from './SearchBar'
import Alert from './Alert'
import Pagination from './Pagination'
import CustomersContainer from './CustomersContainer'
import Customer from './Customer'
import FixedButton from './FixedButton'

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
      <FixedButton>Nuevo cliente</FixedButton>
      <CustomersContainer
        customerList=
          { [
            <Customer key={ 0 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 1 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 2 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ false } />,
            <Customer key={ 3 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 4 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ false } />,
            <Customer key={ 5 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ false } />,
            <Customer key={ 6 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 7 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 8 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ false } />,
            <Customer key={ 9 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 10 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 11 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ false } />,
            <Customer key={ 12 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
            <Customer key={ 13 } name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true }
                      removable={ true } />,
          ] }
      />
      <Pagination />
    </Container>
  )
}

export default Customers