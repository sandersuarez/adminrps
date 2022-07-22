import { CSSInterpolation } from '@emotion/serialize'

const fonts: { [k: string]: NonNullable<CSSInterpolation> } = {
  titleBar: {
    fontSize: '1.6rem',
    color: '#ffffff',
  },
  body: {
    fontSize: '1.6rem',
  },
  title: {
    fontSize: '1.8rem',
  },
  noteTitle: {
    fontSize: '1.8rem',
  },
  orderNumber: {
    fontSize: '2.2rem',
  },
  formMessage: {
    fontSize: '1.4rem',
  },
}

export default fonts
