import React, { FC, MouseEventHandler, ReactElement, useEffect, useState } from 'react'
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
import { concat, filter, findIndex, isEqual } from 'lodash'
import Panels from '../../shapes/Panels'

interface IProps {
  closeSidePanel: () => void
  activePage: number
  totalPages: number
  setActivePage: (page: number) => void
  message: ProductMessage | undefined
  products: ProductShape[] | undefined
  getProducts: (data: GetProducts['Request']) => void
  draftProducts: DraftProductReqData[] | undefined
  setDraftProducts: (tempDraftProducts: DraftProductReqData[] | undefined) => void
  changeSecondSidePanel: (panel: Panels) => void
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
    draftProducts,
    setDraftProducts,
    changeSecondSidePanel,
  },
) => {

  const [searchString, setSearchString] = useState<string>('')

  const [selectedProducts, setSelectedProducts] = useState<DraftProductReqData[] | undefined>(draftProducts)

  const [priceFormatter] =
    useState(new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }))

  const [matches, setMatches] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

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
  }

  const cancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    closeSidePanel()
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
      products_number: matches ? 30 : 15,
    })
  }, [activePage, searchString, matches])

  useEffect(() => {
    if (products !== undefined) {
      setProductList(
        products.map((product, index) => {
          return (
            <SelectableProduct
              key={ index }
              id={ product.codproduct }
              name={ product.nameproduct }
              price={ priceFormatter.format(parseFloat(product.priceproduct)) }
              stock={ product.stockproduct !== null ? product.stockproduct : undefined }
              setAmount={ setAmount }
              initialAmount={ selectedProducts?.find(selected => {
                return selected.codproduct == product.codproduct
              })?.amountproduct }
            />
          )
        }),
      )
    } else {
      setProductList([])
    }
  }, [products, draftProducts, selectedProducts])

  useEffect(() => setSelectedProducts(draftProducts), [draftProducts])

  useEffect(() => {
    window
      .matchMedia('(min-width: 700px)')
      .addEventListener('change', e => setMatches(e.matches))
  }, [])

  return (
    <article>
      <h3>{ 'Seleccionar productos' }</h3>
      {
        message !== undefined && message.type === ProductMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      {
        message !== undefined && message.type === ProductMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' }
               type={ AlertTypes.Error } />
      }
      <SearchBar searchString={ searchString } setSearchString={ setSearchString } />
      <Options>
        {
          products !== undefined &&
          <Button customType={ ButtonTypes.Primary } onClick={ save }>{ 'Guardar' }</Button>
        }
        {
          (message === undefined || message.type === ProductMessageTypes.Info) &&
          <Button customType={ ButtonTypes.Primary } onClick={ changeToAddProduct }>{ 'Nuevo producto' }</Button>
        }
        <Button customType={ ButtonTypes.Secondary } onClick={ cancel }>{ 'Cancelar' }</Button>
      </Options>
      {
        message !== undefined && message.type === ProductMessageTypes.Info &&
        <Alert message={ message.content } type={ AlertTypes.Empty } />
      }
      {
        products !== undefined &&
        <>
          <ProductsContainer productList={ productList } />
          <Pagination activePage={ activePage } totalPages={ totalPages } setActivePage={ setActivePage } />
        </>
      }
    </article>
  )
}

export default ProductsSelection