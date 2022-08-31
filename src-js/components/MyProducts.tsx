import React, { FC, Key } from 'react'
import buttonTypes from '../shapes/ButtonTypes'
import { css } from '@emotion/react'
import Button from './Button'
import SearchBar from './SearchBar'
import Alert from './Alert'
import Pagination from './Pagination'
import margins from '../styles/margins'
import styled from '@emotion/styled'
import ProductsContainer from './ProductsContainer'
import Product from './Product'
import TitleWrapper from './TitleWrapper'
import ExitButton from './ExitButton'

const Container = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };
`

interface IProps {
  handleOpenSidePanel: () => void
  back: () => void
}

const MyProducts: FC<IProps> = ({ handleOpenSidePanel, back }) => {

  const [openedElement, setOpenedElement] = React.useState<Key>('')

  const handleProductClick = (index: Key) => {
    setOpenedElement(index)
  }

  return (
    <Container>
      <TitleWrapper>
        <h2>{ 'Mis productos' }</h2>
        <ExitButton onClick={ back }>
          <i className={ 'bi bi-x' } />
        </ExitButton>
      </TitleWrapper>
      <Button customType={ buttonTypes.Primary } css={ css`align-self: start` }>Nuevo producto</Button>
      <SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <ProductsContainer
        productList=
          { [
            <Product key={ 0 } index={ 0 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 1 } index={ 1 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 2 } index={ 2 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 3 } index={ 3 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } stock={ 5 } />,
            <Product key={ 4 } index={ 4 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 5 } index={ 5 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 6 } index={ 6 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } stock={ 9 } />,
            <Product key={ 7 } index={ 7 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 8 } index={ 8 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 9 } index={ 9 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 10 } index={ 10 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
            <Product key={ 11 } index={ 11 } name={ 'Agua' } price={ 1 } deleted={ false }
                     removable={ false } handleProductClick={ handleProductClick }
                     handleOpenSidePanel={ handleOpenSidePanel } openedElement={ openedElement } />,
          ] }
      />
      <Pagination />
    </Container>
  )
}

export default MyProducts