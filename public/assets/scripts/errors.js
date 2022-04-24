// Parameter analysis in the URL to show the error reason
let parameters = location.search.substring(1).split('&');
if (parameters.length) {
    parameters.forEach(parameter => {
        let temp = parameter.split('=');
        if (temp[0] == 'razon') {
            if (console && console.error) {
                console.error(temp[1]);
            }
            window.history.replaceState({}, null, 'http://localhost/not_err.html');
        }
    });
}