<?php

/**
 * Function to create a PDO object using the application constant variables with the default configuration
 **/
function create_pdo_object()
{
    $connection = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, DB_USER, DB_KEY);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $connection;
}
