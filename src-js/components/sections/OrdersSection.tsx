import React from 'react'
import ArticleButtonsWrapper from '../ArticleButtonsWrapper'
import ArticleButton from '../ArticleButton'
import IconOrder from '../svg/IconOrder'
import IconPencil from '../svg/IconPencil'
import IconArchive from '../svg/IconArchive'
import IconBrokenClock from '../svg/IconBrokenClock'

const OrdersSection = () => {
  //const [section, setSection] = React.useState<Sections>(Sections.Home)
  return (
    <section>
      <ArticleButtonsWrapper>
        <ArticleButton title={ 'Pedidos en Elaboración' } icon={ <IconOrder /> } />
        <ArticleButton title={ 'Borradores' } icon={ <IconPencil /> } />
        <ArticleButton title={ 'Pedidos vendidos' } icon={ <IconArchive /> } />
        <ArticleButton title={ 'Pedidos sin reclamar' } icon={ <IconBrokenClock /> } />
      </ArticleButtonsWrapper>
    </section>
  )
}

export default OrdersSection