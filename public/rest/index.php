<?php
// Session
session_name('adminrps_session001');
session_start();

use Slim\Factory\AppFactory;

require __DIR__ . '/../../vendor/autoload.php';
require __DIR__ . '/../../config/db_connection_config.php';

$app = AppFactory::create();

// Parsing middleware
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// Application path
$app->setBasePath('/rest');

// Utilities
require __DIR__ . '/../../src-php/utilities/validate_order_product_list.php';
require __DIR__ . '/../../src-php/utilities/validate_mysql_datetime.php';

// Routes
require __DIR__ . '/../../src-php/routes/session.php';
require __DIR__ . '/../../src-php/routes/users.php';
require __DIR__ . '/../../src-php/routes/products.php';
require __DIR__ . '/../../src-php/routes/customers.php';
require __DIR__ . '/../../src-php/routes/drafts.php';
require __DIR__ . '/../../src-php/routes/orders.php';
require __DIR__ . '/../../src-php/routes/data_pdf.php';

$app->run();
