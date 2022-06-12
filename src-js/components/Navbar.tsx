import React, {FC} from 'react'
import Sections from '../shapes/Sections'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import fonts from '../styles/fonts'

const NavbarStyles = styled.nav(
  css`${fonts.body}`
)

interface IProps {
  selected: Sections
}

const Navbar: FC<IProps> = () => {
  return (
    <NavbarStyles>
      <p>Holi</p>
    </NavbarStyles>
  )
}

export default Navbar