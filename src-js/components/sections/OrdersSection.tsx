import React from 'react'
import ArticleButtonsWrapper from '../ArticleButtonsWrapper'
import ArticleButton from '../ArticleButton'
import IconOrder from '../svg/IconOrder'
import IconPencil from '../svg/IconPencil'
import IconArchive from '../svg/IconArchive'
import IconBrokenClock from '../svg/IconBrokenClock'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'

const Container = styled.section`
  padding: 1rem;

  ${ breakpoints.tablet } {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  ${ breakpoints.desktop } {
    order: 2;
    padding: 1.5rem 3rem 2rem 3rem;
  }
`

const OrdersSection = () => {
  //const [section, setSection] = React.useState<Sections>(Sections.Home)
  return (
    <Container>
      <ArticleButtonsWrapper>
        <ArticleButton title={ 'Pedidos en Elaboración' } icon={ <IconOrder /> } />
        <ArticleButton title={ 'Borradores' } icon={ <IconPencil /> } />
        <ArticleButton title={ 'Pedidos vendidos' } icon={ <IconArchive /> } />
        <ArticleButton title={ 'Pedidos sin reclamar' } icon={ <IconBrokenClock /> } />
      </ArticleButtonsWrapper>
    </Container>
  )
}

export default OrdersSection