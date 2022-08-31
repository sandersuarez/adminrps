import React from 'react'
import PanelContainer from '../PanelContainer'
import Customers from '../customers/Customers'
import styled from '@emotion/styled'
import EditCustomer from '../customers/EditCustomer'

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
        openSidePanel={ openSidePanel }
        mainChildren=
          {
            <Customers handleOpenSidePanel={ handleOpenSidePanel } />
          }
        sideChildren={ <EditCustomer removable={ false } handleCloseSidePanel={ handleCloseSidePanel } /> }
        border={ true }
      />
    </Container>
  )
}

export default CustomersSection