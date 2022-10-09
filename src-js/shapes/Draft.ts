// noinspection SpellCheckingInspection
export type DraftContent = {
  namecustomertmp?: string,
  telcustomertmp?: string,
  pickuptime?: string,
  codcustomer?: number,
  products?: { codproduct: number, amountproduct: number, }[],
}

// noinspection SpellCheckingInspection
type Draft = {
  coddraft: number,
  namecustomer?: string,
  telcustomer?: string,
}

export default Draft