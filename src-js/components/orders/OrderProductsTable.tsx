import React, { FC, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'
import margins from '../../styles/margins'
import ProductShape from '../../shapes/ProductShape'

const Gradient = styled.div`
  position: absolute;
  width: 100%;
  height: ${ margins.mobile.mediumVertical };
  bottom: 0;
  left: 0;
  background: linear-gradient(0deg, ${ colors.background } 20%, transparent 100%);
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border-color: ${ colors.separators };

  thead {
    border-bottom: 1px solid;
  }

  td:not(:first-of-type), th:not(:first-of-type) {
    border-left: solid 1px;
  }

  tbody tr:last-of-type {
    border-top: solid 1px;
    font-weight: bold;
  }

  th,
  tbody tr:last-of-type td:nth-of-type(2),
  tbody tr:not(:last-of-type) td:nth-of-type(2) {
    text-align: center;
  }

  td:not(:nth-of-type(1)) {
    text-align: right;
  }

  th {
    padding-top: 0.4rem;
    padding-bottom: ${ margins.mobile.littleGap };
  }

  td {
    padding: ${ margins.mobile.tinyLateral } ${ margins.mobile.littleGap };
  }

  tr:first-of-type td {
    padding-top: ${ margins.mobile.mediumVertical };
  }

  tr:nth-last-of-type(2) td {
    padding-bottom: ${ margins.mobile.mediumVertical };
  }

  tr:last-of-type td {
    padding-top: ${ margins.mobile.littleGap };
    padding-bottom: 0.4rem;
  }

  span {
    white-space: nowrap;
    margin-left: .75em;
  }
`

const TableContainer = styled.div`
  padding: ${ margins.mobile.lateral };
  background: ${ colors.background };
  max-height: 25.6rem;
  overflow-y: auto;
  cursor: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  ${ breakpoints.bigDesktop } {
    max-height: 19.2rem;
  }
`

const Container = styled.div`
  position: relative;

  ${ breakpoints.tablet } {
    margin-top: ${ margins.tablet.vertical };
  }
`

// noinspection SpellCheckingInspection
interface OrderProductsTableProps {
  className?: string
  draftProducts?: (ProductShape & { amountproductdraft: number })[]
  orderProducts?: (ProductShape & { amountproductorder: number })[]
}

/**
 * Component that renders a products resume table for an order. The resume table may let the user edit the list. It
 * contains the name of the product with the unitary price, the amount, and the total price.
 */
const OrderProductsTable: FC<OrderProductsTableProps> = (
  {
    className,
    draftProducts,
    orderProducts,
  }) => {

  const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

  // noinspection SpellCheckingInspection
  const [total, setTotal] = useState<number>(draftProducts !== undefined ?
    draftProducts.reduce((acc, product) => {
      return acc + parseFloat(product.priceproduct) * product.amountproductdraft
    }, 0)
    :
    orderProducts !== undefined ?
      orderProducts.reduce((acc, product) => {
        return acc + parseFloat(product.priceproduct) * product.amountproductorder
      }, 0)
      : 0,
  )

  useEffect(() => {
    setTotal(draftProducts !== undefined ?
      draftProducts.reduce((acc, product) => {
        return acc + parseFloat(product.priceproduct) * product.amountproductdraft
      }, 0)
      :
      orderProducts !== undefined ?
        orderProducts.reduce((acc, product) => {
          return acc + parseFloat(product.priceproduct) * product.amountproductorder
        }, 0)
        : 0,
    )
  }, [draftProducts, orderProducts])

  return (
    <Container className={ className }>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th scope={ 'col' }></th>
              <th scope={ 'col' }>{ 'Cantidad' }</th>
              <th scope={ 'col' }>{ 'Precio' }</th>
            </tr>
          </thead>
          <tbody children={
            <>
              {
                draftProducts !== undefined ?
                  draftProducts.map((product, index) => {
                    return (
                      <tr key={ index }>
                        <td scope={ 'row' }>{ product.nameproduct }
                          <span>{ '(' + formatter.format(parseFloat(product.priceproduct)) + ')' }</span>
                        </td>
                        <td>{ product.amountproductdraft }</td>
                        <td>{ formatter.format(parseFloat(product.priceproduct) * product.amountproductdraft) }</td>
                      </tr>
                    )
                  })
                  :
                  orderProducts !== undefined ?
                    orderProducts.map((product, index) => {
                      return (
                        <tr key={ index }>
                          <td scope={ 'row' }>{ product.nameproduct }
                            <span>{ '(' + formatter.format(parseFloat(product.priceproduct)) + ')' }</span>
                          </td>
                          <td>{ product.amountproductorder }</td>
                          <td>{ formatter.format(parseFloat(product.priceproduct) * product.amountproductorder) }</td>
                        </tr>
                      )
                    })
                    :
                    <tr>
                      <td scope={ 'row' }></td>
                      <td></td>
                      <td></td>
                    </tr>
              }
              <tr>
                <td scope={ 'row' }></td>
                <td>{ 'Total' }</td>
                <td>{ formatter.format(total) }</td>
              </tr>
            </>
          } />
        </Table>
      </TableContainer>
      <Gradient />
    </Container>
  )
}

export default styled(OrderProductsTable)``