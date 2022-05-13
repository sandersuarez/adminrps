/**
 * Class that validates forms and other requests
 */
class Validation {

    /**
     * Static method that checks the reason for a redirection by the HTTP header
     */
    static checkforReason() {
        let parameters = location.search.substring(1).split('&');
        if (parameters.length) {
            parameters.forEach(parameter => {
                let temp = parameter.split('=');
                if (temp[0] == 'reason') {
                    if (decodeURI(temp[1]) == '"time_exp"') {
                        showServerMessage('#login-server-error-layer', 'Su tiempo de sesión ha expirado. Por favor, inicie sesión de nuevo.');
                    } else if (decodeURI(temp[1]) == '"no_regis"') {
                        showServerMessage('#login-server-error-layer', 'Usted no se encuentra actualmente registrado en el sistema. Por favor, regístrese o inicie sesión de nuevo.');
                    }

                    // Clear the header
                    history.replaceState({}, null, '/login/');
                }
            });
        }
    }

    /**
     * Static method that validates a login attempt
     * @returns {mixed}
     */
    static validateLogin() {

        // Input location
        let userInput = $('#login-username');
        let passwordInput = $('#login-password');

        // Every time the validation is done the error container is emptied
        let errorContainer = $('#login-error-list');
        if (errorContainer.length) errorContainer.empty().attr({ style: '' });

        // If the inputs exist the execution continues
        if (userInput.length && passwordInput.length) {

            // Data recovery
            let user = userInput.val();
            let password = passwordInput.val();

            // Space clean
            user = user.trim();

            let errors = [];

            // Check that the fields are not empty
            if (user == '') errors.push('El nombre de usuario es un campo requerido');
            if (password == '') errors.push('La contraseña es un campo requerido');

            // If there are errors, they are notified. If there are no errors, the data is returned 
            if (errors.length > 0) {
                showErrors('#login-error-list', errors);
            } else {
                return { 'username': user, 'key': password };
            }
        } else {
            return null;
        }
    }

    /**
     * Static method that validates a page number
     * @param {String} id 
     * @returns {Boolean}
     */
    static validatePage(id) {
        let input = $(id).find('div > input').first();
        let curVal = input.val();

        if (curVal < input.attr('min')) {
            input.val(input.attr('min'));
            orders.obtainActiveOrders();
            return false;
        }

        if (curVal > input.attr('max')) {
            input.val(input.attr('max'));
            orders.obtainActiveOrders();
            return false;
        }

        return true;
    }
}