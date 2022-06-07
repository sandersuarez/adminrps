import React from 'react'
import Navbar from './Navbar'
import Sections from '../shapes/Sections'
import Main from './Main'
import { css } from '@emotion/css'

const Layout = () => {
  return (
    <div>
      <header className={css({ color: 'red' })}>
        <h1>AdminRPS</h1>
      </header>
      <div>
        <Navbar selected={Sections.Products}/>
        <Main>
          <p>Hola</p>
        </Main>
      </div>
    </div>
  )
}

export default Layout