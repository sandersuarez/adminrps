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
`

const buttonStyles = {
  div: css``,
  button: css`
    // reset styles
    background: none;
    border: none;
    font: inherit;
    opacity: 1;
    // custom styles
    margin: auto;
    flex-grow: 1;

    svg {
      fill: ${ colors.primary };
      height: 3rem;
    }
  `,
}

const ThisButton: FC<{ icon: ReactElement }> = ({ icon }) => (
  <div css={ buttonStyles.div }>
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
        <ThisButton icon={ <IconHome /> } />
        <ThisButton icon={ <IconOrder /> } />
        <ThisButton icon={ <IconSettings /> } />
      </Container>
    </Wrapper>
  )
}

export default Navbar