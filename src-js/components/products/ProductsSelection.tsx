import React, { FC, MouseEventHandler, ReactElement, useEffect, useState } from 'react'
import { GetProducts, ProductMessage, ProductMessageTypes } from '../../hooks/useProducts'
import ProductShape, { ProductReqData } from '../../shapes/ProductShape'
import Alert from '../Alert'
import AlertTypes from '../../shapes/AlertTypes'
import SearchBar from '../SearchBar'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Options from '../buttons/Options'
import Pagination from '../Pagination'
import ProductsContainer from './ProductsContainer'
import SelectableProduct from './SelectableProduct'
import { concat, filter, findIndex, isEqual, isUndefined } from 'lodash'
import Panels from '../../shapes/Panels'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'

const Container = styled.article`
  ${ breakpoints.tablet } {
    ${ Options } {
      margin-top: 0;
    }
  }
`

interface IProps {
  closeSidePanel: () => void
  activePage: number
  totalPages: number
  setActivePage: (page: number) => void
  colMessage: ProductMessage | undefined
  setColMessage: (message: ProductMessage | undefined) => void
  products: ProductShape[] | undefined
  getProducts: (data: GetProducts['Request']) => void
  draftProducts: ProductReqData[] | undefined
  setDraftProducts: (tempDraftProducts: ProductReqData[] | undefined) => void
  changeSecondSidePanel: (panel: Panels) => void
  indProductMessage: ProductMessage | undefined
  setIndProductMessage: (message: ProductMessage | undefined) => void
  newProductToAdd: ProductReqData | undefined
  setNewProductToAdd: (product: ProductReqData | undefined) => void
}

const ProductsSelection: FC<IProps> = (
  {
    closeSidePanel,
    activePage,
    totalPages,
    setActivePage,
    colMessage,
    setColMessage,
    products,
    getProducts,
    draftProducts,
    setDraftProducts,
    changeSecondSidePanel,
    indProductMessage,
    setIndProductMessage,
    newProductToAdd,
    setNewProductToAdd,
  },
) => {

  const [searchString, setSearchString] = useState<string>('')

  const [selectedProducts, setSelectedProducts] = useState<ProductReqData[] | undefined>(draftProducts)

  const [priceFormatter] =
    useState(new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }))

  const [matchesTablet, setMatchesTablet] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

  const [matchesDesktop, setMatchesDesktop] =
    useState<boolean>(window.matchMedia('(min-width: 992px)').matches)

  const [productList, setProductList] = useState<ReactElement[]>([])

  const setAmount = (id: number, amount: number) => {
    if (amount > 0) {
      if (selectedProducts !== undefined) {
        // noinspection SpellCheckingInspection
        if (findIndex(selectedProducts, { codproduct: id }) !== -1) {
          // noinspection SpellCheckingInspection
          let aux = filter(selectedProducts, product => {
            return product.codproduct != id
          })
          // noinspection SpellCheckingInspection
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

  const save: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setDraftProducts(selectedProducts)
    closeSidePanel()
    setIndProductMessage(undefined)
    setColMessage(undefined)
  }

  const cancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    closeSidePanel()
    setIndProductMessage(undefined)
    setColMessage(undefined)
    if (!isEqual(selectedProducts, draftProducts)) {
      setSelectedProducts(draftProducts)
    }
  }

  const changeToAddProduct: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setDraftProducts(selectedProducts)
    changeSecondSidePanel(Panels.NewProduct)
  }

  useEffect(() => {
    // noinspection SpellCheckingInspection
    getProducts({
      name: searchString,
      products_number: matchesTablet ? 30 : 15,
    })
  }, [activePage, searchString, matchesTablet])

  useEffect(() => {
    if (searchString != '') {
      setIndProductMessage(undefined)
      setColMessage(undefined)
    }
  }, [searchString])

  useEffect(() => {
    if (products !== undefined) {
      setProductList(
        products.map((product) => {

          let initialAmount: number | undefined = 0
          if (selectedProducts !== undefined) {
            initialAmount = selectedProducts.find(selected => {
              return selected.codproduct == product.codproduct
            })?.amountproduct
          }
          
          // noinspection SpellCheckingInspection
          return (
            <SelectableProduct
              key={ product.codproduct }
              id={ product.codproduct }
              name={ product.nameproduct }
              price={ priceFormatter.format(parseFloat(product.priceproduct)) }
              stock={ product.stockproduct !== null ? product.stockproduct : undefined }
              setAmount={ setAmount }
              initialAmount={ initialAmount }
            />
          )
        }),
      )
    } else {
      setProductList([])
    }
  }, [products, draftProducts, selectedProducts])

  useEffect(() => {
    if (isUndefined(draftProducts)) {
      if (!isUndefined(newProductToAdd)) {
        setSelectedProducts([newProductToAdd])
        setNewProductToAdd(undefined)
      } else {
        setSelectedProducts(draftProducts)
      }
    } else {
      if (!isUndefined(newProductToAdd)) {
        setSelectedProducts(concat(draftProducts, newProductToAdd))
        setNewProductToAdd(undefined)
      } else {
        setSelectedProducts(draftProducts)
      }
    }
  }, [draftProducts])

  useEffect(() => {
    window
      .matchMedia('(min-width: 700px)')
      .addEventListener('change', e => setMatchesTablet(e.matches))
    window
      .matchMedia('(min-width: 992px)')
      .addEventListener('change', e => setMatchesDesktop(e.matches))
  }, [])

  return (
    <Container>
      <h3>{ 'Seleccionar productos' }</h3>
      {
        colMessage !== undefined && colMessage.type === ProductMessageTypes.Warning &&
        <Alert message={ colMessage.content } type={ AlertTypes.Warning } />
      }
      {
        colMessage !== undefined && colMessage.type === ProductMessageTypes.Error &&
        <Alert message={ colMessage.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
      <SearchBar searchString={ searchString } setSearchString={ setSearchString } />
      <Options>
        {
          products !== undefined &&
          <Button customType={ ButtonTypes.Primary } onClick={ save }>{ 'Guardar' }</Button>
        }
        {
          (colMessage === undefined || colMessage.type === ProductMessageTypes.Info) &&
          <Button customType={ ButtonTypes.Primary } onClick={ changeToAddProduct }>{ 'Nuevo producto' }</Button>
        }
        {
          !matchesDesktop &&
          <Button customType={ ButtonTypes.Secondary } onClick={ cancel }>{ 'Cancelar' }</Button>
        }
      </Options>
      {
        colMessage !== undefined && colMessage.type === ProductMessageTypes.Info &&
        <Alert message={ colMessage.content } type={ AlertTypes.Empty } />
      }
      {
        indProductMessage !== undefined && indProductMessage.type === ProductMessageTypes.Success &&
        <Alert message={ indProductMessage.content } type={ AlertTypes.Success } />
      }
      {
        products !== undefined &&
        <>
          <ProductsContainer productList={ productList } />
          <Pagination activePage={ activePage } totalPages={ totalPages } setActivePage={ setActivePage } />
        </>
      }
    </Container>
  )
}

export default ProductsSelection