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
    $security = security();
    echo $security;
});

$app->run();