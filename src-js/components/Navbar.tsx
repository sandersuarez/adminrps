import React, {FC} from 'react'
import Sections from '../shapes/Sections'

interface IProps {
  selected: Sections
}

const Navbar: FC<IProps> = ({selected}) => {
  return (
    <nav></nav>
  )
}

export default Navbar