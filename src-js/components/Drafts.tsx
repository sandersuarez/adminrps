import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Alert from './Alert'
import NoteContainer from './NoteContainer'
import Note from './Note'
import Button from './Button'
import { css } from '@emotion/react'

const Container = styled.article`
  margin: 1rem 0 0 0;

  ${ breakpoints.tablet } {
    margin: 2rem 0 0 0;
  }
`

const optionsStyles = css`
  display: flex;
  flex-flow: row wrap;
  margin: 0 16rem 0 0;

  button:nth-of-type(1) {
    margin: 1rem 1rem 0 0;
  }

  button:nth-of-type(2) {
    white-space: break-spaces;
    height: unset;
    min-height: 4.5rem;
    padding: 1rem 1.7rem;
    border-radius: 2.8rem;
    margin-top: 1rem;
  }

  ${ breakpoints.tablet } {
    button:nth-of-type(1) {
      margin: 2rem 2rem 0 0;
    }

    button:nth-of-type(2) {
      margin-top: 2rem;
    }
  }
}
`

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
      <div css={ optionsStyles }>
        <Button customType={ 'secondary' }>{ 'Ver todos' }</Button>
        <Button customType={ 'danger' }>{ 'Eliminar todos los borradores' }</Button>
      </div>
    </Container>
  )
}

export default Drafts