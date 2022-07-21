import React from 'react'
import Layout from './components/Layout'
import Home from './components/sections/Home'
import Sections from './shapes/Sections'
import ProductsSection from './components/sections/ProductsSection'
import CustomersSection from './components/sections/CustomersSection'
import OrdersSection from './components/sections/OrdersSection'
import Settings from './components/sections/Settings'

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