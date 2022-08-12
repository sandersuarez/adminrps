import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import { motion } from 'framer-motion'

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
`

const MainContainer = styled.div`
  flex-grow: 1;
  min-height: 100%;
  overflow-y: auto;
`

const SideContainer = styled(motion.div)`
  position: absolute;
  left: 100%;
  min-height: 100%;
  overflow-y: auto;
  width: 100%;
  flex-shrink: 0;

  ${ breakpoints.mediumDesktop } {
    position: relative;
    flex-basis: 55rem;
  }
`

interface IProps {
  mainChildren: ReactNode
  sideChildren: ReactNode
}

const PanelContainer: FC<IProps> = ({ mainChildren, sideChildren }) => {
  return (
    <Container>
      <MainContainer children={ mainChildren } />
      <SideContainer children={ sideChildren } />
    </Container>
  )
}

export default PanelContainer