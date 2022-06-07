import React from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  return <p>hello world :3</p>
}

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
