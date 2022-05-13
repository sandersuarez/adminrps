/**
 * Function that handles the search active orders event by customer name or phone number by the search orders layer
 * @param {Event} event 
 */
function searchActiveOrdersHandler(event) {
    event.preventDefault();
    orders.obtainActiveOrders();
}