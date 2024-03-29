// Every time the site is loaded, the session is checked
session.checkSession();

$(document).ready(function () {
    Validation.checkforReason();

    let temp = window.location.pathname.split('/');
    let directory = temp[temp.length - 2];

    // If the user is on the home page, the application searches the data
    if (directory == '') {
        orders.obtainActiveOrders();
    }
});

/**
 * Function that checks the path where the user is located and redirects if necessary
 * @param data
 */
function checkPath(data) {
    if (data) {
        let temp = window.location.pathname.split('/');
        let directory = temp[temp.length - 2];
        if (directory == 'login') {
            if (data.user) window.location.href = hostPath;
        } else {
            if (data.no_logged) window.location.href = hostPath + 'login/';
        }
    }
}