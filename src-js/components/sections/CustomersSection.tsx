import React from 'react'
import PanelContainer from '../PanelContainer'
import Customers from '../Customers'

const CustomersSection = () => {
  return (
    <section>
      <PanelContainer
        mainChildren=
          {
            <Customers title={ true } />
          }
        sideChildren={ <></> }
      />
    </section>
  )
}

export default CustomersSection