import ProductShape, { ProductReqData } from './ProductShape'

// noinspection SpellCheckingInspection
export type DraftReqData = {
  namecustomertmp?: string | null,
  telcustomertmp?: string | null,
  pickuptime?: string | null,
  codcustomer?: number,
  products?: ProductReqData[],
}

// noinspection SpellCheckingInspection
type DraftShape = {
  coddraft: number,
  namecustomer: string | null,
  telcustomer: string | null,
  namecustomertmp: string | null,
  telcustomertmp: string | null,
  pickuptime: string | null,
  codcustomer: number | null,
  products?: (ProductShape & { amountproductdraft: number })[],
}

export default DraftShape