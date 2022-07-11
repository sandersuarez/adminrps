import React from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import Sections from './shapes/Sections'
import ProductsSection from './components/ProductsSection'

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
    default:
      children = <Home />
  }

  return (
    <Layout section={ section } setSection={ setSection } children={ children } />
  )
}

export default App