import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import SearchBar from './SearchBar'
import NoteContainer from './NoteContainer'
import Alert from './Alert'

const Container = styled.article(
  {
    margin: '1rem 0 0 0',
    [breakpoints.tablet]: {
      margin: '2rem 0 0 0',
    },
  },
)

const ActiveOrders = () => {
  return (
    <Container>
      <h2>Pedidos en elaboración</h2>
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer />
    </Container>
  )
}

export default ActiveOrders