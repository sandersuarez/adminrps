import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import IconProducts from './svg/IconProducts'
import IconUsers from './svg/IconUsers'
import IconHome from './svg/IconHome'
import IconOrder from './svg/IconOrder'
import IconSettings from './svg/IconSettings'
import { css } from '@emotion/react'
import { NavLink, NavLinkProps } from 'react-router-dom'

const Wrapper = styled.nav`
  border-top: 1px solid #d9d9d9;
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

const thisButtonStyles = css`
  flex-grow: 1;
  display: flex;
  justify-content: center;

  ${ breakpoints.desktop } {
    flex-grow: 0;
    height: 6.5rem;
  }

  & > a {
    // reset styles
    text-decoration: inherit;
    color: ${ colors.text };
    
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    max-width: 10rem;
    
    svg {
      fill: ${ colors.primary };
      height: 3rem;
      max-width: 100%;
    }
  }
`

interface ThisNavLinkProps extends NavLinkProps {
  className?: string,
  icon: ReactElement,
}

const ThisButton: FC<ThisNavLinkProps> = ({ className, icon, ...linkProps }) => (
  <div className={ className } css={ thisButtonStyles }>
    <NavLink { ...linkProps }>
      { icon }
    </NavLink>
  </div>
)

/**
 * The main menu component. This will be the main navigation layer for the application to switch between sections.
 */
const Navbar: FC = () => {
  return (
    <Wrapper>
      <Container>
        <ThisButton to={ 'products' } title='Productos' icon={ <IconProducts /> } />
        <ThisButton to={ 'customers' } title='Clientes' icon={ <IconUsers /> } />
        <ThisButton
          to={ '/' }
          title='Inicio'
          icon={ <IconHome /> }
          css={
            css`
              ${ breakpoints.desktop } {
                order: -1
              }
            `
          } />
        <ThisButton to={ 'orders' } title='Pedidos' icon={ <IconOrder /> } />
        <ThisButton
          to={ 'settings' }
          title='Ajustes'
          icon={ <IconSettings /> }
          css={
            css`
              ${ breakpoints.desktop } {
                margin-top: auto;
              }
            `
          } />
      </Container>
    </Wrapper>
  )
}

export default Navbar