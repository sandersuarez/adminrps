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

/*
<SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [] } />
      <Pagination />
 */

/**
 * Component that contains all the data to manage the active orders of the user. It lists them, and provides a search
 * bar to filter by phone number or customer name, pagination, and responsive styles to make them awesome in all
 * kind of versions.
 */
const ActiveOrders: FC<IProps> = ({ handleOpenSidePanel, handleNewOrder }) => {

  return (
    <Container>
      <h2>Pedidos en elaboración</h2>
      <h1>Jajajajjaa definitivamente no es gracioso</h1>
      <Button
        customType={ ButtonTypes.Primary }
        css={ css`align-self: start` }
        onClick={ handleNewOrder }
      >
        { 'Nuevo pedido' }
      </Button>

    </Container>
  )
}

export default ActiveOrders