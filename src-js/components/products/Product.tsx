import React, { FC, Key, MouseEventHandler, useEffect, useRef } from 'react'
import Details from '../details/Details'
import DetailsSummary from '../details/DetailsSummary'
import DetailsArrow from '../details/DetailsArrow'
import DetailsContent from '../details/DetailsContent'
import ButtonTypes from '../../shapes/ButtonTypes'
import fonts from '../../styles/fonts'
import IconDown from '../svg/IconDown'
import Button from '../buttons/Button'
import { css } from '@emotion/react'

export interface ProductProps {
  key: Key
  index: Key
  name: string
  price: number
  deleted: boolean
  removable: boolean
  stock?: number
  handleProductClick: (index: Key) => void
  handleOpenSidePanel: () => void
  openedElement: Key
}

/**
 * This component is a product details element. It lets the user find, edit, or remove a product.
 */
const Product: FC<ProductProps> = (
  {
    name,
    price,
    deleted,
    removable,
    handleProductClick,
    handleOpenSidePanel,
    openedElement,
    index,
    stock,
  },
) => {

  const [height, setHeight] = React.useState<string>('unset')

  const formattedPrice =
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price)

  const containerRef = useRef<HTMLDetailsElement | null>(null)

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()

    if (openedElement === index) {
      handleProductClick('')
    } else {
      handleProductClick(index)
    }

    if (!containerRef.current!.open) {
      containerRef.current!.open = true
    }
  }

  useEffect(() => {
    setHeight(`${ containerRef.current!.offsetHeight }px`)
  }, [])

  return (
    <Details
      transition={ { ease: 'easeOut', duration: .3 } }
      animate={ (openedElement === index) ? { height: 'auto' } : { height: `${ height }` } }
      ref={ containerRef }
    >
      <DetailsSummary onClick={ handleClick! } css={ css`justify-content: end` }>
        <p css={ css`flex-grow: 1` }>{ name } ({ formattedPrice })</p>
        {
          stock &&
          <p>{ 'Stock: ' }{ stock }</p>
        }
        <DetailsArrow
          animate={ (openedElement === index) ? { rotate: 180 } : {} }
          transition={ { ease: 'easeOut', duration: .3 } }
        >
          <IconDown />
        </DetailsArrow>
      </DetailsSummary>
      <DetailsContent>
        {
          deleted ?
            <>
              <Button customType={ ButtonTypes.Secondary } onClick={ handleOpenSidePanel }>Editar</Button>
              <Button customType={ ButtonTypes.Danger } disabled={ !removable }>Eliminar definitivamente</Button>
              {
                !removable &&
                <p css={ fonts.formMessage }>No es posible eliminar este cliente porque tiene pedidos registrados a su
                  nombre.</p>
              }
            </>
            :
            <>
              <Button customType={ ButtonTypes.Secondary } onClick={ handleOpenSidePanel }>Editar</Button>
              <Button customType={ ButtonTypes.Danger }>Eliminar</Button>
            </>
        }
      </DetailsContent>
    </Details>
  )
}

export default Product