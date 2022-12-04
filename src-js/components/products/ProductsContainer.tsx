import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import { ProductProps } from './Product'
import margins from '../../styles/margins'
import breakpoints from '../../styles/breakpoints'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.gridSpace };
  
  ${ breakpoints.tablet } {
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${ margins.tablet.gridSpace };
    margin-top: ${ margins.tablet.gridSpace };
  }
`

interface IProps {
  productList: ReactElement<ProductProps>[]
}

const ProductsContainer: FC<IProps> = ({ productList }) => {
  return (
    <Container children={ productList } />
  )
}

export default ProductsContainer