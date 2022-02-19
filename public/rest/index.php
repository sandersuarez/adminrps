<?php
// Session
session_name('adminrps_session001');
session_start();

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../../config/settings.php';
require __DIR__ . '/../../src/sessions/login.php';
require __DIR__ . '/../../src/crud/products_crud.php';

$app = AppFactory::create();

// Application path
$app->setBasePath('/rest');

$app->post('/login', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (!is_array($security)) {

        // Check for required parameters
        $params = $request->getQueryParams();

        if ($params['username'] && $params['key']) {
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

$app->get('/obtain_products', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {

            $params = $request->getQueryParams();

            // Check for parameters
            if ($params['name']) {
                $requirements['name'] = $params['name'];
            } else {
                $requirements['name'] = '';
            }

            if ($params['page']) {
                $requirements['page'] = $params['page'];
            } else {
                $requirements['page'] = 1;
            }

            if ($params['products_number']) {
                $requirements['products_number'] = $params['products_number'];
            } else {
                $requirements['products_number'] = 15;
            }

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
            if ($params['codproduct']) {
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

            if ($params['nameproduct'] && $params['priceproduct']) {

                $input_data['nameproduct'] = $params['nameproduct'];
                $input_data['priceproduct'] = $params['priceproduct'];
                if ($params['stockproduct']) $input_data['stockproduct'] = $params['stockproduct'];

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

$app->run();
