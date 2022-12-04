import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import colors from '../styles/colors'
import { css } from '@emotion/react'
import margins from '../styles/margins'

const Container = styled.div`
  position: absolute;
  min-width: 100%;
  height: 100%;
  left: 100%;
  top: 0;
  display: flex;

  & > div:first-of-type {
    background: ${ colors.section };
  }

  ${ breakpoints.desktop } {
    display: flex;
  }

  ${ breakpoints.mediumDesktop } {
    position: relative;
    min-width: 0;
    flex-basis: 40%;
    max-width: 52rem;
  }
`

const MainContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  background: ${ colors.background };
  overflow-y: auto;

  ${ breakpoints.desktop } {
    flex-basis: 60%;
    flex-grow: 1;
  }
`

const SideContainer = styled.div`
  position: absolute;
  left: 100%;
  height: 100%;
  background: ${ colors.background };
  overflow-y: auto;
  width: 100%;
  flex-shrink: 0;

  article {
    --vertical-margin: ${ margins.mobile.mediumVertical };
    --horizontal-margin: ${ margins.mobile.lateral };

    display: flex;
    flex-direction: column;
    row-gap: ${ margins.mobile.mediumVertical };
    padding: var(--vertical-margin) var(--horizontal-margin);

    ${ breakpoints.tablet } {
      row-gap: ${ margins.tablet.mediumVertical };
      padding: ${ margins.tablet.lateral };
      padding-bottom: ${ margins.tablet.bigVertical };
    }
  }

  ${ breakpoints.desktop } {
    position: relative;
    width: unset;
    left: unset;
    flex-basis: 40%;
    flex-grow: 1;
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

  const containerMobileStyles =
    (open || open === undefined) ?
      css`
        left: 0;
      `
      :
      css`
        left: 100%;
      `

  const containerDesktopStyles =
    openSidePanel ?
      css`
        ${ breakpoints.mediumDesktop } {
          position: absolute;
          min-width: 100%;
          flex-basis: unset;
          max-width: unset;
        }
      `
      :
      css`
        ${ breakpoints.mediumDesktop } {
          left: unset;
        }
      `

  const desktopMainContainerStyles =
    openSidePanel ?
      css`
        ${ breakpoints.mediumDesktop } {
          section {
            padding: ${ margins.desktop.mediumVertical } ${ margins.desktop.lateral };
          }
        }
      `
      :
      css``


  const borderSideContainerStyles =
    border ?
      css`
        border-left: 1px solid ${ colors.separators };
      `
      :
      css``

  const distanceSideContainerStyles =
    openSidePanel ?
      (
        border ?
          css`
            left: -1px;
          `
          :
          css`
            left: 0;
          `
      )
      :
      css`
        left: 100%;
      `

  const desktopSideContainerStyles =
    openSidePanel ?
      css`
        ${ breakpoints.desktop } {
          display: block;
        }
      `
      :
      css`
        ${ breakpoints.desktop } {
          display: none;
        }
      `

  return (
    <Container
      className={ className }
      css={ [containerMobileStyles, containerDesktopStyles] }
    >
      <MainContainer children={ mainChildren } css={ desktopMainContainerStyles } />
      <SideContainer
        css={ [borderSideContainerStyles, distanceSideContainerStyles, desktopSideContainerStyles] }
        children={ sideChildren }
      />
    </Container>
  )
}

export default PanelContainer