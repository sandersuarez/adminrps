/**
 * Function that tries to close the user session
 * @param {Event} event
 */
function closeSessionHandler(event) {
    event.preventDefault();
    session.closeSession('http://localhost/login');
}