import React from 'react'
import { Global , css } from '@emotion/react'
import fonts from '../styles/fonts'

const styles = {
  html: css({
    fontSize: '62.5%',
  }),

  body: css`
  ${ fonts.body }
`,

  'nav > ul': css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
  }),
}

/*
  const styles = css`
  html {
    font-size: 62.5%;
  },

  body {
    ${ fonts.body }
  },

  nav > ul {
    list-style: 'none',
    margin: 0,
    padding: 0,
  }
`*/

const GlobalStyles = () => {
  return (
    <Global styles={ styles } />
  )
}

export default GlobalStyles