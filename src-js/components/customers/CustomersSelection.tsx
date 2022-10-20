import React, { FC, ReactElement, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import SearchBar from '../SearchBar'
import Alert from '../Alert'
import Pagination from '../Pagination'
import CustomersContainer from './CustomersContainer'
import margins from '../../styles/margins'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Options from '../buttons/Options'
import Customer, { CustomerProps } from './Customer'
import { CustomerMessage, CustomerMessageTypes, GetCustomers } from '../../hooks/useCustomers'
import AlertTypes from '../../shapes/AlertTypes'
import CustomerShape from '../../shapes/CustomerShape'

const Container = styled.article`
  --vertical-margin: ${ margins.mobile.mediumVertical };
  --horizontal-margin: ${ margins.mobile.lateral };

  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: var(--vertical-margin) var(--horizontal-margin);
`

interface IProps {
  closeSidePanel: () => void
  activePage: number
  totalPages: number
  setActivePage: (page: number) => void
  message: CustomerMessage | undefined
  customers: CustomerShape[] | undefined
  getCustomers: (data: GetCustomers['Request']) => void
}

const Customers: FC<IProps> = (
  {
    closeSidePanel,
    activePage,
    totalPages,
    setActivePage,
    message,
    customers,
    getCustomers,
  }) => {

  const [customerList, setCustomerList] = useState<ReactElement<CustomerProps>[]>()

  const cancel = () => {
    closeSidePanel()
  }

  useEffect(() => {
    if (customers !== undefined) {
      let list: ReactElement<CustomerProps>[] = []
      customers.forEach((customer, index) => {
        // noinspection SpellCheckingInspection
        list.push(
          <Customer key={ index } name={ customer.namecustomer } phoneNumber={ customer.telcustomer } />,
        )
      })
      setCustomerList(list)
    }
  }, [customers])

  useEffect(() => {
    // noinspection SpellCheckingInspection
    getCustomers({
      telname: '',
      customers_number: 15,
      page: 1,
    })
  }, [activePage])

  return (
    <Container>
      {
        message !== undefined && message.type === CustomerMessageTypes.Info &&
        <Alert message={ message.content } type={ AlertTypes.Empty } />
      }
      {
        message !== undefined && message.type === CustomerMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      {
        customers !== undefined && <SearchBar />
      }
      <Options>
        {
          customers !== undefined && <Button customType={ ButtonTypes.Primary }>{ 'Seleccionar' }</Button>
        }
        <Button customType={ ButtonTypes.Secondary } onClick={ cancel }>{ 'Cancelar' }</Button>
      </Options>
      {
        customers !== undefined &&
        <>
          <CustomersContainer customerList={ customerList } />
          <Pagination activePage={ activePage } totalPages={ totalPages } setActivePage={ setActivePage } />
        </>
      }
    </Container>
  )
}

export default Customers