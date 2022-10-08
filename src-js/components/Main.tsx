import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import styled from '@emotion/styled'
import breakpoints from '../styles/breakpoints'
import Sections from '../shapes/Sections'
import ProductsArticles from '../shapes/ProductsArticles'
import Home from './sections/Home'
import ProductsSection from './sections/ProductsSection'
import CustomersSection from './sections/CustomersSection'
import OrdersSection from './sections/OrdersSection'
import Settings from './sections/Settings'
import useSession from '../hooks/useSession'
import LoginForm from './forms/LoginForm'
import { Route, Routes, useLocation } from 'react-router-dom'
import ErrorPage from './ErrorPage'

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  ${ breakpoints.desktop } {
    flex-flow: row nowrap;
  }

  & > section {
    flex-grow: 1;

    ${ breakpoints.desktop } {
      order: 2;
    }
  }
`

const Container = styled.main`
  height: calc(100vh - 3.5rem);
`

const Main = () => {
  const { user, message, login, sessionCheck, sessionRenew, logout } = useSession()
  const location = useLocation()
  const [section, setSection] = useState<Sections>(Sections.Home)
  const [productsArticle, setProductsArticle] = useState<string>('menu')

  useEffect(sessionRenew, [location])

  const handleSetSection = (value: (((prevState: Sections) => Sections) | Sections)) => {

    if (section === Sections.Products && value === Sections.Products) {
      setProductsArticle(ProductsArticles.Menu)
    } else {
      setSection(value)
      reset()
    }
  }

  const reset = () => {
    setProductsArticle(ProductsArticles.Menu)
  }

  const handleSetProductsArticle = (article: string) => {
    setProductsArticle(article)
  }

  return (
    <Container>
      <MainWrapper>
        {
          user ?
            <>
              <Routes>
                <Route
                  index
                  element={ <Home username={ user.nameuser } logout={ logout } sessionCheck={ sessionCheck } /> }
                />
                <Route path={ 'products' } element={ <ProductsSection article={ productsArticle }
                                                                      setArticle={ handleSetProductsArticle } /> } />
                <Route path={ 'customers' } element={ <CustomersSection /> } />
                <Route path={ 'orders' } element={ <OrdersSection /> } />
                <Route path={ 'settings' } element={ <Settings /> } />
                <Route path={ '*' } element={ <ErrorPage /> } />
              </Routes>
              <Navbar />
            </>
            :
            <LoginForm login={ login } message={ message } />
        }
      </MainWrapper>
    </Container>
  )
}

export default Main