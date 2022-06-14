import React, { FC, ReactNode } from 'react'
import Navbar from './Navbar'
import Sections from '../shapes/Sections'
import styled from '@emotion/styled'
import fonts from '../styles/fonts'

const Container = styled.div(
  fonts.body
)

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container>
      <header>
        <h1>AdminRPS</h1>
      </header>
      <main>
        <Navbar selected={Sections.Products}/>
        {children}
      </main>
    </Container>
  )
}

export default Layout