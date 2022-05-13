/**
 * Class that makes fetch calls to consume the API rest services related to orders
 */
class Orders {

    /**
     * @param {string} url 
     */
    constructor(url) {
        this.url = url;
    }

    /**
     * Method that obtains the active orders of the user
     */
    obtainActiveOrders() {

        // Data gathering
        let ordersNumber = 15;
        if (window.matchMedia('(min-width: 800px)').matches) ordersNumber = 30;

        let pageLayer = $('#active-orders-paging > div > input').first();
        let page = 1;
        if (pageLayer.length) page = pageLayer.val();

        let searcherLayer = $('#active-orders-searcher-layer > input').first();
        let telname = '';
        if (searcherLayer.length) telname = searcherLayer.val().trim();

        const fetchReqOrders = fetch(this.url + 'obtain_active_orders?today=1&page=' + page + '&orders_number=' + ordersNumber + '&telnamecustomer=' + telname)
            .then(function (response) {
                if (!response.ok) throw new Error('Error: ' + response.statusText + '. Status code: ' + response.status);
                return response.json();
            });

        const fetchReqNumOrders = fetch(this.url + 'obtain_active_orders_number?today=1' + '&telnamecustomer=' + telname)
            .then(function (response) {
                if (!response.ok) throw new Error('Error: ' + response.statusText + '. Status code: ' + response.status);
                return response.json();
            });

        Promise.all([fetchReqOrders, fetchReqNumOrders])
            .then(function (response) {
                // If there has been an error in the process or the access is forbidden the user is notified
                if (response[0].error) window.location.href = hostPath + 'not_err.html?reason="' + response[0].error + '"';
                if (response[0].forbidden) window.location.href = hostPath + 'not_err.html?reason="' + response[0].forbidden + '"';
                if (response[1].error) window.location.href = hostPath + 'not_err.html?reason="' + response[1].error + '"';
                if (response[1].forbidden) window.location.href = hostPath + 'not_err.html?reason="' + response[1].forbidden + '"';

                // If the session has expired the user is redirected to the login page with a message
                if (response[0].time || response[1].time) session.closeSession(hostPath + 'login/index.html?reason="time_exp"');

                // If the user is not logged the session is checked
                if (response[0].no_logged || response[1].no_logged) session.checkSession();

                let pagVal = 1;
                if (response[1].num_orders) {

                    // The page number is validated to check if it is correct
                    updatePageNumber('#active-orders-paging', response[1].num_orders, ordersNumber);
                    pagVal = Validation.validatePage('#active-orders-paging');

                    // If there is a list of orders they are shown
                    if (response[0].orders) {
                        showActiveOrders(response[0].orders);
                        if (response[0].orders.length > 1) $('#active-orders-searcher-layer').attr('style', 'display: flex');

                        let ordersErrorLayer = $('#active-orders-error-layer');
                        if (ordersErrorLayer.length && !ordersErrorLayer.is(":hidden")) ordersErrorLayer.hide();
                    }
                }

                // If there is an error message it is shown on the container
                if (response[0].message && pagVal) {

                    let mainContainer = $('#main-active-orders-container');
                    if (mainContainer.length) mainContainer.empty();
                    let secondaryContainer = $('#secondary-active-orders-container');
                    if (secondaryContainer.length) secondaryContainer.empty();
                    let auxContainer = $('#aux-active-orders-container');
                    if (auxContainer.length) auxContainer.empty();

                    showServerMessage('#active-orders-error-layer', response[0].message);
                    $('#active-orders-paging').hide();
                    if (telname == '') $('#active-orders-searcher-layer').hide();
                }

            }).catch(function (error) {
                // If there has been an error in the process the user is notified
                if (console && console.error) console.error(error.message);
                window.location.href = hostPath + 'not_err.html?reason="' + error.message + '"';
            });
    }
}

const orders = new Orders(serverPath);