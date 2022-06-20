import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import SearchBar from './SearchBar'
import NoteContainer from './NoteContainer'
import Alert from './Alert'
import Note from './Note'
import NoteType from '../shapes/NoteType'

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
 * bar to filter by phone number or customer name
 */
const ActiveOrders = () => {
  return (
    <Container>
      <h2>Pedidos en elaboración</h2>
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [
        <Note key={0} noteType={NoteType.activeOrder} />,
        <Note key={1} noteType={NoteType.activeOrder} />,
        <Note key={2} noteType={NoteType.activeOrder} />,
        <Note key={3} noteType={NoteType.activeOrder} />,
        <Note key={4} noteType={NoteType.activeOrder} />,
        <Note key={5} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
        <Note key={6} noteType={NoteType.activeOrder} />,
      ] } />
    </Container>
  )
}

export default ActiveOrders