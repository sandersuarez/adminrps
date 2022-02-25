<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src/sessions/login.php';

$app->post('/login', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (!is_array($security)) {

        // Check for required parameters
        $params = $request->getQueryParams();

        if (array_key_exists('username', $params) && array_key_exists('key', $params)) {
            $input_data['username'] = $params['username'];
            $input_data['key'] = $params['key'];
            $response_content = json_encode(login($input_data), JSON_UNESCAPED_UNICODE);
        } else {
            // Parameters required error notification
            $response_content = json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(array('error' => 'There is already an open session'), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});
