import React from 'react'
import PanelContainer from '../PanelContainer'
import Customers from '../customers/Customers'
import styled from '@emotion/styled'
import EditCustomer from '../customers/EditCustomer'
import { css } from '@emotion/react'
import colors from '../../styles/colors'

const sidePanelStyles = css`
  & > div:nth-last-of-type {
    border-left: 1px solid ${ colors.separators };
  }
`

const Container = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
`

const CustomersSection = () => {
  const [openSidePanel, setOpenSidePanel] = React.useState<boolean>(false)

  const handleOpenSidePanel = () => {
    setOpenSidePanel(true)
  }

  const handleCloseSidePanel = () => {
    setOpenSidePanel(false)
  }

  return (
    <Container>
      <PanelContainer
        css={ sidePanelStyles }
        openSidePanel={ openSidePanel }
        mainChildren=
          {
            <Customers title={ true } handleOpenSidePanel={ handleOpenSidePanel } />
          }
        sideChildren={ <EditCustomer removable={ false } handleCloseSidePanel={ handleCloseSidePanel } /> }
      />
    </Container>
  )
}

export default CustomersSection