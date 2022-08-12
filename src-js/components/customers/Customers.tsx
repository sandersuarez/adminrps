import React, { FC, Key } from 'react'
import styled from '@emotion/styled'
import SearchBar from '../SearchBar'
import Alert from '../Alert'
import Pagination from '../Pagination'
import CustomersContainer from './CustomersContainer'
import EditableCustomer from './EditableCustomer'
import margins from '../../styles/margins'

const Container = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: ${margins.mobile.mediumVertical};
  padding: ${margins.mobile.lateral};
`

interface IProps {
  title?: boolean
}

const Customers: FC<IProps> = ({ title }) => {

  const [openedElement, setOpenedElement] = React.useState<Key>('')

  const handleCustomerClick = (index: Key) => {
    setOpenedElement(index)
  }

  return (
    <Container>
      { title ? <h2>{ 'Clientes' }</h2> : null }
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <CustomersContainer
        customerList=
          { [
            <EditableCustomer key={ 0 } index={ 0 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 1 } index={ 1 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 2 } index={ 2 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ false } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 3 } index={ 3 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 4 } index={ 4 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ false } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 5 } index={ 5 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ false } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 6 } index={ 6 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 7 } index={ 7 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 8 } index={ 8 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ false } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 9 } index={ 9 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 10 } index={ 10 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 11 } index={ 11 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ false } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 12 } index={ 12 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
            <EditableCustomer key={ 13 } index={ 13 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                              removable={ true } handleCustomerClick={ handleCustomerClick }
                              openedElement={ openedElement } />,
          ] }
      />
      <Pagination />
    </Container>
  )
}

export default Customers