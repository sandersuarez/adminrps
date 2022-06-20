import React, { FC } from 'react'
import Sections from '../shapes/Sections'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

interface IProps {
  selected: Sections
}

const Container = styled.nav(
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

/**
 * The main menu component. This will be the main navigation layer for the application to switch between sections.
 */
const Navbar: FC<IProps> = () => {
  return (
    <Container>
    </Container>
  )
}

export default Navbar