import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import SearchBar from '../SearchBar'
import NoteContainer from '../NoteContainer'
import Alert from '../Alert'
import Note from '../Note'
import OrderProductsTable from './OrderProductsTable'
import Pagination from '../Pagination'
import fonts from '../../styles/fonts'
import margins from '../../styles/margins'
import Button from '../Button'
import { css } from '@emotion/react'
import ButtonTypes from '../../shapes/ButtonTypes'

const Container = styled.article`
  margin-top: ${ margins.mobile.bigVertical };
  display: flex;
  flex-direction: column;
  gap: ${ margins.mobile.mediumVertical };

  ${ Note } {
    h3 {
      ${ fonts.orderNumber }
    }
  }

  ${ breakpoints.tablet } {
    margin: 2rem 0 0 0;
  }

  ${ breakpoints.smallDesktop } {
    ${ Note } {
      &:not(:nth-of-type(n+5)) {
        grid-column-end: span 3;
      }
    }
  }

  ${ breakpoints.bigDesktop } {
    ${ Note } {
      &:not(:nth-of-type(n+5)) {
        grid-column-end: span 2;
        grid-row-end: span 2;
      }

      &:nth-of-type(3), &:nth-of-type(4) {
        grid-row-start: 3;
      }
    }
  }
`

/**
 * Component that contains all the data to manage the active orders of the user. It lists them, and provides a search
 * bar to filter by phone number or customer name, pagination, and responsive styles to make them awesome in all
 * kind of versions.
 */
const ActiveOrders = () => {
  return (
    <Container>
      <h2>Pedidos en elaboración</h2>
      <Button customType={ ButtonTypes.Primary } css={ css`align-self: flex-start` }>Nuevo pedido</Button>
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [
        <Note key={ 0 }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 1 }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 2 }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 3 }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 4 } />,
        <Note key={ 5 } />,
        <Note key={ 6 } />,
        <Note key={ 7 } />,
        <Note key={ 8 } />,
        <Note key={ 9 } />,
        <Note key={ 10 } />,
        <Note key={ 11 } />,
        <Note key={ 12 } />,
        <Note key={ 13 } />,
        <Note key={ 14 } />,
        <Note key={ 15 } />,
        <Note key={ 16 } />,
        <Note key={ 17 } />,
        <Note key={ 18 } />,
        <Note key={ 19 } />,
        <Note key={ 20 } />,
        <Note key={ 21 } />,
        <Note key={ 22 } />,
        <Note key={ 23 } />,
        <Note key={ 24 } />,
        <Note key={ 25 } />,
        <Note key={ 26 } />,
        <Note key={ 27 } />,
        <Note key={ 28 } />,
        <Note key={ 29 } />,
        <Note key={ 30 } />,
        <Note key={ 31 } />,
        <Note key={ 32 } />,
        <Note key={ 33 } />,
        <Note key={ 34 } />,
        <Note key={ 35 } />,
        <Note key={ 36 } />,
      ] } />
      <Pagination />
    </Container>
  )
}

export default ActiveOrders