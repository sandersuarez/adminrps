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
        <Note key={ 0 } handleClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 1 } handleClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 2 } handleClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 3 } handleClick={ handleOpenSidePanel }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 4 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 5 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 6 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 7 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 8 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 9 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 10 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 11 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 12 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 13 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 14 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 15 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 16 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 17 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 18 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 19 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 20 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 21 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 22 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 23 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 24 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 25 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 26 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 27 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 28 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 29 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 30 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 31 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 32 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 33 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 34 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 35 } handleClick={ handleOpenSidePanel } />,
        <Note key={ 36 } handleClick={ handleOpenSidePanel } />,
      ] } />
      <Pagination />
    </Container>
  )
}

export default ActiveOrders