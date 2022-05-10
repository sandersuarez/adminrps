/**
 * Function that shows a message from the server
 * @param {string} id 
 * @param {string} message 
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
 * @param {string} id 
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

                if (index < 4) {
                    appendProductsTable(order, orderLayer);
                    mainContainer.append(orderLayer);
                } else if (index < ordersInAuxNumber) {
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