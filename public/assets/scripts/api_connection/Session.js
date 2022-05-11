/**
 * Class that makes fetch calls to consume the API rest services related to sessions
 */
class Session {

    /**
     * @param {string} url 
     */
    constructor(url) {
        this.url = url;
    }

    /**
     * Method to check the state of the user session
     */
    checkSession() {
        let self = this;

        fetch(this.url + 'session_status')
            .then(function (response) {
                if (!response.ok) throw new Error('Error: ' + response.statusText + '. Status code: ' + response.status);
                return response.json();
            })
            .then(function (response) {
                // If session is active or inactive the directory is checked
                if (response.user || response.no_logged) {
                    checkPath(response);

                    // If the label to show the user name exists, the user name is shown
                    let nameUserSlot = $('#name-user-slot');
                    if (nameUserSlot.length) {
                        nameUserSlot.empty();
                        nameUserSlot.text(response.user['nameuser']);
                    }
                }

                // If there has been an error in the process the user is notified
                if (response.error) window.location.href = hostPath + 'not_err.html?reason="' + response.error + '"';

                // If the session has expired the user is redirected to the login page with a message
                if (response.time || response.forbidden) {
                    let reason = '';
                    if (response.time) reason = '?reason="time_exp"';
                    if (response.forbidden) reason = '?reason="no_regis"';
                    self.closeSession(hostPath + 'login/index.html' + reason);
                }
            })
            .catch(function (error) {
                // If there has been an error in the process the user is notified
                if (console && console.error) console.error(error.message);
                window.location.href = hostPath + 'not_err.html?reason="' + error.message + '"';
            });
    }

    /**
     * Method that closes the user session and redirects him
     * @param {string} url 
     */
    closeSession(url = null) {
        fetch(this.url + 'logout')
            .then(function (response) {
                if (!response.ok) throw new Error('Error: ' + response.statusText + '. Status code: ' + response.status);
                if (url != null) window.location.href = url;
            })
            .catch(function (error) {
                // If there has been an error in the process the user is notified
                if (console && console.error) console.error(error.message);
                window.location.href = hostPath + 'not_err.html?reason="' + error.message + '"';
            });
    }

    /**
     * Method to check the state of the user session
     * @param {Object} parameters
     */
    userLogin(parameters) {

        let request = new Request(this.url + 'login', {
            method: 'POST',
            body: JSON.stringify(parameters),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
            .then(function (response) {
                if (!response.ok) throw new Error('Error: ' + response.statusText + '. Status code: ' + response.status);
                return response.json();
            })
            .then(function (response) {
                if (response.message) showErrors('#login-error-list', [response.message]); // If there is an error message, the user is notified
                if (response.user) window.location.href = hostPath; // If the user is logged, he is redirected to the home page

                // If the server returns an error, the user is notified
                if (response.error) {
                    if (console && console.error) console.error('Error: ' + response.error);
                    showServerMessage('#login-server-error-layer', 'Error: ' + response.error);
                }

                // If the login button exists and is disabled, it is set to enabled again
                let loginButton = $('#login-submit-button');
                if (loginButton.length && loginButton.attr('disabled') == 'disabled')
                    loginButton.attr('disabled', false);
            })
            .catch(function (error) {
                // If there has been an error in the process the user is notified
                if (console && console.error) console.error(error.message);
                window.location.href = hostPath + 'not_err.html?reason="' + error.message + '"';
            });
    }
}

const session = new Session(serverPath);