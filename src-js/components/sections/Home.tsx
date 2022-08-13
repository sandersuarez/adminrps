import React from 'react'
import WelcomeLayer from '../WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import ActiveOrders from '../orders/ActiveOrders'
import Drafts from '../Drafts'
import margins from '../../styles/margins'
import PanelContainer from '../PanelContainer'
import OrderPanel from '../orders/OrderPanel'
import Customers from '../customers/Customers'
import { css } from '@emotion/react'
import colors from '../../styles/colors'

const auxPanelStyles = css`
  position: absolute;
  top: 0;
  left: 100%;

  & > div:first-of-type {
    background: ${ colors.section };
  }
`

const Container = styled.section`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  padding: ${ margins.mobile.lateral };

  ${ breakpoints.tablet } {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  ${ breakpoints.desktop } {
    order: 2;
    padding: 1.5rem 3rem 2rem 3rem;
  }
`

/**
 * This component is the main section of the application, the home page. It contains the welcome message for the user,
 * the logout button, the active orders component and the drafts component.
 */
const Home = () => {
  const [openFirstSidePanel, setOpenFirstSidePanel] = React.useState<boolean>(false)
  const [openSecondSidePanel, setOpenSecondSidePanel] = React.useState<boolean>(false)

  const handleOpenFirstSidePanel = () => {
    setOpenFirstSidePanel(true)
  }

  const handleCloseFirstSidePanel = () => {
    setOpenFirstSidePanel(false)
  }

  const handleOpenSecondSidePanel = () => {
    setOpenSecondSidePanel(true)
  }

  const handleCloseSecondSidePanel = () => {
    handleCloseFirstSidePanel()
    setOpenSecondSidePanel(false)
  }

  return (
    <Container css={ (openFirstSidePanel || openSecondSidePanel) ? css`overflow-y: hidden` : null }>
      <WelcomeLayer userName={ 'sandy' } />
      <ActiveOrders handleOpenSidePanel={ handleOpenFirstSidePanel } />
      <Drafts />
      <PanelContainer
        css={ auxPanelStyles }
        open={ openFirstSidePanel }
        mainChildren={ <OrderPanel /> }
        sideChildren={ <Customers handleOpenSidePanel={ handleOpenSecondSidePanel } /> }
        openSidePanel={ openSecondSidePanel }
      />
    </Container>
  )
}

export default Home