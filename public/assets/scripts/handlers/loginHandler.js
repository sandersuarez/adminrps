/**
 * Function that tries to send a login request succesfully
 * @param {Event} event 
 */
function loginHandler(event) {
    event.preventDefault();

    // if the error containers are displayed, they hide
    let container = $('#login-error-list');
    if (container.length && !container.is(':hidden')) container.attr({ style: '' });

    let parameters = Validation.validateLogin();

    if (parameters != null) {
        let loginButton = $('#login-submit-button');
        if (loginButton.length) loginButton.attr('disabled', true);
        session.userLogin(parameters);
    }
}