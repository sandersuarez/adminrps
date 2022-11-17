import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import { motion } from 'framer-motion'
import colors from '../styles/colors'
import { css } from '@emotion/react'
import margins from '../styles/margins'

const Container = styled(motion.div)`
  position: relative;
  min-width: 100%;
  height: 100%;
  display: flex;
`

const MainContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  background: ${ colors.background };
  overflow-y: auto;
`

const SideContainer = styled(motion.div)`
  position: absolute;
  left: 100%;
  height: 100%;
  background: ${ colors.background };
  overflow-y: auto;
  width: 100%;
  flex-shrink: 0;

  ${ breakpoints.mediumDesktop } {
    position: relative;
    flex-basis: 55rem;
  }

  article {
    --vertical-margin: ${ margins.mobile.mediumVertical };
    --horizontal-margin: ${ margins.mobile.lateral };

    display: flex;
    flex-direction: column;
    row-gap: ${ margins.mobile.mediumVertical };
    padding: var(--vertical-margin) var(--horizontal-margin);
  }
`

interface IProps {
  className?: string
  mainChildren: ReactNode
  sideChildren: ReactNode
  openSidePanel: boolean
  open?: boolean
  border: boolean
}

const PanelContainer: FC<IProps> = (
  {
    className,
    mainChildren,
    sideChildren,
    openSidePanel,
    open,
    border,
  },
) => {

  const variants = {
    opened: {
      left: 0,
    },
    borderOpened: {
      left: '-1px',
    },
    closed: {
      left: '100%',
    },
  }

  return (
    <Container
      className={ className }
      transition={ { ease: 'easeInOut', duration: .5 } }
      animate={ (open || open === undefined) ? { left: 0 } : { left: '100%' } }
    >
      <MainContainer children={ mainChildren } />
      <SideContainer
        css={ border ? css`border-left: 1px solid ${ colors.separators }` : null }
        variants={ variants }
        transition={ { ease: 'easeInOut', duration: .5 } }
        animate={ openSidePanel ? (border ? 'borderOpened' : 'opened') : 'closed' }
        children={ sideChildren }
      />
    </Container>
  )
}

export default PanelContainer