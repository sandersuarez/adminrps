import React, { FC } from 'react'
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
import Button from '../buttons/Button'
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

interface IProps {
  handleOpenSidePanel: () => void
  handleNewOrder: () => void
}

/**
 * Component that contains all the data to manage the active orders of the user. It lists them, and provides a search
 * bar to filter by phone number or customer name, pagination, and responsive styles to make them awesome in all
 * kind of versions.
 */
const ActiveOrders: FC<IProps> = ({ handleOpenSidePanel, handleNewOrder }) => {

  const newOrder = () => {
    handleNewOrder()

  }

  return (
    <Container>
      <h2>Pedidos en elaboración</h2>
      <Button
        customType={ ButtonTypes.Primary }
        css={ css`align-self: start` }
        onClick={ newOrder }
      >
        { 'Nuevo pedido' }
      </Button>
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [
        <Note key={ 0 } onClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 1 } onClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 2 } onClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 3 } onClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 4 } onClick={ handleOpenSidePanel } />,
        <Note key={ 5 } onClick={ handleOpenSidePanel } />,
        <Note key={ 6 } onClick={ handleOpenSidePanel } />,
        <Note key={ 7 } onClick={ handleOpenSidePanel } />,
        <Note key={ 8 } onClick={ handleOpenSidePanel } />,
        <Note key={ 9 } onClick={ handleOpenSidePanel } />,
        <Note key={ 10 } onClick={ handleOpenSidePanel } />,
        <Note key={ 11 } onClick={ handleOpenSidePanel } />,
        <Note key={ 12 } onClick={ handleOpenSidePanel } />,
        <Note key={ 13 } onClick={ handleOpenSidePanel } />,
        <Note key={ 14 } onClick={ handleOpenSidePanel } />,
        <Note key={ 15 } onClick={ handleOpenSidePanel } />,
          <Note key={ 16 } onClick={ handleOpenSidePanel } />,
        <Note key={ 17 } onClick={ handleOpenSidePanel } />,
        <Note key={ 18 } onClick={ handleOpenSidePanel } />,
        <Note key={ 19 } onClick={ handleOpenSidePanel } />,
        <Note key={ 20 } onClick={ handleOpenSidePanel } />,
        <Note key={ 21 } onClick={ handleOpenSidePanel } />,
        <Note key={ 22 } onClick={ handleOpenSidePanel } />,
        <Note key={ 23 } onClick={ handleOpenSidePanel } />,
        <Note key={ 24 } onClick={ handleOpenSidePanel } />,
        <Note key={ 25 } onClick={ handleOpenSidePanel } />,
        <Note key={ 26 } onClick={ handleOpenSidePanel } />,
        <Note key={ 27 } onClick={ handleOpenSidePanel } />,
        <Note key={ 28 } onClick={ handleOpenSidePanel } />,
        <Note key={ 29 } onClick={ handleOpenSidePanel } />,
        <Note key={ 30 } onClick={ handleOpenSidePanel } />,
        <Note key={ 31 } onClick={ handleOpenSidePanel } />,
        <Note key={ 32 } onClick={ handleOpenSidePanel } />,
        <Note key={ 33 } onClick={ handleOpenSidePanel } />,
        <Note key={ 34 } onClick={ handleOpenSidePanel } />,
        <Note key={ 35 } onClick={ handleOpenSidePanel } />,
        <Note key={ 36 } onClick={ handleOpenSidePanel } />,
      ] } />
      <Pagination />
    </Container>
  )
}

export default ActiveOrders