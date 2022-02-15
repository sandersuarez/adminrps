<?php
// Session
session_name("adminrps_session001");
session_start();

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../../config/settings.php';
require __DIR__ . '/../../src/sessions/login.php';

$app = AppFactory::create();

// Application path
$app->setBasePath('/rest');

$app->post('/login', function (Request $request, Response $response, $args) {

    // Security check
    $security = security();
    if (!is_array($security)) {

        // Check for required parameters
        $params = $request->getQueryParams();

        if ($params['username'] && $params['key']) {
			$input_data["username"] = $params['username'];
			$input_data["key"] = $params['key'];
			echo json_encode(login($input_data), JSON_UNESCAPED_UNICODE);
		} else {
			// Parameters required error notification
			echo json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
		}
    } else {
        echo json_encode(array("error" => "There is already an open session"), JSON_UNESCAPED_UNICODE);
    }
});

$app->run();