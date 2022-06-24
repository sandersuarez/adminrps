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

interface IProps {
  selected: Sections
}

const Wrapper = styled.nav({
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
  },
})

const Container = styled.div({
  display: 'flex',
  height: '100%',
})

const ThisButton = styled.button({
  svg: {
    fill: colors.primary,
    height: '3rem',
  },

  // reset the button styles
  background: 'none',
  border: 'none',
  font: 'inherit',
  opacity: 1,

  margin: 'auto',
  flexGrow: 1,
})

const ThisButton2: FC<{ icon: ReactElement }> = ({ icon }) => (
  <div>
    <button>
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
      <button css={ `svg { color: white }` }>??</button>
      <Container>
        <ThisButton>
          <IconProducts />
        </ThisButton>
        <ThisButton>
          <IconUsers />
        </ThisButton>
        <ThisButton>
          <IconHome />
        </ThisButton>
        <ThisButton>
          <IconOrder />
        </ThisButton>
        <ThisButton>
          <IconSettings />
        </ThisButton>
      </Container>
    </Wrapper>
  )
}

export default Navbar