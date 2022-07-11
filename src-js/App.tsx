import React from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import Sections from './shapes/Sections'
import ProductsSection from './components/ProductsSection'
import CustomersSection from './components/CustomersSection'
import OrdersSection from './components/OrdersSection'
import Settings from './components/Settings'

/**
 * The root component.
 */
const App = () => {
  const [section, setSection] = React.useState<Sections>(Sections.Home)

  let children
  switch (section) {
    case Sections.Home:
      children = <Home />
      break
    case Sections.Products:
      children = <ProductsSection />
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
    <Layout section={ section } setSection={ setSection } children={ children } />
  )
}

export default App