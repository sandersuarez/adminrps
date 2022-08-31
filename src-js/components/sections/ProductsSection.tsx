import React, { FC } from 'react'
import ArticleButton from '../ArticleButton'
import IconProducts from '../svg/IconProducts'
import IconBin from '../svg/IconBin'
import ArticleButtonsWrapper from '../ArticleButtonsWrapper'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import ProductsArticles from '../../shapes/ProductsArticles'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: ${ margins.mobile.lateral };
  overflow-y: auto;
`

const Container = styled.section`
  position: relative;
  width: 100%;
  overflow: hidden;
`

interface IProps {
  article: string
  setArticle: (article: string) => void
}

/**
 * This is the products section. Here, the user can manage his products, removing, creating, searching, and editing.
 * This section also implements a recycling bin for deleted products.
 */
const ProductsSection: FC<IProps> = ({ article, setArticle }) => {

  let children
  switch (article) {
    case ProductsArticles.Menu:
      children =
        <ArticleButtonsWrapper>
          <ArticleButton
            title={ 'Mis productos' }
            handleClick={ () => setArticle(ProductsArticles.Products) }
            icon={ <IconProducts /> }
          />
          <ArticleButton
            title={ 'Productos eliminados' }
            handleClick={ () => setArticle(ProductsArticles.Deleted) }
            icon={ <IconBin /> }
          />
        </ArticleButtonsWrapper>
      break
    case ProductsArticles.Products:
      children =
        <Wrapper>
          <p>{ 'products' }</p>
        </Wrapper>
      break
    case ProductsArticles.Deleted:
      children =
        <Wrapper>
          <p>{ 'bin' }</p>
        </Wrapper>
      break
  }

  return (
    <Container children={ children } />
  )
}

export default ProductsSection