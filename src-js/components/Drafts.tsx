import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Alert from './Alert'
import Pagination from './Pagination'
import NoteContainer from './NoteContainer'
import Note from './Note'

const Container = styled.article(
  {
    margin: '1rem 0 0 0',
    [breakpoints.tablet]: {
      margin: '2rem 0 0 0',
    },
  },
)

const Drafts = () => {
  return (
    <Container>
      <h2>Borradores</h2>
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [
        <Note key={ 0 } />,
        <Note key={ 1 } />,
        <Note key={ 2 } />,
        <Note key={ 3 } />,
        <Note key={ 4 } />,
        <Note key={ 5 } />,
        <Note key={ 6 } />,
        <Note key={ 7 } />,
        <Note key={ 8 } />,
        <Note key={ 9 } />,
        <Note key={ 10 } />,
      ] } />
      <Pagination />
    </Container>
  )
}

export default Drafts