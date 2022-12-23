import React, { FC, useEffect, useState } from 'react'
import SearchBar from '../SearchBar'
import Alert from '../Alert'
import Pagination from '../Pagination'
import CustomersContainer from './CustomersContainer'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Options from '../buttons/Options'
import Customer from './Customer'
import { CustomerMessage, CustomerMessageTypes, GetCustomers } from '../../hooks/useCustomers'
import AlertTypes from '../../shapes/AlertTypes'
import CustomerShape from '../../shapes/CustomerShape'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'

const Container = styled.article`
  ${ breakpoints.tablet } {
    ${ Options } {
      margin-top: 0;
    }
  }
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

const CustomersSelection: FC<IProps> = (
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

  const [matchesTablet, setMatchesTablet] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

  const [matchesDesktop, setMatchesDesktop] =
    useState<boolean>(window.matchMedia('(min-width: 992px)').matches)

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
      .addEventListener('change', e => setMatchesTablet(e.matches))
    window
      .matchMedia('(min-width: 992px)')
      .addEventListener('change', e => setMatchesDesktop(e.matches))
  }, [])

  useEffect(() => {
    // noinspection SpellCheckingInspection
    getCustomers({
      telname: searchString,
      customers_number: matchesTablet ? 30 : 15,
      page: 1,
    })
  }, [activePage, searchString, matchesTablet])

  return (
    <Container>
      <h3>{ 'Seleccionar cliente' }</h3>
      {
        message !== undefined && message.type === CustomerMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
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
        {
          !matchesDesktop &&
          <Button customType={ ButtonTypes.Secondary } onClick={ closeSidePanel }>{ 'Cancelar' }</Button>
        }
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

export default CustomersSelection