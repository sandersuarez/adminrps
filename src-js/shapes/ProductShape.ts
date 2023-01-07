// noinspection SpellCheckingInspection
export type ProductReqData = {
  codproduct: number,
  amountproduct: number,
}

// noinspection SpellCheckingInspection
type ProductShape = {
  codproduct: number,
  nameproduct: string,
  priceproduct: string,
  stockproduct: number | null,
}

export default ProductShape