import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'modern-normalize/modern-normalize.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
