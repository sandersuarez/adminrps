/**
 * Function that shows a message from the server
 * @param {String} id 
 * @param {String} message 
 */
function showServerMessage(id, message) {
    let container = $(id);

    // If the container exists it is shown and updated
    if (container.length) {
        container.empty();
        container.append($('<p></p>').text(message));
        container.show();
    }
}

/**
 * Function that shows a message with errors
 * @param {String} id 
 * @param {Array} errorMessages 
 */
function showErrors(id, errorMessages) {
    let container = $(id);

    // If the container exists it is shown and its content is updated
    if (container.length) {
        container.empty();

        errorMessages.forEach(errorMessage => {
            let error = $('<li></li>').text(errorMessage);
            container.append(error);
        });

        container.show();
    }
}

/**
 * Function that shows the active orders on its container
 * @param {Object} orders 
 */
function showActiveOrders(orders) {
    let mainContainer = $('#main-active-orders-container');
    let secondaryContainer = $('#secondary-active-orders-container');
    let auxContainer = $('#aux-active-orders-container');

    // If the container exists its content is updated
    if (mainContainer.length && secondaryContainer.length && auxContainer.length) {
        mainContainer.empty();
        secondaryContainer.empty();
        auxContainer.empty();

        orders.forEach((order, index) => {
            let orderLayer = $('<div></div>').addClass('order').attr({ 'id': 'order-' + order['codorder'] });
            let number = $('<h3></h3>').text('Nº ' + order['numdayorder']);
            let pickUpTime = $('<p></p>').text(order['pickuptime'].substring(order['pickuptime'].length - 3, 0)).addClass('pick-up-time');
            let name = $('<p></p>').text(order['namecustomer']);
            let phone = $('<p></p>').text(order['telcustomer']);

            orderLayer.append(number, pickUpTime, name, phone);

            if (window.matchMedia('(min-width: 800px)').matches) {
                let ordersInAuxNumber = 4;

                if (window.matchMedia('(min-width: 1400px)').matches) {
                    let auxContainerHeight = auxContainer.outerHeight();

                    if (window.matchMedia('(min-width: 1600px)').matches) {
                        ordersInAuxNumber += Math.floor(auxContainerHeight / 146) * 2;
                    } else {
                        ordersInAuxNumber += Math.floor(auxContainerHeight / 146);
                    }
                }

                let pagingInput = $('#active-orders-paging').find('div > input').first();
                if (index < 4 && pagingInput.val() == pagingInput.attr('min')) {
                    appendProductsTable(order, orderLayer);
                    mainContainer.append(orderLayer);
                } else if (index < ordersInAuxNumber && pagingInput.val() == pagingInput.attr('min')) {
                    auxContainer.append(orderLayer);
                } else {
                    secondaryContainer.append(orderLayer);
                }
            } else {
                secondaryContainer.append(orderLayer);
            }
        });
    }
}

/**
 * Function that appends a product table resume to an order layer
 * @param {Object} order 
 * @param {Object} orderLayer 
 */
function appendProductsTable(order, orderLayer) {
    let productsTable = $('<div></div>').addClass('product-table');

    let titleAmount = $('<div></div>').addClass('product-table-title').append($('<p></p>').text('Cantidad'));
    let priceAmount = $('<div></div>').addClass('product-table-title').append($('<p></p>').text('Precio'));
    let titleRow = $('<div></div>').append($('<div></div>'), titleAmount, priceAmount);
    productsTable.append(titleRow);

    let totalPrice = 0;
    order['products'].forEach(product => {
        let nameProduct = $('<div></div>').append($('<p></p>').text(product['nameproduct']), $('<p></p>').text(' (' + product['priceproduct'].replace('.', ',') + ' €)'));
        let amountProduct = $('<div></div>').append($('<p></p>').text(product['amountproductorder']));
        let priceProduct = $('<div></div>').append($('<p></p>').text((parseInt(product['amountproductorder']) * parseFloat(product['priceproduct'])).toString().replace('.', ',') + ' €'));
        let productRow = $('<div></div>').append(nameProduct, amountProduct, priceProduct);
        productsTable.append(productRow);

        totalPrice += parseInt(product['amountproductorder']) * parseFloat(product['priceproduct']);
    });

    let totalLayer = $('<div></div>').addClass('product-table-resume').append($('<p></p>').text('Total'));
    let totalPriceLayer = $('<div></div>').addClass('product-table-resume').append($('<p></p>').text(totalPrice.toString().replace('.', ',') + ' €'));
    let resumeRow = $('<div></div>').append($('<div></div>'), totalLayer, totalPriceLayer);
    productsTable.append(resumeRow);

    orderLayer.append(productsTable);
}

/**
 * Function that updates the available page number in pagination
 * @param {String} id
 * @param {Number} ordersNumber 
 * @param {Number} ordersPerPage 
 */
function updatePageNumber(id, ordersNumber, ordersPerPage) {

    let pagesAvailable = Math.ceil(ordersNumber / ordersPerPage);

    // If the number of pages is more than 1, the paging layer is shown
    if (pagesAvailable > 1) {
        $(id).attr('style', 'display: flex');
    } else {
        $(id).hide();
    }
    
    let pageInput = $(id).find('div > input').first();
    pageInput.attr('max', pagesAvailable);
    let curPage = pageInput.val();
    $(id).children('p').first().empty().text('Página ' + curPage + ' de ' + pagesAvailable);
}