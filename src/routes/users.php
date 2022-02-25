<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src/crud/users_crud.php';

$app->get('/obtain_fec_last_key', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {
            $response_content = json_encode(obtain_date_last_key(), JSON_UNESCAPED_UNICODE);
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});

$app->put('/edit_user_iva', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('iva', $params)) {
                $response_content = json_encode(edit_user_iva($params['iva'], $security['user']['ivaprefuser']), JSON_UNESCAPED_UNICODE);
            } else {
                $response_content = json_encode(array('message' => 'The new iva is required'), JSON_UNESCAPED_UNICODE);
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

$app->put('/update_password', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('old_password', $params) && array_key_exists('password', $params) && array_key_exists('repeat_password', $params)) {
                $input_data['old_password'] = $params['old_password'];
                $input_data['password'] = $params['password'];
                $input_data['repeat_password'] = $params['repeat_password'];
                $response_content = json_encode(update_password($input_data), JSON_UNESCAPED_UNICODE);
            } else {
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
