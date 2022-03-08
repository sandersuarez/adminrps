<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src/crud/drafts_crud.php';
require __DIR__ . '/../../src/utilities/validate_order_product_list.php';

$app->get('/obtain_drafts', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {
            $response_content = json_encode(obtain_drafts(), JSON_UNESCAPED_UNICODE);
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->post('/add_draft', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (!((array_key_exists('namecustomertmp', $params) || array_key_exists('telcustomertmp', $params)) && array_key_exists('codcustomer', $params))) {

                $input_data = [];
                if (array_key_exists('namecustomertmp', $params)) $input_data['namecustomertmp'] = $params['namecustomertmp'];
                if (array_key_exists('telcustomertmp', $params)) $input_data['telcustomertmp'] = $params['telcustomertmp'];
                if (array_key_exists('codcustomer', $params)) $input_data['codcustomer'] = $params['codcustomer'];
                if (array_key_exists('products', $params)) $input_data['products'] = json_decode($params['products'], true);

                $response_content = json_encode(add_draft($input_data), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message', 'The customer code and the customer data cannot be inserted at the same time'), JSON_UNESCAPED_UNICODE);
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
