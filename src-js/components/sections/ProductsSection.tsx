import React from 'react'
import ArticleButton from '../ArticleButton'
import IconProducts from '../svg/IconProducts'
import IconBin from '../svg/IconBin'
import ArticleButtonsWrapper from '../ArticleButtonsWrapper'

const ProductsSection = () => {
  return (
    <section>
      <ArticleButtonsWrapper>
        <ArticleButton title={ 'Mis productos' } icon={ <IconProducts /> } />
        <ArticleButton title={ 'Productos eliminados' } icon={ <IconBin /> } />
      </ArticleButtonsWrapper>
    </section>
  )
}

export default ProductsSection