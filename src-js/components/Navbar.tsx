import React, { FC } from 'react'
import Sections from '../shapes/Sections'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

interface IProps {
  selected: Sections
}

const NavBarStyles = styled.nav(
  {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    backgroundColor: colors.menu,
    height: '6.5rem',
    zIndex: 1,
    [breakpoints.desktop]: {
      right: 'auto',
      width: '6.5rem',
      height: 'calc(100% - 3.5rem)',
    }
  },
)

const Navbar: FC<IProps> = () => {
  return (
    <NavBarStyles>
      <p>Menu</p>
    </NavBarStyles>
  )
}

export default Navbar