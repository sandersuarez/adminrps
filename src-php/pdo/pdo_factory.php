<?php

/**
 * Function to create a PDO object using the application constant variables with the default configuration
 * @return PDO
 */
function create_pdo_object(): PDO
{
  $connection = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
    DB_USER,
    DB_KEY);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $connection;
}

/**
 * Function to clear a query data and destroy a PDO object
 * @param bool|PDOStatement $query
 * @param PDO $connection
 * @return void
 */
function clear_query_data(bool|PDOStatement $query, PDO $connection): void
{
  $query->closeCursor();
  $connection = null;
}

/**
 * Function to proccess a PDO exception and return a message in JSON format
 * @param PDOException $e
 * @return array
 */
function process_pdo_exception(PDOException $e): array
{
  $error = 'Error: ' . $e->getMessage();
  return array('error' => "Error: $error");
}
