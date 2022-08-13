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
const Container = styled.div`
  ${ fonts.body }
  h2 {
    ${ fonts.title }
    margin: 0;
    border-bottom: 1px solid;
    border-color: ${ colors.text };
  }

  h3 {
    margin: 0;
  }
`

/**
 * Component that contains the header styles.
 */
const Header = styled.header`
  display: flex;
  align-items: center;
  background: ${ colors.primary };
  padding: 0 0 0 1rem;
  top: 0;
  left: 0;
  right: 0;
  height: 3rem;
  margin: 0;

  ${ breakpoints.tablet } {
    padding: 0 0 0 1.5rem;
    height: 3.5rem;
  }
`

const Main = styled.main`
  height: calc(100vh - 3rem);

  ${ breakpoints.tablet } {
    height: calc(100vh - 3.5rem);
  }
`

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  ${ breakpoints.desktop } {
    flex-flow: row nowrap;
  }

  & > section {
    flex-grow: 1;

    ${ breakpoints.desktop } {
      order: 2;
    }
  }
`

const H1 = styled.h1`
  ${ fonts.titleBar }
  margin: 0;
  cursor: default;

  &::selection {
    background: transparent;
  }
`

interface LayoutProps {
  children: ReactNode
  section: Sections
  setSection: (section: Sections) => void
}

/**
 * The component that defines the layout of the application. Contains the header, the navbar and the main sections,
 * and contains the styles that make them responsive.
 */
const Layout: FC<LayoutProps> = ({ children, section, setSection }) => {
  return (
    <Container>
      <Header>
        <H1>AdminRPS</H1>
      </Header>
      <Main>
        <MainWrapper>
          { children }
          <Navbar selectedSection={ section } setSection={ setSection } />
        </MainWrapper>
      </Main>
    </Container>
  )
}

export default Layout
