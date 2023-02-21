import ProductShape from './ProductShape'

// noinspection SpellCheckingInspection
type OrderShape = {
  codorder: number,
  numdayorder: number,
  dateorder: string,
  hourorder: string,
  namecustomer: string,
  telcustomer: string,
  pickuptime: string,
  codcustomer: number,
  products: (ProductShape & { amountproductorder: number })[],
}

export default OrderShape