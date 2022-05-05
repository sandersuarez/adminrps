/**
 * Class that makes fetch calls to consume the API rest services related to orders
 */
 class Orders {

    /**
     * @param {string} url 
     */
    constructor(url) {
        this.url = url;
    }
}

const orders = new Orders(serverPath);