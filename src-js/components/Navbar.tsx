import React, { FC, ReactElement } from 'react'
import Sections from '../shapes/Sections'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import IconProducts from './svg/IconProducts'
import IconUsers from './svg/IconUsers'
import IconHome from './svg/IconHome'
import IconOrder from './svg/IconOrder'
import IconSettings from './svg/IconSettings'
import { css } from '@emotion/react'

interface IProps {
  className?: string
  selected: Sections
}

const Wrapper = styled.nav`
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  background-color: ${ colors.menu };
  height: 6.5rem;
  z-index: 1;

  ${ breakpoints.desktop } {
    right: auto;
    width: 6.5rem;
    height: calc(100% - 3.5rem);
  }
`

const Container = styled.div`
  display: flex;
  height: 100%;

  ${ breakpoints.desktop } {
    flex-direction: column;
  }
`

const buttonStyles = {
  div: css`
    flex-grow: 1;
    display: flex;
    justify-content: center;

    ${ breakpoints.desktop } {
      flex-grow: 0;
      height: 6.5rem;
    }
  `,
  button: css`
    flex-grow: 1;
    max-width: 10rem;
    // reset styles
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
    opacity: 1;

    svg {
      fill: ${ colors.primary };
      height: 3rem;
      max-width: 100%;
    }
  `,
}

const ThisButton: FC<{ className?: string, icon: ReactElement }> = ({ className, icon }) => (
  <div className={ className } css={ buttonStyles.div }>
    <button css={ buttonStyles.button }>
      { icon }
    </button>
  </div>
)

/**
 * The main menu component. This will be the main navigation layer for the application to switch between sections.
 */
const Navbar: FC<IProps> = () => {
  return (
    <Wrapper>
      <Container>
        <ThisButton icon={ <IconProducts /> } />
        <ThisButton icon={ <IconUsers /> } />
        <ThisButton icon={ <IconHome /> } css={ css`${ breakpoints.desktop } { order: -1 }` } />
        <ThisButton icon={ <IconOrder /> } />
        <ThisButton icon={ <IconSettings /> } css={ css`${ breakpoints.desktop } { margin-top: auto; }` } />
      </Container>
    </Wrapper>
  )
}

export default Navbar