/**
 * Function that shows a message from the server
 * @param {string} id 
 * @param {string} message 
 */
function showServerMessage(id, message) {
    console.log(message);
    let container = $(id);

    // If the container exists it is shown and updated
    if (container.length) {
        container.empty();
        container.append($('<p></p>').text(message));
        container.show();
    }
}

/**
 * Function that shows a message with errors
 * @param {string} id 
 * @param {Array} errorMessages 
 */
function showErrors(id, errorMessages) {
    let container = $(id);

    // If the container exists it is shown and its content is updated
    if (container.length) {
        container.empty();

        errorMessages.forEach(errorMessage => {
            let error = $('<li></li>').text(errorMessage);
            container.append(error);
        });

        container.show();
    }
}