import ProductShape, { DraftProductReqData } from './ProductShape'

// noinspection SpellCheckingInspection
export type DraftContent = {
  namecustomertmp: string | null,
  telcustomertmp: string | null,
  pickuptime: string | null,
  codcustomer: number | null,
  products?: (ProductShape & { amountproductdraft: number })[],
}

// noinspection SpellCheckingInspection
export type DraftReqData = {
  namecustomertmp?: string | null,
  telcustomertmp?: string | null,
  pickuptime?: string | null,
  codcustomer?: number,
  products?: DraftProductReqData[],
}

// noinspection SpellCheckingInspection
type DraftShape = {
  coddraft: number,
  namecustomer: string | null,
  telcustomer: string | null,
}

export default DraftShape