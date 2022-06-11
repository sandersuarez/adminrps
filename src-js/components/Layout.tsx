import React, { FC, ReactNode } from 'react'
import Navbar from './Navbar'
import Sections from '../shapes/Sections'
import { Global } from '@emotion/react'
import global from '../styles/global'

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <Global styles={global} />
      <header>
        <h1>AdminRPS</h1>
      </header>
      <main>
        <Navbar selected={Sections.Products}/>
        {children}
      </main>
    </div>
  )
}

export default Layout