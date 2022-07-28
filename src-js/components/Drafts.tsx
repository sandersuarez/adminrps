import React from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Alert from './Alert'
import NoteContainer from './NoteContainer'
import Note from './Note'
import Button from './Button'
import { css } from '@emotion/react'
import margins from '../styles/margins'

const Container = styled.article`
  margin-top: ${ margins.mobile.bigVertical };
  display: flex;
  flex-direction: column;
  gap: ${ margins.mobile.mediumVertical };

  h3 {
    line-height: 1em;
  }

  ${ breakpoints.tablet } {
    margin: 2rem 0 0 0;
  }
`

const optionsStyles = css`
  display: flex;
  flex-flow: row wrap;
  gap: ${ margins.mobile.vertical };

  button:nth-of-type(2) {
    white-space: break-spaces;
  }

  ${ breakpoints.tablet } {
    gap: 2rem;
    margin-top: 2rem;
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