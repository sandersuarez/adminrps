import React from 'react'
import SectionButton from './SectionButton'
import IconProducts from './svg/IconProducts'
import IconBin from './svg/IconBin'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 49.4rem;
  margin: auto;
  row-gap: 1rem;

  ${breakpoints.tablet} {
    row-gap: 3rem;
  }
  
  ${breakpoints.desktop} {
    flex-flow: row wrap;
    max-width: unset;
    justify-content: flex-start;
    align-items: flex-start;
    height: unset;
    margin-top: 1.5rem;
    column-gap: 3rem;
  }
`

const ProductsSection = () => {
  return (
    <section>
      <ButtonsWrapper>
        <SectionButton title={ 'Mis productos' } icon={ <IconProducts /> } />
        <SectionButton title={ 'Productos eliminados' } icon={ <IconBin /> } />
      </ButtonsWrapper>
    </section>
  )
}

export default ProductsSection