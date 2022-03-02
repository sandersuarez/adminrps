<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src/crud/customers_crud.php';

$app->get('/obtain_customers', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            $params = $request->getQueryParams();

            // Check for parameters
            if (array_key_exists('telname', $params)) {
                $requirements['telname'] = $params['telname'];
            } else {
                $requirements['telname'] = '';
            }

            if (array_key_exists('page', $params)) {
                $requirements['page'] = $params['page'];
            } else {
                $requirements['page'] = 1;
            }

            if (array_key_exists('customers_number', $params)) {
                $requirements['customers_number'] = $params['customers_number'];
            } else {
                $requirements['customers_number'] = 15;
            }

            $response_content = json_encode(obtain_customers($requirements), JSON_UNESCAPED_UNICODE);
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->get('/obtain_customer', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            $params = $request->getQueryParams();

            // Check for required parameters
            if (array_key_exists('codcustomer', $params)) {
                $response_content = json_encode(obtain_customer($params['codcustomer']), JSON_UNESCAPED_UNICODE);
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

$app->post('/add_customer', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('namecustomer', $params) && array_key_exists('telcustomer', $params)) {

                $input_data['namecustomer'] = $params['namecustomer'];
                $input_data['telcustomer'] = $params['telcustomer'];

                $response_content = json_encode(add_customer($input_data), JSON_UNESCAPED_UNICODE);
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

$app->put('/edit_customer', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codcustomer', $params)) {
                if (array_key_exists('namecustomer', $params) || array_key_exists('telcustomer', $params)) {

                    $input_data['codcustomer'] = $params['codcustomer'];
                    if (array_key_exists('namecustomer', $params)) $input_data['namecustomer'] = $params['namecustomer'];
                    if (array_key_exists('telcustomer', $params)) $input_data['telcustomer'] = $params['telcustomer'];

                    $response_content = json_encode(edit_customer($input_data), JSON_UNESCAPED_UNICODE);
                } else {
                    // Parameters error notification
                    $response_content = json_encode(array('message' => 'There is nothing to edit'), JSON_UNESCAPED_UNICODE);
                }
            } else {
                $response_content = json_encode(array('message' => 'The customer code is required'), JSON_UNESCAPED_UNICODE);
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

$app->delete('/delete_customer', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codcustomer', $params)) {
                $response_content = json_encode(delete_customer($params['codcustomer']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message' => 'The customer code is required'), JSON_UNESCAPED_UNICODE);
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
