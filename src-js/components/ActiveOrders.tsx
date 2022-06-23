import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import SearchBar from './SearchBar'
import NoteContainer from './NoteContainer'
import Alert from './Alert'
import Note from './Note'
import NoteType from '../shapes/NoteType'
import OrderProductsTable from './OrderProductsTable'

const Container = styled.article(
  {
    margin: '1rem 0 0 0',
    [breakpoints.tablet]: {
      margin: '2rem 0 0 0',
    },
  },
)

/**
 * Component that contains all the data to manage the active orders of the user. It lists them, and provides a search
 * bar to filter by phone number or customer name, pagination, and responsive styles to make them awesome in all
 * kind of versions.
 */
const ActiveOrders = () => {
  return (
    <Container>
      <h2>Pedidos en elaboración</h2>
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [
        <Note key={ 0 } noteType={ NoteType.activeOrder }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 1 } noteType={ NoteType.activeOrder }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 2 } noteType={ NoteType.activeOrder }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 3 } noteType={ NoteType.activeOrder }>
          <OrderProductsTable />
        </Note>,
        <Note key={ 4 } noteType={ NoteType.activeOrder } />,
        <Note key={ 5 } noteType={ NoteType.activeOrder } />,
        <Note key={ 6 } noteType={ NoteType.activeOrder } />,
        <Note key={ 7 } noteType={ NoteType.activeOrder } />,
        <Note key={ 8 } noteType={ NoteType.activeOrder } />,
        <Note key={ 9 } noteType={ NoteType.activeOrder } />,
        <Note key={ 10 } noteType={ NoteType.activeOrder } />,
        <Note key={ 11 } noteType={ NoteType.activeOrder } />,
        <Note key={ 12 } noteType={ NoteType.activeOrder } />,
        <Note key={ 13 } noteType={ NoteType.activeOrder } />,
        <Note key={ 14 } noteType={ NoteType.activeOrder } />,
        <Note key={ 15 } noteType={ NoteType.activeOrder } />,
        <Note key={ 16 } noteType={ NoteType.activeOrder } />,
        <Note key={ 17 } noteType={ NoteType.activeOrder } />,
        <Note key={ 18 } noteType={ NoteType.activeOrder } />,
        <Note key={ 19 } noteType={ NoteType.activeOrder } />,
        <Note key={ 20 } noteType={ NoteType.activeOrder } />,
        <Note key={ 21 } noteType={ NoteType.activeOrder } />,
        <Note key={ 22 } noteType={ NoteType.activeOrder } />,
        <Note key={ 23 } noteType={ NoteType.activeOrder } />,
        <Note key={ 24 } noteType={ NoteType.activeOrder } />,
        <Note key={ 25 } noteType={ NoteType.activeOrder } />,
        <Note key={ 26 } noteType={ NoteType.activeOrder } />,
        <Note key={ 27 } noteType={ NoteType.activeOrder } />,
        <Note key={ 28 } noteType={ NoteType.activeOrder } />,
        <Note key={ 29 } noteType={ NoteType.activeOrder } />,
        <Note key={ 30 } noteType={ NoteType.activeOrder } />,
        <Note key={ 31 } noteType={ NoteType.activeOrder } />,
        <Note key={ 32 } noteType={ NoteType.activeOrder } />,
        <Note key={ 33 } noteType={ NoteType.activeOrder } />,
        <Note key={ 34 } noteType={ NoteType.activeOrder } />,
        <Note key={ 35 } noteType={ NoteType.activeOrder } />,
        <Note key={ 36 } noteType={ NoteType.activeOrder } />,
      ] } />
    </Container>
  )
}

export default ActiveOrders