import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import { ProductProps } from './Product'
import margins from '../styles/margins'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.vertical };
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