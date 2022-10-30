import React, { FC, useEffect, useState } from 'react'
import styled from '@emotion/styled/dist/emotion-styled.cjs'
import margins from '../../styles/margins'
import { GetProducts, ProductMessage, ProductMessageTypes } from '../../hooks/useProducts'
import ProductShape from '../../shapes/ProductShape'
import Alert from '../Alert'
import AlertTypes from '../../shapes/AlertTypes'
import SearchBar from '../SearchBar'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Options from '../buttons/Options'
import { CustomerMessageTypes } from '../../hooks/useCustomers'
import Pagination from '../Pagination'
import ProductsContainer from './ProductsContainer'
import product from './Product'
import SelectableProduct from './SelectableProduct'

const Container = styled.article`
  --vertical-margin: ${ margins.mobile.mediumVertical };
  --horizontal-margin: ${ margins.mobile.lateral };

  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: var(--vertical-margin) var(--horizontal-margin);
`

interface IProps {
  closeSidePanel: () => void
  activePage: number
  totalPages: number
  setActivePage: (page: number) => void
  message: ProductMessage | undefined
  products: ProductShape[] | undefined
  getProducts: (data: GetProducts['Request']) => void
  setDraftProducts: (products: ProductShape[]) => void
  draftProducts: ProductShape[] | undefined
}

const ProductsSelection: FC<IProps> = (
  {
    closeSidePanel,
    activePage,
    totalPages,
    setActivePage,
    message,
    products,
    getProducts,
    setDraftProducts,
    draftProducts,
  },
) => {

  const [searchString, setSearchString] = useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState(products)

  const [matches, setMatches] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

  useEffect(() => {
    // noinspection SpellCheckingInspection
    getProducts({
      name: searchString,
      page: 1,
      products_number: matches ? 30 : 15,
    })
  }, [activePage, searchString, matches])

  return (
    <Container>
      {
        message !== undefined && message.type === ProductMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      <SearchBar searchString={ searchString } setSearchString={ setSearchString } />
      <Options>
        {
          products !== undefined &&
          <Button customType={ ButtonTypes.Primary }>{ 'Guardar' }</Button>
        }
        {
          (message === undefined || message.type === ProductMessageTypes.Info) &&
          <Button customType={ ButtonTypes.Primary }>{ 'Nuevo producto' }</Button>
        }
        <Button customType={ ButtonTypes.Secondary } onClick={ closeSidePanel }>{ 'Cancelar' }</Button>
      </Options>
      {
        message !== undefined && message.type === ProductMessageTypes.Info &&
        <Alert message={ message.content } type={ AlertTypes.Empty } />
      }
      {
        products !== undefined &&
        <>
          <ProductsContainer productList={
            products.map((product, index) => {
              return (
                <SelectableProduct
                  key={ index }
                  id={ product.codproduct }
                  name={ product.nameproduct }
                  price={ product.priceproduct }
                />
              )
            })
          }
          />
          <Pagination activePage={ activePage } totalPages={ totalPages } setActivePage={ setActivePage } />
        </>
      }
    </Container>
  )
}

export default ProductsSelection