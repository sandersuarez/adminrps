/**
 * Class that makes Ajax calls to consume the API rest services related to sessions
 */
class AjaxSession {

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
        $.ajax(
            {
                url: this.url + 'session_status',
                type: 'GET',
                dataType: 'json'
            }
        ).done(function (data) {
            if (data.user) {
                // The session is active
                checkDirectories(data);
            } else if (data.error) {
                // If there has been an error in the process the user is notified
                window.location.href = 'http://localhost/not_err.html?reason="' + data.error + '"';
            } else if (data.no_logged) {
                // There is no active session
                checkDirectories(data);
            } else {
                /* If the session has expired the user is redirected to the login page
                with a message */
                let reason = '';
                if (data.time) {
                    reason = '?reason="time_exp"';
                } else {
                    reason = '?reason="no_regis"';
                }
                self.closeSession('login/index.html' + reason);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // If there has been an error in the process the user is notified
            window.location.href = 'http://localhost/not_err.html?reason="' + textStatus + '"';
        });
    }

    /**
     * Method that closes the user session and redirects him
     * @param {string} url 
     */
    closeSession(url) {
        $.getJSON(this.url + 'logout').done(function (data) {
            window.location.href = url;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // If there has been an error in the process the user is notified
            window.location.href = 'http://localhost/not_err.html?razon="' + textStatus + '"';
        });
    }

    /**
     * Method that closes the user session
     */
    closeSessionQuietly() {
        $.getJSON(this.url + 'logout').done(function (data) { }).fail(function (jqXHR, textStatus, errorThrown) {
            // If there has been an error in the process the user is notified
            window.location.href = 'http://localhost/not_err.html?razon="' + textStatus + '"';
        });
    }
}

var ajaxSession = new AjaxSession(dir);