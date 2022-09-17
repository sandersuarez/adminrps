import React, { useState } from 'react'
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
import LoginForm from './LoginForm'

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
  height: calc(100vh - 3rem);

  ${ breakpoints.tablet } {
    height: calc(100vh - 3.5rem);
  }
`

const Main = () => {
  const { user, message, login, logout, clearMessage } = useSession()
  const [section, setSection] = useState<Sections>(Sections.Home)
  const [productsArticle, setProductsArticle] = useState<string>('menu')

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

  let children
  switch (section) {
    case Sections.Home:
      children = <Home />
      break
    case Sections.Products:
      children = <ProductsSection article={ productsArticle } setArticle={ handleSetProductsArticle } />
      break
    case Sections.Customers:
      children = <CustomersSection />
      break
    case Sections.Orders:
      children = <OrdersSection />
      break
    case Sections.Settings:
      children = <Settings />
      break
    default:
      children = <Home />
  }

  return (
    <Container>
      <MainWrapper>
        {
          user ?
            <>
              { children }
              <Navbar selectedSection={ section } setSection={ handleSetSection } />
            </>
            :
            <LoginForm login={ login } />
        }
      </MainWrapper>
    </Container>
  )
}

export default Main