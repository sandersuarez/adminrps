/**
 * Function that tries to close the user session
 * @param {Event} event
 */
function closeSessionHandler(event) {
    event.preventDefault();
    ajaxSession.closeSession('http://localhost/login');
}