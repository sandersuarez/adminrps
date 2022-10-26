import ProductShape from './ProductShape'

// noinspection SpellCheckingInspection
export type DraftContent = {
  namecustomertmp: string | null,
  telcustomertmp: string | null,
  pickuptime: string | null,
  codcustomer: number | null,
  products?: ProductShape[],
}

// noinspection SpellCheckingInspection
export type DraftReqData = {
  namecustomertmp?: string,
  telcustomertmp?: string,
  pickuptime?: string,
  codcustomer?: number,
  products?: {
    codproduct: number,
    amountproduct: number,
  }[],
}

// noinspection SpellCheckingInspection
type DraftShape = {
  coddraft: number,
  namecustomer: string | null,
  telcustomer: string | null,
}

export default DraftShape