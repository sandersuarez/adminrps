import { css } from '@emotion/css'
import breakpoints from './breakpoints'

const fonts = {
  titleBar: css({
    fontSize: '1.6rem',
    color: '#FFFFFF',
    [breakpoints.tablet]: {
      fontSize: '1.9rem',
    }
  }),
  body: css({
    fontSize: '1.6rem',
    [breakpoints.tablet]: {
      fontSize: '1.9rem',
    }
  }),
  title: css({
    fontSize: '1.8rem',
    [breakpoints.tablet]: {
      fontSize: '2.2rem',
    }
  }),
  subtitle: css({
    fontSize: '1.8rem',
    [breakpoints.tablet]: {
      fontSize: '2rem',
    }
  }),
  orderNumber: css({
    fontSize: '2.2rem',
    [breakpoints.tablet]: {
      fontSize: '3.2rem',
    }
  })
}

export default fonts