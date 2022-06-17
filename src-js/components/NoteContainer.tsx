import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Note from './Note'

const Container = styled.article(
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    margin: '1rem 0 0 0',
    [breakpoints.smallTablet]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [breakpoints.tablet]: {
      margin: '2rem 0 0 0',
      gap: '1.5rem 2rem',
    },
    [breakpoints.smallDesktop]: {
      gridTemplateColumns: 'repeat(6, 1fr)',
    },
  },
)

const NoteContainer = () => {
  // todo: create children from orders array
  return (
    <Container>
      <Note noteType={ 'activeOrder' } />
      <Note noteType={ 'activeOrder' } />
      <Note noteType={ 'activeOrder' } />
      <Note noteType={ 'activeOrder' } />
      <Note noteType={ 'activeOrder' } />
    </Container>
  )
}

export default NoteContainer