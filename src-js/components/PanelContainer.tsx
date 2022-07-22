import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import colors from '../styles/colors'

const Container = styled.div`
  height: 100%;
  display: flex;
`

const MainContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`

const SideContainer = styled.div`
  display: none;
  overflow-y: auto;
  flex-basis: 55rem;
  flex-shrink: 0;

  ${ breakpoints.mediumDesktop } {
    display: block;
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