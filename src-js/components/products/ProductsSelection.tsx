import React, { FC, useEffect, useState } from 'react'
import margins from '../../styles/margins'
import { GetProducts, ProductMessage, ProductMessageTypes } from '../../hooks/useProducts'
import ProductShape, { DraftProductReqData } from '../../shapes/ProductShape'
import Alert from '../Alert'
import AlertTypes from '../../shapes/AlertTypes'
import SearchBar from '../SearchBar'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Options from '../buttons/Options'
import Pagination from '../Pagination'
import ProductsContainer from './ProductsContainer'
import SelectableProduct from './SelectableProduct'
import styled from '@emotion/styled'
import { concat, filter, findIndex } from 'lodash'

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
  setDraftProducts: (products: (ProductShape & { amountproductdraft: number })[]) => void
  draftProducts: (ProductShape & { amountproductdraft: number })[] | undefined
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

  const [selectedProducts, setSelectedProducts] = useState<DraftProductReqData[] | undefined>(
    draftProducts?.map(product => {
      return { codproduct: product.codproduct, amountproduct: product.amountproductdraft }
    }))

  const [priceFormatter] =
    useState(new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }))

  const [matches] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

  const setAmount = (id: number, amount: number) => {

    if (amount > 0) {
      if (selectedProducts !== undefined) {
        // noinspection SpellCheckingInspection
        if (findIndex(selectedProducts, { codproduct: id }) !== -1) {
          // noinspection SpellCheckingInspection
          let aux = filter(selectedProducts, product => {
            return product.codproduct != id
          })
          setSelectedProducts(
            concat(aux, { codproduct: id, amountproduct: amount }),
          )
        } else {
          // noinspection SpellCheckingInspection
          setSelectedProducts(concat(selectedProducts, { codproduct: id, amountproduct: amount }))
        }
      } else {
        // noinspection SpellCheckingInspection
        setSelectedProducts([{ codproduct: id, amountproduct: amount }])
      }
    } else {
      if (selectedProducts !== undefined) {
        // noinspection SpellCheckingInspection
        setSelectedProducts(filter(selectedProducts, product => {
          return product.codproduct != id
        }))
      }
    }
  }

  useEffect(() => {
    // noinspection SpellCheckingInspection
    getProducts({
      name: searchString,
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

              let coincidentProduct = undefined
              if (draftProducts !== undefined) {
                coincidentProduct = draftProducts.find(selected => {
                  return selected.codproduct == product.codproduct
                })
              }

              return (
                <SelectableProduct
                  key={ index }
                  id={ product.codproduct }
                  name={ product.nameproduct }
                  price={ priceFormatter.format(parseFloat(product.priceproduct)) }
                  stock={ product.stockproduct !== null ? product.stockproduct : undefined }
                  setAmount={ setAmount }
                  initialAmount={ coincidentProduct !== undefined ? coincidentProduct.amountproductdraft : 0 }
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