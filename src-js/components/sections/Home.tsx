import React, { FC, useEffect, useState } from 'react'
import WelcomeLayer from '../WelcomeLayer'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import Drafts from '../Drafts'
import margins from '../../styles/margins'
import PanelContainer from '../PanelContainer'
import OrderPanel from '../orders/OrderPanel'
import { css } from '@emotion/react'
import CustomersSelection from '../customers/CustomersSelection'
import { SessionCheckType, SessionRenewType } from '../../hooks/useSession'
import DraftPanel from '../DraftPanel'
import useDrafts from '../../hooks/useDrafts'
import Panels from '../../shapes/Panels'
import useCustomers from '../../hooks/useCustomers'
import ProductsSelection from '../products/ProductsSelection'
import useProducts from '../../hooks/useProducts'
import { ProductReqData } from '../../shapes/ProductShape'
import NewProductInDraft from '../products/NewProductInDraft'
import useOrders from '../../hooks/useOrders'
import ActiveOrders from '../orders/ActiveOrders'

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: ${ margins.mobile.vertical } ${ margins.mobile.lateral };
  overflow-y: auto;

  ${ breakpoints.tablet } {
    padding: ${ margins.tablet.mediumVertical } ${ margins.tablet.lateral };
  }

  ${ breakpoints.mediumDesktop } {
    flex-basis: 60%;
    flex-grow: 1;
    padding: ${ margins.desktop.mediumVertical } ${ margins.desktop.lateral };
  }
`

const Container = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;

  ${ breakpoints.mediumDesktop } {
    display: flex;
    order: 2;
  }
`

interface IProps {
  username: string
  logout: () => void
  sessionCheck: SessionCheckType
  sessionRenew: SessionRenewType
}

/**
 * This component is the main section of the application, the home page. It contains the welcome message for the user,
 * the logout button, the active orders component and the drafts component.
 */
const Home: FC<IProps> = ({ username, logout, sessionCheck, sessionRenew }) => {

  const [openFirstSidePanel, setOpenFirstSidePanel] = React.useState<boolean>(false)
  const [openSecondSidePanel, setOpenSecondSidePanel] = React.useState<boolean>(false)
  const [firstSidePanel, setFirstSidePanel] = React.useState<Panels>(Panels.Drafts)
  const [secondSidePanel, setSecondSidePanel] = React.useState<Panels>()
  const [draftCustomerID, setDraftCustomerID] = React.useState<number>()
  const [selectedCustomer, setSelectedCustomer] = useState<number>()
  const [newProductToAdd, setNewProductToAdd] = useState<ProductReqData>()
  const [triggerGetOrders, setTriggerGetOrders] = useState<boolean>(false)

  const [matchesMediumDesktop, setMatchesMediumDesktop] =
    useState<boolean>(window.matchMedia('(min-width: 1250px)').matches)
  const [matchesDesktop, setMatchesDesktop] =
    useState<boolean>(window.matchMedia('(min-width: 992px)').matches)

  const {
    individualMessage: indDraftMessage,
    collectiveMessage: colDraftMessage,
    newDraftID,
    draft,
    drafts,
    addingDraft,
    editingDraft,
    setCollectiveMessage: setColDraftMessage,
    setIndividualMessage: setIndDraftMessage,
    setNewDraftID,
    setDraft,
    addDraft,
    getDrafts,
    getDraft,
    editDraft,
    deleteDraft,
    deleteDrafts,
  } = useDrafts(sessionCheck)

  const [draftProducts, setDraftProducts] = useState<ProductReqData[] | undefined>(
    draft?.products?.map(product => {
      // noinspection SpellCheckingInspection
      return { codproduct: product.codproduct, amountproduct: product.amountproductdraft }
    }))

  const {
    collectiveMessage: colCustomerMessage,
    customers,
    activePage: customersActivePage,
    totalPages: customersTotalPages,
    setActivePage: customersSetActivePage,
    getCustomers,
  } = useCustomers(sessionCheck)

  const {
    collectiveMessage: colProductMessage,
    individualMessage: indProductMessage,
    products,
    activePage: productsActivePage,
    totalPages: productsTotalPages,
    setActivePage: productsSetActivePage,
    getProducts,
    addProduct,
    setIndividualMessage: setIndProductMessage,
    setCollectiveMessage: setColProductMessage,
  } = useProducts(sessionCheck)

  const {
    individualMessage: indOrderMessage,
    collectiveMessage: colOrderMessage,
    order,
    orders,
    activePage: ordersActivePage,
    totalPages: ordersTotalPages,
    setActivePage: ordersSetActivePage,
    getOrders,
    addOrder,
    setIndividualMessage: setIndOrderMessage,
    setCollectiveMessage: setColOrderMessage,
  } = useOrders(sessionCheck)

  const handleOpenFirstSidePanel = () => {
    setOpenFirstSidePanel(true)
  }

  const handleCloseFirstSidePanel = () => {
    setOpenFirstSidePanel(false)
    setOpenSecondSidePanel(false)
  }

  const handleOpenSecondSidePanel = () => {
    sessionRenew()
    setOpenFirstSidePanel(true)
    setOpenSecondSidePanel(true)
  }

  const handleCloseSecondSidePanel = () => {
    setOpenSecondSidePanel(false)
  }

  const handleNewOrder = () => {
    setNewDraftID(undefined)
    setDraft(undefined)
  }

  useEffect(getDrafts, [draft, newDraftID])
  useEffect(() => {
    if (draft !== undefined) {
      if (draft.products === undefined) {
        setDraftProducts(undefined)
      } else {
        setDraftProducts(draft.products.map(product => {
          // noinspection SpellCheckingInspection
          return { codproduct: product.codproduct, amountproduct: product.amountproductdraft }
        }))
      }
    } else {
      setDraftProducts(undefined)
    }
  }, [draft])

  useEffect(() => {
    window
      .matchMedia('(min-width: 1250px)')
      .addEventListener('change', e => setMatchesMediumDesktop(e.matches))
    window
      .matchMedia('(min-width: 992px)')
      .addEventListener('change', e => setMatchesDesktop(e.matches))
  }, [])

  useEffect(() => {
    if (!matchesDesktop) {
      if (openSecondSidePanel) {
        setOpenFirstSidePanel(true)
      } else {
        setOpenFirstSidePanel(false)
      }
      setOpenSecondSidePanel(false)
    }
  }, [matchesDesktop])

  useEffect(() => {
    if (!matchesMediumDesktop) {
      if (!openSecondSidePanel) {
        setOpenFirstSidePanel(false)
      }
    }
  }, [matchesMediumDesktop])

  let mainPanel
  switch (firstSidePanel) {
    case Panels.Orders:
      mainPanel =
        <OrderPanel
          handleCloseSidePanel={ handleCloseFirstSidePanel }
          handleOpenSecondSidePanel={ handleOpenSecondSidePanel }
          changeSecondSidePanel={ setSecondSidePanel }
          message={ indOrderMessage }
          setMessage={ setIndOrderMessage }
          order={ order }
        />
      break
    case Panels.Drafts:
      mainPanel =
        <DraftPanel
          closeSidePanel={ handleCloseFirstSidePanel }
          openSecondSidePanel={ handleOpenSecondSidePanel }
          changeSecondSidePanel={ setSecondSidePanel }
          message={ indDraftMessage }
          setMessage={ setIndDraftMessage }
          newDraftID={ newDraftID }
          setNewDraftID={ setNewDraftID }
          draft={ draft }
          addDraft={ addDraft }
          editDraft={ editDraft }
          addingDraft={ addingDraft }
          editingDraft={ editingDraft }
          getCustomers={ getCustomers }
          setDraftCustomerID={ setDraftCustomerID }
          draftCustomerID={ draftCustomerID }
          setSelectedCustomer={ setSelectedCustomer }
          draftProducts={ draftProducts }
          addOrder={ addOrder }
          getDrafts={ getDrafts }
          deleteDraft={ deleteDraft }
          setDraft={ setDraft }
          triggerGetOrders={ setTriggerGetOrders }
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
          getCustomers={ getCustomers }
          setDraftCustomerID={ setDraftCustomerID }
          draftCustomerID={ draftCustomerID }
          setSelectedCustomer={ setSelectedCustomer }
          selectedCustomer={ selectedCustomer }
        />
      break
    case Panels.Products:
      sidePanel =
        <ProductsSelection
          closeSidePanel={ handleCloseSecondSidePanel }
          activePage={ productsActivePage }
          totalPages={ productsTotalPages }
          setActivePage={ productsSetActivePage }
          colMessage={ colProductMessage }
          setColMessage={ setColProductMessage }
          products={ products }
          getProducts={ getProducts }
          draftProducts={ draftProducts }
          setDraftProducts={ setDraftProducts }
          changeSecondSidePanel={ setSecondSidePanel }
          indProductMessage={ indProductMessage }
          setIndProductMessage={ setIndProductMessage }
          newProductToAdd={ newProductToAdd }
          setNewProductToAdd={ setNewProductToAdd }
        />
      break
    case Panels.NewProduct:
      sidePanel =
        <NewProductInDraft
          changeSecondSidePanel={ setSecondSidePanel }
          addProduct={ addProduct }
          draftID={ draft ? draft.coddraft : newDraftID }
          message={ indProductMessage }
          setMessage={ setIndProductMessage }
          setNewProductToAdd={ setNewProductToAdd }
        />
      break
  }


  return (
    <Container css={ (openFirstSidePanel || openSecondSidePanel) ? css`overflow-y: hidden` : null }>
      <HomeWrapper>
        <WelcomeLayer userName={ username } logout={ logout } />
        <ActiveOrders
          activePage={ ordersActivePage }
          totalPages={ ordersTotalPages }
          setActivePage={ ordersSetActivePage }
          setFirstSidePanel={ setFirstSidePanel }
          handleOpenSidePanel={ handleOpenFirstSidePanel }
          handleNewOrder={ handleNewOrder }
          message={ colOrderMessage }
          setColMessage={ setColOrderMessage }
          getOrders={ getOrders }
          orders={ orders }
          triggerGetOrders={ triggerGetOrders }
          setTriggerGetOrders={ setTriggerGetOrders }
        />
        <Drafts
          setFirstSidePanel={ setFirstSidePanel }
          handleOpenSidePanel={ handleOpenFirstSidePanel }
          message={ colDraftMessage }
          setColMessage={ setColDraftMessage }
          getDrafts={ getDrafts }
          getDraft={ getDraft }
          deleteDrafts={ deleteDrafts }
          drafts={ drafts }
        />
      </HomeWrapper>
      <PanelContainer
        open={ matchesMediumDesktop ? undefined : openFirstSidePanel }
        mainChildren={ mainPanel }
        sideChildren={ sidePanel }
        openSidePanel={ openSecondSidePanel }
        border={ false }
      />
    </Container>
  )
}

export default Home