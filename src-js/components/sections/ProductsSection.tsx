import React, { FC, useEffect } from 'react'
import ArticleButton from '../buttons/ArticleButton'
import IconProducts from '../svg/IconProducts'
import IconBin from '../svg/IconBin'
import ArticleButtonsWrapper from '../buttons/ArticleButtonsWrapper'
import styled from '@emotion/styled'
import ProductsArticles from '../../shapes/ProductsArticles'
import MyProducts from '../products/MyProducts'
import PanelContainer from '../PanelContainer'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
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
  const [openSidePanel, setOpenSidePanel] = React.useState<boolean>(false)

  const handleOpenSidePanel = () => {
    setOpenSidePanel(true)
  }

  const handleCloseSidePanel = () => {
    setOpenSidePanel(false)
  }

  useEffect(() => {
    if (article === ProductsArticles.Menu) {
      handleCloseSidePanel()
    }
  }, [article])

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
        <PanelContainer
          openSidePanel={ openSidePanel }
          mainChildren=
            {
              <MyProducts
                handleOpenSidePanel={ handleOpenSidePanel }
                back={ () => setArticle(ProductsArticles.Menu) }
              />
            }
          sideChildren={ <></> }
          border={ true }
        />
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