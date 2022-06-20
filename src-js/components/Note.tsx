import React, { FC, Key, ReactNode } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import fonts from '../styles/fonts'
import breakpoints from '../styles/breakpoints'
import NoteType from '../shapes/NoteType'

export interface NoteProps {
  key: Key
  noteType: NoteType
  // todo: remove children prop and add order prop
  children?: ReactNode
}

const Container = styled.article<{ noteType: NoteType }>(
  {
    position: 'relative',
    background: colors.section,
    padding: '0.7rem',
    h3: {
      margin: '0 0 0.8rem 0',
    },
    p: {
      margin: 0,
      '&.pick-up-time': {
        position: 'absolute',
        top: 7,
        right: 9,
      },
    },
    [breakpoints.tablet]: {
      padding: '1.4rem 1rem',
      h3: {
        margin: '0 0 1.4rem 0',
      },
      p: {
        '&.pick-up-time': {
          top: '1.3rem',
          right: '1.6rem',
        },
      },
    },
    [breakpoints.smallDesktop]: {
      gridColumn: 'span 2',
    }
  },
  ({ noteType }) => {
    switch (noteType) {
      case 'activeOrder':
        return {
          h3: fonts.orderNumber,
        }
    }
  },
)

const Note: FC<NoteProps> = ({ noteType, children }) => {
  // todo: render elements depending on an order prop
  return (
    <Container noteType={ noteType }>
      <h3>{ 'NºX' }</h3>
      <p>{ 'Luisa Santos' }</p>
      <p>{ '640000000' }</p>
      <p className={ 'pick-up-time' }>{ '12:35' }</p>
      { children }
    </Container>
  )
}

export default Note