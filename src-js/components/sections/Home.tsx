import React, { FC } from 'react'
import WelcomeLayer from '../WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import ActiveOrders from '../orders/ActiveOrders'
import Drafts from '../Drafts'
import margins from '../../styles/margins'
import PanelContainer from '../PanelContainer'
import OrderPanel from '../orders/OrderPanel'
import { css } from '@emotion/react'
import colors from '../../styles/colors'
import CustomersSelection from '../customers/CustomersSelection'
import { SessionCheckType } from '../../hooks/useSession'
import DraftPanel from '../DraftPanel'
import useDrafts from '../../hooks/useDrafts'

const auxPanelStyles = css`
  position: absolute;
  top: 0;
  left: 100%;

  & > div:first-of-type {
    background: ${ colors.section };
  }
`

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: ${ margins.mobile.lateral };
  overflow-y: auto;
`

const Container = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;

  ${ breakpoints.tablet } {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  ${ breakpoints.desktop } {
    order: 2;
    padding: 1.5rem 3rem 2rem 3rem;
  }
`

enum Panels {
  Drafts = 'Drafts',
  Orders = 'Orders',
}

interface IProps {
  logout: () => void
  sessionCheck: SessionCheckType
}

/**
 * This component is the main section of the application, the home page. It contains the welcome message for the user,
 * the logout button, the active orders component and the drafts component.
 */
const Home: FC<IProps> = ({ logout, sessionCheck }) => {
  const [openFirstSidePanel, setOpenFirstSidePanel] = React.useState<boolean>(false)
  const [openSecondSidePanel, setOpenSecondSidePanel] = React.useState<boolean>(false)
  const [firstSidePanel, setFirstSidePanel] = React.useState<Panels>(Panels.Drafts)

  const {
    individualMessage: indDraftMessage,
    newDraftID,
    draft,
    addingDraft,
    setNewDraftID,
    addDraft,
    getDraft,
  } = useDrafts(sessionCheck)

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
    setOpenSecondSidePanel(false)
  }

  const handleNewOrder = () => {

  }

  let mainPanel
  switch (firstSidePanel) {
    case Panels.Orders:
      mainPanel = <OrderPanel
        handleCloseSidePanel={ handleCloseFirstSidePanel }
        handleOpenSecondSidePanel={ handleOpenSecondSidePanel }
      />
      break
    default:
      mainPanel = <DraftPanel
        handleCloseSidePanel={ handleCloseFirstSidePanel }
        handleOpenSecondSidePanel={ handleOpenSecondSidePanel }
        indDraftMessage={ indDraftMessage }
        newDraftID={ newDraftID }
        setNewDraftID={setNewDraftID}
        draft={ draft }
        addDraft={ addDraft }
        addingDraft={ addingDraft }
      />
      break
  }

  return (
    <Container css={ (openFirstSidePanel || openSecondSidePanel) ? css`overflow-y: hidden` : null }>
      <HomeWrapper>
        <WelcomeLayer userName={ 'sandy' } logout={ logout } />
        <ActiveOrders handleOpenSidePanel={ handleOpenFirstSidePanel } handleNewOrder={ handleNewOrder } />
        <Drafts />
      </HomeWrapper>
      <PanelContainer
        css={ auxPanelStyles }
        open={ openFirstSidePanel }
        mainChildren={ mainPanel }
        sideChildren={ <CustomersSelection handleCloseSidePanel={ handleCloseSecondSidePanel } /> }
        openSidePanel={ openSecondSidePanel }
        border={ false }
      />
    </Container>
  )
}

export default Home