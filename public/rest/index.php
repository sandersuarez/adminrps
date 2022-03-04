<?php
// Session
session_name('adminrps_session001');
session_start();

use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../../config/settings.php';

$app = AppFactory::create();

// Application path
$app->setBasePath('/rest');

require __DIR__ . '/../../src/routes/session.php';
require __DIR__ . '/../../src/routes/users.php';
require __DIR__ . '/../../src/routes/products.php';
require __DIR__ . '/../../src/routes/customers.php';
require __DIR__ . '/../../src/routes/orders.php';

$app->run();
