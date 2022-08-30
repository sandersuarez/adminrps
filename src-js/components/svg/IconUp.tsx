import * as React from 'react'
import { SVGProps } from 'react'

const SvgUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 11 7'
    xmlns='http://www.w3.org/2000/svg'
    { ...props }
  >
    <path
      d='M4.87876 0.621294L0.862505 4.63754C0.521255 4.97879 0.521255 5.53004 0.862505 5.87129C1.20375 6.21254 1.755 6.21254 2.09625 5.87129L5.50001 2.47629L8.895 5.87129C9.23625 6.21254 9.78751 6.21254 10.1288 5.87129C10.47 5.53004 10.47 4.97879 10.1288 4.63754L6.1125 0.621294C5.78 0.280044 5.22001 0.280044 4.87876 0.621294Z'
      color='#000'
      style={ {
        fontFeatureSettings: 'normal',
        fontVariantAlternates: 'normal',
        fontVariantCaps: 'normal',
        fontVariantEastAsian: 'normal',
        fontVariantLigatures: 'normal',
        fontVariantNumeric: 'normal',
        fontVariantPosition: 'normal',
        fontVariationSettings: 'normal',
        inlineSize: 0,
        isolation: 'auto',
        mixBlendMode: 'normal',
        shapeMargin: 0,
        textDecorationColor: '#000',
        textDecorationLine: 'none',
        textDecorationStyle: 'solid',
        textIndent: 0,
        textOrientation: 'mixed',
        textTransform: 'none',
        whiteSpace: 'normal',
      } }
    />
  </svg>
)

export default SvgUp
