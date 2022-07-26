import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import Note, { NoteProps } from './Note'
import breakpoints from '../styles/breakpoints'
import fonts from '../styles/fonts'
import margins from '../styles/margins'

interface NoteContainerProps {
  className?: string
  noteList: ReactElement<NoteProps>[]
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(24ch, 100%), 1fr));
  grid-auto-flow: row dense;
  gap: ${ margins.mobile.vertical };

  h3 {
    ${ fonts.noteTitle }
  }

  ${ breakpoints.tablet } {
    column-gap: 2rem;
    row-gap: 1.5rem;
  }

  ${ breakpoints.smallDesktop } {
    grid-template-columns: repeat(6, 1fr);

    ${ Note } {
      grid-column-end: span 2;
    }
  }

  ${ breakpoints.bigDesktop } {
    grid-template-columns: repeat(auto-fit, minmax(min(24ch, 100%), 1fr));

    ${ Note } {
      grid-column-end: span 1;
    }
  }
`

/**
 * Component that contains a set of notes, and shows them responsively.
 */
const NoteContainer: FC<NoteContainerProps> = ({ className, noteList }) => {
  return (
    <Container className={ className } children={ noteList } />
  )
}

export default NoteContainer