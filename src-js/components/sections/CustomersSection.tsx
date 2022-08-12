import React from 'react'
import PanelContainer from '../PanelContainer'
import Customers from '../customers/Customers'
import styled from '@emotion/styled'
import EditCustomer from '../customers/EditCustomer'

const Container = styled.section`
  position: relative;
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
        mainChildren=
          {
            <Customers title={ true } />
          }
        sideChildren={ <EditCustomer removable={ false } openSidePanel={openSidePanel}/> }
      />
    </Container>
  )
}

export default CustomersSection