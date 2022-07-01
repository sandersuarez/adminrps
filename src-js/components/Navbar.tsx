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
  background-color: ${ colors.menu };
  flex-basis: 6.5rem;
  flex-shrink: 0;

  ${ breakpoints.desktop } {
    order: 1;
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

const ThisButton: FC<{ className?: string, icon: ReactElement, title?: string }> = ({ className, icon, title }) => (
  <div className={ className } css={ buttonStyles.div }>
    <button title={ title } css={ buttonStyles.button }>
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
        <ThisButton title='Productos' icon={ <IconProducts /> } />
        <ThisButton title='Clientes' icon={ <IconUsers /> } />
        <ThisButton title='Inicio' icon={ <IconHome /> } css={ css`${ breakpoints.desktop } {
          order: -1
        }` } />
        <ThisButton title='Pedidos' icon={ <IconOrder /> } />
        <ThisButton title='Ajustes' icon={ <IconSettings /> } css={ css`${ breakpoints.desktop } {
          margin-top: auto;
        }` } />
      </Container>
    </Wrapper>
  )
}

export default Navbar