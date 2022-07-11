import React from 'react'
import SectionButton from './SectionButton'
import IconProducts from './svg/IconProducts'
import IconBin from './svg/IconBin'
import SectionButtonsWrapper from './SectionButtonsWrapper'

const ProductsSection = () => {
  return (
    <section>
      <SectionButtonsWrapper>
        <SectionButton title={ 'Mis productos' } icon={ <IconProducts /> } />
        <SectionButton title={ 'Productos eliminados' } icon={ <IconBin /> } />
      </SectionButtonsWrapper>
    </section>
  )
}

export default ProductsSection