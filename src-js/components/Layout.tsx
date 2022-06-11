import React, { FC, ReactNode } from 'react'
import Navbar from './Navbar'
import Sections from '../shapes/Sections'

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
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