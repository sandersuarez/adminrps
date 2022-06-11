import { css } from '@emotion/css'

const global = css({
  // 62.5% font size trick
  html: {
    fontSize: '62.5%',
  },
  body: {
    fontSize: '1.6rem',
  },
  'nav > ul': {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
})

export default global
