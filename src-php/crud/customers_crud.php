<?php

/**
 * Function to obtain customers added by a user that meet certain requirements and according to paging
 * @param array $requirements
 * @return array
 */
function obtain_customers(array $requirements): array
{
  // If the page number is invalid its value will be the default
  if (
    !filter_var(
      $requirements['page'],
      FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '99999999999999999']])
  ) {
    $requirements['page'] = 1;
  }

  // Pagination calculation
  $begin = $requirements['page'] - 1;

  $customers_number = match ($requirements['customers_number']) {
    30 => 30,
    default => 15,
  };

  $begin = $begin * $customers_number;

  try {
    $connection = create_pdo_object();

    // If there is a customer name to search, the clause is added
    $tel_name_clause = '';
    $requirements['telname'] = trim($requirements['telname']);
    if ($requirements['telname'] !== '') {
      $tel_name_clause = " AND ((namecustomer REGEXP :telnamecustomer) OR (telcustomer REGEXP :telnamecustomer))";
    }

    // SQL Query to search total number customers
    $query = $connection->prepare("SELECT count(codcustomer) FROM " . CUSTOMERS .
      " WHERE coduser = :coduser" . $tel_name_clause);

    // Parameters binding and execution
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    if ($requirements['telname'] != '') {
      $query->bindParam(':telnamecustomer', $requirements['telname'], PDO::PARAM_STR);
    }

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if ($result && $result['count(codcustomer)']) {

      // If the page is out of bounds, the page it is redirected to the last posible one
      if ($result['count(codcustomer)'] <= $begin) {
        // Pagination calculation
        $redirect_page = ceil($result['count(codcustomer)'] / $customers_number);
        $begin = $redirect_page - 1;
        $begin = $begin * $customers_number;
      }

      // The posible pages number
      $posible_pages = ceil($result['count(codcustomer)'] / $customers_number);

      // SQL Query to search customers in alphabetic order
      $query = $connection->prepare("SELECT codcustomer, namecustomer, telcustomer FROM " . CUSTOMERS .
        " WHERE coduser = :coduser" . $tel_name_clause . " ORDER BY namecustomer LIMIT :begin, :end");

      // Parameters binding and execution
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
      $query->bindParam(':begin', $begin, PDO::PARAM_INT);
      $query->bindParam(':end', $customers_number, PDO::PARAM_INT);

      if ($requirements['telname'] != '') {
        $query->bindParam(':telnamecustomer', $requirements['telname'], PDO::PARAM_STR);
      }

      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_ASSOC);
      if ($result) {
        $answer = array('customers' => $result);
        $query->closeCursor();

        for ($i = 0; sizeof($answer['customers']) > $i; $i++) {

          // SQL Query search a customer on orders and drafts
          $query = $connection->prepare("SELECT EXISTS (SELECT " . CUSTOMERS . ".codcustomer FROM " . CUSTOMERS .
            " JOIN " . ORDERS . " ON " . CUSTOMERS . ".codcustomer = " . ORDERS . ".codcustomer WHERE " . CUSTOMERS .
            ".codcustomer = :codcustomer AND " . CUSTOMERS . ".coduser = :coduser) OR EXISTS (SELECT " . CUSTOMERS .
            ".codcustomer FROM " . CUSTOMERS . " JOIN " . DRAFTS . " ON " . CUSTOMERS . ".codcustomer = " . DRAFTS .
            ".codcustomer WHERE " . CUSTOMERS . ".codcustomer = :codcustomer AND " . CUSTOMERS . ".coduser = :coduser)");

          // Parameters binding and execution
          $query->bindParam(':codcustomer', $answer['customers'][$i]['codcustomer'], PDO::PARAM_INT);
          $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

          $query->execute();
          if (array_values($query->fetch(PDO::FETCH_ASSOC))[0] == 1) {
            $answer['customers'][$i]['canbedeleted'] = 0;
          } else {
            $answer['customers'][$i]['canbedeleted'] = 1;
          }
          $answer['pages'] = $posible_pages;
        }
      } else {
        $answer = array('empty' => 'No hay clientes registrados');
      }
    } else {
      $answer = array('empty' => 'No hay clientes registrados');
    }

    clear_query_data($query, $connection);
    return $answer;
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to obtain the data of a customer added by a user
 * @param integer $codcustomer
 * @return array
 */
function obtain_customer(int $codcustomer): array
{
  // Requirements control
  if (
    !filter_var(
      $codcustomer,
      FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]
    )
  ) {
    return array('message' => 'The customer code is invalid');
  }

  try {
    // SQL Query to search the customer
    $connection = create_pdo_object();
    $query = $connection->prepare("SELECT codcustomer, namecustomer, telcustomer FROM " . CUSTOMERS .
      " WHERE coduser = :coduser AND codcustomer = :codcustomer");

    // Parameters binding and execution
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
    $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if ($result) {
      $answer = array('customer' => $result);

      // SQL Query search a customer on orders and drafts
      $query = $connection->prepare("SELECT EXISTS (SELECT " . CUSTOMERS . ".codcustomer FROM " . CUSTOMERS .
        " JOIN " . ORDERS . " ON " . CUSTOMERS . ".codcustomer = " . ORDERS . ".codcustomer WHERE " . CUSTOMERS .
        ".codcustomer = :codcustomer AND " . CUSTOMERS . ".coduser = :coduser) OR EXISTS (SELECT " . CUSTOMERS .
        ".codcustomer FROM " . CUSTOMERS . " JOIN " . DRAFTS . " ON " . CUSTOMERS . ".codcustomer = " . DRAFTS .
        ".codcustomer WHERE " . CUSTOMERS . ".codcustomer = :codcustomer AND " . CUSTOMERS . ".coduser = :coduser)");

      // Parameters binding and execution
      $query->bindParam(':codcustomer', $answer['customer']['codcustomer'], PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      if (array_values($query->fetch(PDO::FETCH_ASSOC))[0] == 1) {
        $answer['customer']['canbedeleted'] = 0;
      } else {
        $answer['customer']['canbedeleted'] = 1;
      }
    } else {
      $answer = array('message' => 'There is no coincident customer');
    }

    clear_query_data($query, $connection);
    return $answer;
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to add a new customer for a user
 * @param array $input_data
 * @return array
 */
function add_customer(array $input_data): array
{
  // Requirements control
  $input_data['namecustomer'] = trim($input_data['namecustomer']);
  if ($input_data['namecustomer'] === '') return array('message' => 'The customer name is required');
  if (strlen($input_data['namecustomer']) > 60) return array('message' => 'The customer name is invalid');

  if (!preg_match('#^[6-9](\d){8}$#', $input_data['telcustomer'])) {
    return array('message' => 'The phone number is invalid');
  }

  try {
    // SQL Query to search a new primary key
    $connection = create_pdo_object();
    $query = $connection->prepare("SELECT MAX(codcustomer) FROM " . CUSTOMERS);
    $query->execute();
    $codcustomer = $query->fetch()[0];
    $query->closeCursor();
    $codcustomer = $codcustomer + 1;

    if ($codcustomer > 9223372036854775808) {
      $connection = null;
      return array('overflow' => 'The customer list is full. Contact the administrator');
    }

    // SQL Query to insert a customer
    $query = $connection->prepare("INSERT INTO " . CUSTOMERS .
      " (codcustomer, namecustomer, telcustomer, coduser) VALUES " .
      "(:codcustomer, :namecustomer, :telcustomer, :coduser)");

    // Parameters binding and execution
    $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
    $query->bindParam(':namecustomer', $input_data['namecustomer']);
    $query->bindParam(':telcustomer', $input_data['telcustomer'], PDO::PARAM_STR_CHAR);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();

    clear_query_data($query, $connection);
    return array('success_message' => 'The customer has been added correctly');
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to edit a customer added by a user
 * @param array $input_data
 * @return array
 */

function edit_customer(array $input_data): array
{
  // Requirements control
  if (array_key_exists('namecustomer', $input_data)) {
    $input_data['namecustomer'] = trim($input_data['namecustomer']);
    if ($input_data['namecustomer'] === '') return array('message' => 'The customer name is required');
    if (strlen($input_data['namecustomer']) > 60) return array('message' => 'The customer name is invalid');
  }

  if (array_key_exists('telcustomer', $input_data)) {
    if (!preg_match('#^[6-9](\d){8}$#', $input_data['telcustomer'])) {
      return array('message' => 'The phone number is invalid');
    }
  }

  if (
    !filter_var(
      $input_data['codcustomer'],
      FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]
    )
  ) {
    return array('message' => 'The customer code is invalid');
  }

  // Obtain the customer data
  $customer_data = obtain_customer($input_data['codcustomer']);
  if (array_key_exists('message', $customer_data)) return $customer_data;
  $equal = 0;
  foreach ($input_data as $element => $value) {
    foreach ($customer_data['customer'] as $customer_attr => $customer_value) {
      if ($element == $customer_attr && ($value == $customer_value || (($value === 'null' || $value === null) && $customer_value === null))) {
        $equal = $equal + 1;
      }
    }
  }
  if ($equal == count($input_data)) return array('message' => 'There is nothing to change');

  try {
    // SQL Query to edit a customer
    $connection = create_pdo_object();

    $namecustomer_clause = '';
    if (array_key_exists('namecustomer', $input_data)) $namecustomer_clause = "namecustomer = :namecustomer";

    $telcustomer_clause = '';
    if (array_key_exists('telcustomer', $input_data)) {
      if ($namecustomer_clause != '') {
        $telcustomer_clause = ", telcustomer = :telcustomer";
      } else {
        $telcustomer_clause = "telcustomer = :telcustomer";
      }
    }

    $query = $connection->prepare("UPDATE " . CUSTOMERS . " SET " . $namecustomer_clause . $telcustomer_clause .
      " WHERE codcustomer = :codcustomer AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);

    if (array_key_exists('namecustomer', $input_data)) {
      $query->bindParam(':namecustomer', $input_data['namecustomer']);
    }

    if (array_key_exists('telcustomer', $input_data)) {
      $query->bindParam(':telcustomer', $input_data['telcustomer'], PDO::PARAM_STR_CHAR);
    }

    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();

    clear_query_data($query, $connection);
    return array('success_message' => 'The customer has been edited correctly');
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to delete a customer added by a user
 * @param integer $codcustomer
 * @return array
 */
function delete_customer(int $codcustomer): array
{
  // Requirements control
  if (
    !filter_var(
      $codcustomer,
      FILTER_VALIDATE_INT,
      ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]
    )
  ) {
    return array('message' => 'The customer code is invalid');
  }

  try {
    $connection = create_pdo_object();

    // SQL Query search a customer on orders and drafts
    $query = $connection->prepare("SELECT EXISTS (SELECT " . CUSTOMERS . ".codcustomer FROM " . CUSTOMERS .
      " JOIN " . ORDERS . " ON " . CUSTOMERS . ".codcustomer = " . ORDERS . ".codcustomer WHERE " . CUSTOMERS .
      ".codcustomer = :codcustomer AND " . CUSTOMERS . ".coduser = :coduser) OR EXISTS (SELECT " . CUSTOMERS .
      ".codcustomer FROM " . CUSTOMERS . " JOIN " . DRAFTS . " ON " . CUSTOMERS . ".codcustomer = " . DRAFTS .
      ".codcustomer WHERE " . CUSTOMERS . ".codcustomer = :codcustomer AND " . CUSTOMERS . ".coduser = :coduser)");

    // Parameters binding and execution
    $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    if (array_values($query->fetch(PDO::FETCH_ASSOC))[0] == 1) {
      clear_query_data($query, $connection);
      return array('message' => 'The customer cannot be deleted because he has orders or drafts created in his name');
    }
    $query->closeCursor();

    // SQL Query to delete a customer
    $query = $connection->prepare("DELETE FROM " . CUSTOMERS .
      " WHERE codcustomer = :codcustomer AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $rows_affected = $query->rowCount();
    clear_query_data($query, $connection);
    if ($rows_affected == 0) {
      return array('message' => 'There is no coincident customer');
    }

    return array('success_message' => 'The customer has been deleted correctly');
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}
