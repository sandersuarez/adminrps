import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'modern-normalize/modern-normalize.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/global.css'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
