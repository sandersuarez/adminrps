import React, { FC, Key, ReactNode } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

export interface NoteProps {
  key: Key
  className?: string
  // todo: remove children prop and add order prop
  children?: ReactNode
}

const Container = styled.article`
  position: relative;
  display: flex;
  flex-flow: column;
  background: ${ colors.section };
  padding: 0.7rem;
  cursor: pointer;

  h3 {
    margin: 0 0 0.8rem 0;
  }

  p {
    margin: 0;

    &:nth-of-type(1) {
      margin-top: auto;
    }

    &:nth-of-type(2) {
      margin-bottom: auto;
    }
  }

  ${ breakpoints.tablet } {
    padding: 1.5rem;

    h3 {
      margin: 0 0 1.4rem 0;
    }
  }
`

const PickUpTime = styled.p`
  position: absolute;
  top: 0.7rem;
  right: 0.9rem;

  ${ breakpoints.tablet } {
    top: 1.3rem;
    right: 1.6rem;
  }
`

/**
 * Container that renders a layer as a card for an order or draft depending on its type.
 */
const Note: FC<NoteProps> = ({ className: className, children }) => {
  // todo: render elements depending on an order prop
  return (
    <Container className={ className }>
      <h3>{ 'NºX' }</h3>
      <p>{ 'Luisa Santos' }</p>
      <p>{ '640000000' }</p>
      <PickUpTime>{ '12:35' }</PickUpTime>
      { children }
    </Container>
  )
}

export default styled(Note)({})
