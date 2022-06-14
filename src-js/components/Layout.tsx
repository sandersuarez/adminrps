import React, { FC, ReactNode } from 'react'
import Navbar from './Navbar'
import Sections from '../shapes/Sections'
import styled from '@emotion/styled'
import fonts from '../styles/fonts'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div(
  [
    fonts.body,
    {
      header: {
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
      },
      main: {
        margin: '3rem 0 6.5rem 0',
        padding: '0 0 1rem 0',
        height: 'calc(100vh - 3rem - 6.5rem)',
        [breakpoints.tablet]: {
          margin: '3.5rem 0 6.5rem 0',
          height: 'calc(100vh - 3.5rem - 6.5rem)',
        },
        [breakpoints.desktop]: {
          margin: '3.5rem 0 0 6.5rem',
          height: 'calc(100vh - 3.5rem)',
        },
      },
      h1: [
        {
          margin: 0,
          cursor: 'default',
        },
        fonts.titleBar,
      ],
      'h1::selection': {
        background: 'transparent',
      },
    },
  ],
)

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container>
      <header>
        <h1>AdminRPS</h1>
      </header>
      <main>
        <Navbar selected={ Sections.Products } />
        { children }
      </main>
    </Container>
  )
}

export default Layout
