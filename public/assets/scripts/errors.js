$(document).ready(function () {
    // Parameter analysis in the URL to show the error reason
    let parameters = location.search.substring(1).split('&');
    if (parameters.length) {
        parameters.forEach(parameter => {
            let temp = parameter.split('=');
            if (temp[0] == 'reason') {
                let errorMessage = decodeURIComponent(temp[1]).replace(/\s/g, ' ');
                errorMessage = errorMessage.substring(1);
                errorMessage = errorMessage.substring(0, errorMessage.length - 1);
                if (console && console.error) console.error(errorMessage);
                $('#server-error-message').text(errorMessage);
            } else {
                window.location.href = hostPath;
            }
        });
    }
});