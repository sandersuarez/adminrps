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