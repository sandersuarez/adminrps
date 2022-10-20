import React, { FC, useEffect } from 'react'
import WelcomeLayer from '../WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
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
import Panels from '../../shapes/Panels'
import useCustomers from '../../hooks/useCustomers'

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

interface IProps {
  username: string
  logout: () => void
  sessionCheck: SessionCheckType
}

/**
 * This component is the main section of the application, the home page. It contains the welcome message for the user,
 * the logout button, the active orders component and the drafts component.
 */
const Home: FC<IProps> = ({ username, logout, sessionCheck }) => {
  const [openFirstSidePanel, setOpenFirstSidePanel] = React.useState<boolean>(false)
  const [openSecondSidePanel, setOpenSecondSidePanel] = React.useState<boolean>(false)
  const [firstSidePanel, setFirstSidePanel] = React.useState<Panels>(Panels.Drafts)
  const [secondSidePanel, setSecondSidePanel] = React.useState<Panels>()

  const {
    individualMessage: indDraftMessage,
    collectiveMessage: colDraftMessage,
    newDraftID,
    draft,
    drafts,
    addingDraft,
    setCollectiveMessage: setColDraftMessage,
    setNewDraftID,
    addDraft,
    getDrafts,
    getDraft,
    editDraft,
  } = useDrafts(sessionCheck)

  const {
    collectiveMessage: colCustomerMessage,
    customers,
    activePage: customersActivePage,
    totalPages: customersTotalPages,
    setActivePage: customersSetActivePage,
    getCustomers,
  } = useCustomers(sessionCheck)

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

  useEffect(getDrafts, [draft, newDraftID])

  let mainPanel
  switch (firstSidePanel) {
    case Panels.Orders:
      mainPanel =
        <OrderPanel
          handleCloseSidePanel={ handleCloseFirstSidePanel }
          handleOpenSecondSidePanel={ handleOpenSecondSidePanel }
        />
      break
    case Panels.Drafts:
      mainPanel =
        <DraftPanel
          closeSidePanel={ handleCloseFirstSidePanel }
          openSecondSidePanel={ handleOpenSecondSidePanel }
          changeSecondSidePanel={ setSecondSidePanel }
          message={ indDraftMessage }
          newDraftID={ newDraftID }
          setNewDraftID={ setNewDraftID }
          draft={ draft }
          addDraft={ addDraft }
          editDraft={ editDraft }
          addingDraft={ addingDraft }
          getCustomers={ getCustomers }
        />
      break
  }

  let sidePanel
  switch (secondSidePanel) {
    case Panels.Customers:
      sidePanel =
        <CustomersSelection
          closeSidePanel={ handleCloseSecondSidePanel }
          message={ colCustomerMessage }
          customers={ customers }
          activePage={ customersActivePage }
          totalPages={ customersTotalPages }
          setActivePage={ customersSetActivePage }
          getCustomers={getCustomers}
        />
  }

  /*<ActiveOrders handleOpenSidePanel={ handleOpenFirstSidePanel } handleNewOrder={ handleNewOrder } />*/
  return (
    <Container css={ (openFirstSidePanel || openSecondSidePanel) ? css`overflow-y: hidden` : null }>
      <HomeWrapper>
        <WelcomeLayer userName={ username } logout={ logout } />
        <Drafts
          setFirstSidePanel={ setFirstSidePanel }
          handleOpenSidePanel={ handleOpenFirstSidePanel }
          message={ colDraftMessage }
          setColMessage={ setColDraftMessage }
          getDrafts={ getDrafts }
          getDraft={ getDraft }
          drafts={ drafts }
        />
      </HomeWrapper>
      <PanelContainer
        css={ auxPanelStyles }
        open={ openFirstSidePanel }
        mainChildren={ mainPanel }
        sideChildren={ sidePanel }
        openSidePanel={ openSecondSidePanel }
        border={ false }
      />
    </Container>
  )
}

export default Home