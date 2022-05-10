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
        fetch(this.url + 'obtain_active_orders?today=1&page=1&orders_number=30')
            .then(function (response) {
                if (!response.ok) throw new Error('Error: ' + response.statusText + '. Status code: ' + response.status);
                return response.json();
            })
            .then(function (response) {
                // If there has been an error in the process or the access is forbidden the user is notified
                if (response.error) window.location.href = hostPath + 'not_err.html?reason="' + response.error + '"';
                if (response.forbidden) window.location.href = hostPath + 'not_err.html?reason="' + response.forbidden + '"';

                // If the session has expired the user is redirected to the login page with a message
                if (response.time) session.closeSession(hostPath + 'login/index.html?reason="time_exp"');

                // If the user is not logged the session is checked
                if (response.no_logged) session.checkSession();

                // If there is an error message it is shown on the container
                if (response.message) showServerMessage('#active-orders-error-layer', response.message);

                // If there is a list of orders they are shown
                if (response.orders) showActiveOrders(response.orders);
            })
            .catch(function (error) {
                // If there has been an error in the process the user is notified
                if (console && console.error) console.error(error.message);
                window.location.href = hostPath + 'not_err.html?reason="' + error.message + '"';
            });
    }
}

const orders = new Orders(serverPath);