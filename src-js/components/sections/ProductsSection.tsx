import React from 'react'
import ArticleButton from '../ArticleButton'
import IconProducts from '../svg/IconProducts'
import IconBin from '../svg/IconBin'
import ArticleButtonsWrapper from '../ArticleButtonsWrapper'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import margins from '../../styles/margins'

const Container = styled.section`
  padding: ${ margins.mobile.lateral };

  ${ breakpoints.tablet } {
    padding: 1.5rem 1.5rem 2rem 1.5rem;
  }

  ${ breakpoints.desktop } {
    order: 2;
    padding: 1.5rem 3rem 2rem 3rem;
  }
`

const ProductsSection = () => {
  return (
    <Container>
      <ArticleButtonsWrapper>
        <ArticleButton title={ 'Mis productos' } icon={ <IconProducts /> } />
        <ArticleButton title={ 'Productos eliminados' } icon={ <IconBin /> } />
      </ArticleButtonsWrapper>
    </Container>
  )
}

export default ProductsSection