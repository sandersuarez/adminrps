import breakpoints from './breakpoints'

const fonts = {
  titleBar: {
    fontSize: '1.6rem',
    color: '#FFFFFF',
    [breakpoints.tablet]: {
      fontSize: '1.9rem',
    }
  },
  body: {
    fontSize: '1.6rem',
    [breakpoints.tablet]: {
      fontSize: '1.9rem',
    }
  },
  title: {
    fontSize: '1.8rem',
    [breakpoints.tablet]: {
      fontSize: '2.2rem',
    }
  },
  subtitle: {
    fontSize: '1.8rem',
    [breakpoints.tablet]: {
      fontSize: '2rem',
    }
  },
  orderNumber: {
    fontSize: '2.2rem',
    [breakpoints.tablet]: {
      fontSize: '3.2rem',
    }
  }
}

export default fonts