<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src/crud/products_crud.php';

$app->get('/obtain_products', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            $params = $request->getQueryParams();

            // Check for parameters
            if (array_key_exists('name', $params)) {
                $requirements['name'] = $params['name'];
            } else {
                $requirements['name'] = '';
            }

            if (array_key_exists('page', $params)) {
                $requirements['page'] = $params['page'];
            } else {
                $requirements['page'] = 1;
            }

            if (array_key_exists('products_number', $params)) {
                $requirements['products_number'] = $params['products_number'];
            } else {
                $requirements['products_number'] = 15;
            }

            $requirements['deleted'] = 0;

            $response_content = json_encode(obtain_products($requirements), JSON_UNESCAPED_UNICODE);
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->get('/obtain_deleted_products', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            $params = $request->getQueryParams();

            if (array_key_exists('name', $params)) {
                $requirements['name'] = $params['name'];
            } else {
                $requirements['name'] = '';
            }

            if (array_key_exists('page', $params)) {
                $requirements['page'] = $params['page'];
            } else {
                $requirements['page'] = 1;
            }

            if (array_key_exists('products_number', $params)) {
                $requirements['products_number'] = $params['products_number'];
            } else {
                $requirements['products_number'] = 15;
            }

            $requirements['deleted'] = 1;

            $response_content = json_encode(obtain_products($requirements), JSON_UNESCAPED_UNICODE);
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->get('/obtain_product', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            $params = $request->getQueryParams();

            // Check for required parameters
            if (array_key_exists('codproduct', $params)) {
                $response_content = json_encode(obtain_product($params['codproduct']), JSON_UNESCAPED_UNICODE);
            } else {
                // Parameters required error notification
                $response_content = json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
            }
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->post('/add_product', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('nameproduct', $params) && array_key_exists('priceproduct', $params)) {

                $input_data['nameproduct'] = $params['nameproduct'];
                $input_data['priceproduct'] = $params['priceproduct'];
                if (array_key_exists('stockproduct', $params)) $input_data['stockproduct'] = $params['stockproduct'];

                $response_content = json_encode(add_product($input_data), JSON_UNESCAPED_UNICODE);
            } else {
                // Parameters required error notification
                $response_content = json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
            }
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->put('/edit_product', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codproduct', $params)) {
                if (array_key_exists('nameproduct', $params) || array_key_exists('priceproduct', $params) || array_key_exists('stockproduct', $params)) {

                    $input_data['codproduct'] = $params['codproduct'];
                    if (array_key_exists('nameproduct', $params)) $input_data['nameproduct'] = $params['nameproduct'];
                    if (array_key_exists('priceproduct', $params)) $input_data['priceproduct'] = $params['priceproduct'];
                    if (array_key_exists('stockproduct', $params)) $input_data['stockproduct'] = $params['stockproduct'];

                    $response_content = json_encode(edit_product($input_data), JSON_UNESCAPED_UNICODE);
                } else {
                    // Parameters error notification
                    $response_content = json_encode(array('message' => 'There is nothing to edit'), JSON_UNESCAPED_UNICODE);
                }
            } else {
                $response_content = json_encode(array('message' => 'The product code is required'), JSON_UNESCAPED_UNICODE);
            }
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->put('/send_product_to_trash', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codproduct', $params)) {
                $response_content = json_encode(send_product_to_trash($params['codproduct']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message' => 'The product code is required'), JSON_UNESCAPED_UNICODE);
            }
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->put('/restore_product', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codproduct', $params)) {
                $response_content = json_encode(restore_product($params['codproduct']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message' => 'The product code is required'), JSON_UNESCAPED_UNICODE);
            }
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->delete('/delete_product', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codproduct', $params)) {
                $response_content = json_encode(delete_product($params['codproduct']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message' => 'The product code is required'), JSON_UNESCAPED_UNICODE);
            }
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});
