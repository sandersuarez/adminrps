import React from 'react'
import SectionButtonsWrapper from './SectionButtonsWrapper'
import SectionButton from './SectionButton'
import IconOrder from './svg/IconOrder'
import IconPencil from './svg/IconPencil'
import IconArchive from './svg/IconArchive'
import IconBrokenClock from './svg/IconBrokenClock'

const OrdersSection = () => {
  return (
    <section>
      <SectionButtonsWrapper>
        <SectionButton title={ 'Pedidos en Elaboración' } icon={ <IconOrder /> } />
        <SectionButton title={ 'Borradores' } icon={ <IconPencil /> } />
        <SectionButton title={ 'Pedidos vendidos' } icon={ <IconArchive /> } />
        <SectionButton title={ 'Pedidos sin reclamar' } icon={ <IconBrokenClock /> } />
      </SectionButtonsWrapper>
    </section>
  )
}

export default OrdersSection