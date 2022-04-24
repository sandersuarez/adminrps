// Every time the site is loaded, the session is checked
ajaxSession.checkSession();

$(document).ready(function () {
    Validation.checkforReason();
});

/**
 * Function that checks the directories where the user is located and redirects if necessary
 * @param data
 */ 
function checkDirectories(data) {
    if (data) {
        let temp = window.location.pathname.split('/');
        let directory = temp[temp.length - 2];
        if (directory == '') {
            if (data.no_logged) {
                window.location.href = 'http://localhost/login/';
            }
        } else if (directory == 'login') {
            if (data.user) {
                window.location.href = '';
            }
        }
    }
}