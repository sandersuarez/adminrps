/**
 * Function that handles the change of the page number directly by the user
 * @param {Event} event 
 */
function changePageHandler(event) {
    event.preventDefault();

    if (event.target.nodeName == 'FORM') {
        let input = event.currentTarget.querySelector('div > input');
        let curVal = input.value;
        if (curVal < input.min) input.value = input.min;
        if (curVal > input.max) input.value = input.max;
    } else {
        let curVal = event.target.value;
        if (curVal < event.target.min) event.target.value = event.target.min;
        if (curVal > event.target.max) event.target.value = event.target.max;
    }

    orders.obtainActiveOrders();
}

/**
 * Function that handles the first page button in the pagination layer
 * @param {Event} event 
 */
function firstPageHandler(event) {
    event.preventDefault();
    let input = $(event.currentTarget).siblings('input').first();
    input.val(input.attr('min'));
    orders.obtainActiveOrders();
}

/**
 * Function that handles the previous page button in the pagination layer
 * @param {Event} event 
 */
function previousPageHandler(event) {
    event.preventDefault();
    let input = $(event.currentTarget).siblings('input').first();
    if (input.val() > input.attr('min')) {
        let newVal = parseInt(input.val()) - 1;
        input.val(newVal);
        orders.obtainActiveOrders();
    }
}

/**
 * Function that handles the next page button in the pagination layer
 * @param {Event} event 
 */
function nextPageHandler(event) {
    event.preventDefault();
    let input = $(event.currentTarget).siblings('input').first();
    if (input.val() < input.attr('max')) {
        let newVal = parseInt(input.val()) + 1;
        input.val(newVal);
        orders.obtainActiveOrders();
    }
}

/**
 * Function that handles the last page button in the pagination layer
 * @param {Event} event 
 */
function lastPageHandler(event) {
    event.preventDefault();
    let input = $(event.currentTarget).siblings('input').first();
    input.val(input.attr('max'));
    orders.obtainActiveOrders();
}