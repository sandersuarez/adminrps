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
import { css } from '@emotion/react'
import colors from '../../styles/colors'

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
  setDraftCustomerID: (id: number) => void
  draftCustomerID: number | undefined
  setSelectedCustomer: (id: number | undefined) => void
  selectedCustomer: number | undefined
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
    draftCustomerID,
    setDraftCustomerID,
    setSelectedCustomer,
    selectedCustomer,
  }) => {

  const [searchString, setSearchString] = useState<string>('')

  const [matches, setMatches] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

  const handleCustomerClick = (id: number) => {
    setSelectedCustomer(id)
  }

  const select = () => {
    if (selectedCustomer !== undefined && selectedCustomer !== draftCustomerID) {
      setDraftCustomerID(selectedCustomer)
      closeSidePanel()
    }
  }

  useEffect(() => {
    window
      .matchMedia('(min-width: 700px)')
      .addEventListener('change', e => setMatches(e.matches))
  }, [])

  useEffect(() => {
    // noinspection SpellCheckingInspection
    getCustomers({
      telname: searchString,
      customers_number: matches ? 30 : 15,
      page: 1,
    })
  }, [activePage, searchString, matches])

  return (
    <Container>
      {
        message !== undefined && message.type === CustomerMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      <SearchBar searchString={ searchString } setSearchString={ setSearchString } />
      <Options>
        {
          customers !== undefined &&
          <Button
            customType={ ButtonTypes.Primary }
            onClick={ select }
            disabled={ selectedCustomer === undefined }
          >
            { 'Seleccionar' }
          </Button>
        }
        <Button customType={ ButtonTypes.Secondary } onClick={ closeSidePanel }>{ 'Cancelar' }</Button>
      </Options>
      {
        message !== undefined && message.type === CustomerMessageTypes.Info &&
        <Alert message={ message.content } type={ AlertTypes.Empty } />
      }
      {
        customers !== undefined &&
        <>
          <CustomersContainer customerList={
            customers.map((customer, index) => {
              return <Customer
                key={ index }
                id={ customer.codcustomer }
                name={ customer.namecustomer }
                phoneNumber={ customer.telcustomer }
                setSelected={ handleCustomerClick }
                selectedCustomer={ selectedCustomer }
                draftCustomerID={ draftCustomerID }
              />
            })
          }
          />
          <Pagination activePage={ activePage } totalPages={ totalPages } setActivePage={ setActivePage } />
        </>
      }
    </Container>
  )
}

export default Customers