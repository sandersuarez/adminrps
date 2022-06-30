import React, { FC, ReactNode } from 'react'
import Navbar from './Navbar'
import Sections from '../shapes/Sections'
import styled from '@emotion/styled'
import fonts from '../styles/fonts'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

/**
 * Component that contains the layout styles.
 */
const Container = styled.div(
  fonts.body,
  {
    h2: [
      {
        margin: 0,
        borderBottom: '1px solid',
        borderColor: colors.text,
      },
      fonts.title,
    ],
    h3: {
      margin: 0,
    },
  },
)

/**
 * Component that contains the header styles.
 */
const Header = styled.header({
  display: 'flex',
  alignItems: 'center',
  background: colors.primary,
  padding: '0 0 0 1rem',
  top: 0,
  left: 0,
  right: 0,
  height: '3rem',
  position: 'fixed',
  margin: 0,
  zIndex: 1,
  [breakpoints.tablet]: {
    padding: '0 0 0 1.5rem',
    height: '3.5rem',
  },
})

/**
 * Component that contains the section layer styles.
 */
const Main = styled.main({
  margin: '3rem 0 6.5rem 0',
  minHeight: 'calc(100vh - 3rem - 6.5rem)',
  [breakpoints.tablet]: {
    margin: '3.5rem 0 6.5rem 0',
    minHeight: 'calc(100vh - 3.5rem - 6.5rem)',
  },
  [breakpoints.desktop]: {
    margin: '3.5rem 0 0 6.5rem',
    minHeight: 'calc(100vh - 3.5rem)',
  },
  '& > section': {
    padding: '1rem',
    minHeight: '100%',
    [breakpoints.tablet]: {
      padding: '1.5rem 1.5rem 2rem 1.5rem',
    },
    [breakpoints.desktop]: {
      padding: '1.5rem 3rem 2rem 3rem',
    },
  },
})

/**
 * Component that contains the main title styles.
 */
const H1 = styled.h1(
  fonts.titleBar,
  {
    margin: 0,
    cursor: 'default',
    '&::selection': {
      background: 'transparent',
    },
  },
)

/**
 * The component that defines the layout of the application. Contains the header, the navbar and the main sections,
 * and contains the styles that make them responsive.
 */
const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container>
      <Header>
        <H1>AdminRPS</H1>
      </Header>
      <Main>
        <Navbar selected={ Sections.Products } />
          { children }
      </Main>
    </Container>
  )
}

export default Layout
