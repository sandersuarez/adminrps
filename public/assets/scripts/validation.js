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
                    if (decodeURI(temp[1]) == '"tiempo_exp"') {
                        showServerMessage('Su tiempo de sesión ha expirado. Por favor, loguéese de nuevo.');
                    } else if (decodeURI(temp[1]) == '"no_regis"') {
                        showServerMessage('Usted no se encuentra actualmente registrado en el sistema. Por favor, regístrese o loguéese de nuevo.');
                    }

                    // Clear the header
                    window.history.replaceState({}, null, 'login/');
                }
            });
        }
    }
}