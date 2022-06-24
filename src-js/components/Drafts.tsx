import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Alert from './Alert'
import Paging from './Paging'
import NoteContainer from './NoteContainer'
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

const Drafts = () => {
  return (
    <Container>
      <h2>Borradores</h2>
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [
        <Note key={ 0 } noteType={ NoteType.draft } />,
        <Note key={ 1 } noteType={ NoteType.draft } />,
        <Note key={ 2 } noteType={ NoteType.draft } />,
        <Note key={ 3 } noteType={ NoteType.draft } />,
        <Note key={ 4 } noteType={ NoteType.draft } />,
        <Note key={ 5 } noteType={ NoteType.draft } />,
        <Note key={ 6 } noteType={ NoteType.draft } />,
        <Note key={ 7 } noteType={ NoteType.draft } />,
        <Note key={ 8 } noteType={ NoteType.draft } />,
        <Note key={ 9 } noteType={ NoteType.draft } />,
        <Note key={ 10 } noteType={ NoteType.draft } />,
      ] } />
      <Paging />
    </Container>
  )
}

export default Drafts