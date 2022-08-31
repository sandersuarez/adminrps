import React from 'react'
import Layout from './components/Layout'
import Home from './components/sections/Home'
import Sections from './shapes/Sections'
import ProductsSection from './components/sections/ProductsSection'
import CustomersSection from './components/sections/CustomersSection'
import OrdersSection from './components/sections/OrdersSection'
import Settings from './components/sections/Settings'
import ProductsArticles from './shapes/ProductsArticles'

/**
 * The root component. Manages main navigation mechanics.
 */
const App = () => {
  const [section, setSection] = React.useState<Sections>(Sections.Home)
  const [productsArticle, setProductsArticle] = React.useState<string>('menu')

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
    <Layout section={ section } setSection={ handleSetSection } children={ children } />
  )
}

export default App