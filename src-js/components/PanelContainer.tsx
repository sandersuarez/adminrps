import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import { motion } from 'framer-motion'
import colors from '../styles/colors'

const Container = styled(motion.div)`
  position: relative;
  min-width: 100%;
  height: 100%;
  display: flex;
`

const MainContainer = styled.div`
  flex-grow: 1;
  min-height: 100%;
  background: ${ colors.background };
  overflow-y: auto;
`

const SideContainer = styled(motion.div)`
  position: absolute;
  left: 100%;
  min-height: 100%;
  background: ${ colors.background };
  overflow-y: auto;
  width: 100%;
  flex-shrink: 0;

  ${ breakpoints.mediumDesktop } {
    position: relative;
    flex-basis: 55rem;
  }
`

interface IProps {
  className?: string
  mainChildren: ReactNode
  sideChildren: ReactNode
  openSidePanel: boolean
  open?: boolean
}

const PanelContainer: FC<IProps> = (
  {
    className,
    mainChildren,
    sideChildren,
    openSidePanel,
    open,
  },
) => {
  return (
    <Container
      className={ className }
      transition={ { ease: 'easeInOut', duration: .5 } }
      animate={ (open || open === undefined) ? { left: 0 } : { left: '100%' } }
    >
      <MainContainer children={ mainChildren } />
      <SideContainer
        transition={ { ease: 'easeInOut', duration: .5 } }
        animate={ openSidePanel ? { left: '-1px' } : { left: '100%' } }
        children={ sideChildren }
      />
    </Container>
  )
}

export default PanelContainer