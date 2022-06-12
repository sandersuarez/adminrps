import React from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import GlobalStyles from './components/GlobalStyles'

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Layout>
        <Home />
      </Layout>
    </>

  )
}

export default App