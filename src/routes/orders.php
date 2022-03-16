<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src/crud/orders_crud.php';

$app->get('/obtain_active_orders', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('today', $params) && array_key_exists('page', $params)) {

                $requirements['today'] = $params['today'];
                $requirements['page'] = $params['page'];

                if (array_key_exists('orders_number', $params)) {
                    $requirements['orders_number'] = $params['orders_number'];
                } else {
                    $requirements['orders_number'] = 0;
                }

                $response_content = json_encode(obtain_active_orders($requirements), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message', 'Required field missing'), JSON_UNESCAPED_UNICODE);
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

$app->get('/obtain_active_order', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codorder', $params)) {
                $response_content = json_encode(obtain_active_order($params['codorder']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message', 'Required field missing'), JSON_UNESCAPED_UNICODE);
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

$app->post('/add_order', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('coddraft', $params)) {
                $response_content = json_encode(add_order($params['coddraft']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message', 'Required field missing'), JSON_UNESCAPED_UNICODE);
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

$app->put('/edit_order', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codorder', $params) && array_key_exists('products', $params)) {

                $input_data['codorder'] = $params['codorder'];
                $input_data['products'] = json_decode($params['products'], true);
                if (array_key_exists('codcustomer', $params)) $input_data['codcustomer'] = $params['codcustomer'];
                if (array_key_exists('namecustomer', $params)) $input_data['namecustomer'] = $params['namecustomer'];
                if (array_key_exists('telcustomer', $params)) $input_data['telcustomer'] = $params['telcustomer'];

                $response_content = json_encode(edit_order($input_data), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message', 'Required field missing'), JSON_UNESCAPED_UNICODE);
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

$app->delete('/delete_order', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codorder', $params)) {
                $response_content = json_encode(delete_order($params['codorder']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message', 'Required field missing'), JSON_UNESCAPED_UNICODE);
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

$app->post('/sell_order', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('codorder', $params) && array_key_exists('moneyreceived', $params)) {
                $response_content = json_encode(sell_order($params['codorder'], $params['moneyreceived']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message', 'Required field missing'), JSON_UNESCAPED_UNICODE);
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
