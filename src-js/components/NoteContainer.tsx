import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import Note, { NoteProps } from './Note'
import breakpoints from '../styles/breakpoints'

interface NoteContainerProps {
  noteList: ReactElement<NoteProps>[]
}

const Container = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(24ch, 100%), 1fr))',
  gridAutoFlow: 'row dense',
  gap: '1rem',
  margin: '1rem 0 0 0',

  [breakpoints.tablet]: {
    gridTemplateColumns: 'repeat(6, 1fr)',
    columnGap: '2rem',
    rowGap: '1.5rem',

    [`${ Note }`]: {
      gridColumnEnd: 'span 2',
      '&:not(:nth-of-type(n+5))': {
        gridColumnEnd: 'span 3',
      },
    },
  },

  [breakpoints.bigDesktop]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(24ch, 100%), 1fr))',
    [`${ Note }`]: {
      gridColumnEnd: 'span 1',
      '&:not(:nth-of-type(n+5))': {
        gridColumnEnd: 'span 2',
        gridRowEnd: 'span 2'
      },
      '&:nth-of-type(3), &:nth-of-type(4)': {
        gridRow: '3',
      }
    },
  }
})

/**
 * Component that contains a set of notes, and shows them responsively.
 */
const NoteContainer: FC<NoteContainerProps> = ({ noteList }) => {
  return (
    <Container children={ noteList } />
  )
}

export default NoteContainer