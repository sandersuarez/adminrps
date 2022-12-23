<?php

/**
 * Function to obtain drafts added by a user
 * @return array
 */
function obtain_drafts(): array
{
  try {
    $connection = create_pdo_object();

    // SQL Query to search customers in alphabetic order
    $query = $connection->prepare("SELECT " . DRAFTS . ".coddraft, " . DRAFTS . ".namecustomertmp, " . DRAFTS .
      ".telcustomertmp, " . DRAFTS . ".pickuptime, " . DRAFTS . ".codcustomer, " . CUSTOMERS . ".namecustomer, " .
      CUSTOMERS . ".telcustomer FROM " . DRAFTS . " LEFT JOIN " . CUSTOMERS . " ON " . DRAFTS . ".codcustomer = " .
      CUSTOMERS . ".codcustomer WHERE " . DRAFTS . ".coduser = :coduser ORDER BY " . DRAFTS . ".coddraft DESC");

    // Parameters binding and execution
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {
      $answer = array('drafts' => $result);
    } else {
      $answer = array('empty' => 'No hay borradores.');
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
 * Function to obtain a draft added by a user
 * @param integer $coddraft
 * @return array
 */
function obtain_draft(int $coddraft): array
{
  // Requirements control
  if (
    !filter_var(
      $coddraft,
      FILTER_VALIDATE_INT,
      ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]
    )) {
    return array('message' => 'The draft code is invalid');
  }

  try {
    $connection = create_pdo_object();

    // SQL Query to search customers in alphabetic order
    $query = $connection->prepare("SELECT " . DRAFTS . ".coddraft, " . DRAFTS . ".namecustomertmp, " . DRAFTS .
      ".telcustomertmp, " . DRAFTS . ".pickuptime, " . DRAFTS . ".codcustomer, " . CUSTOMERS . ".namecustomer, " .
      CUSTOMERS . ".telcustomer FROM " . DRAFTS . " LEFT JOIN " . CUSTOMERS . " ON " . DRAFTS . ".codcustomer = "
      . CUSTOMERS . ".codcustomer WHERE " . DRAFTS . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {

      $answer = array('draft' => $result);
      $query->closeCursor();

      // SQL Query to search the products of the draft
      $query = $connection->prepare("SELECT " . DRAFTS_CONTAIN . ".codproduct, " . PRODUCTS . ".nameproduct, " .
        PRODUCTS . ".priceproduct, " . PRODUCTS . ".stockproduct, " . DRAFTS_CONTAIN . ".amountproductdraft FROM " .
        DRAFTS_CONTAIN . " JOIN " . PRODUCTS . " ON " . DRAFTS_CONTAIN . ".codproduct = " . PRODUCTS .
        ".codproduct JOIN " . DRAFTS . " ON " . DRAFTS_CONTAIN . ".coddraft = " . DRAFTS . ".coddraft WHERE " .
        DRAFTS_CONTAIN . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

      // Parameters binding and execution
      $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_ASSOC);
      if ($result) $answer['draft'][0]['products'] = $result;
    } else {
      $answer = array('message' => 'There is no coincident draft');
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
 * Function to add a new draft for a user
 * @param array $input_data
 * @return array
 */
function add_draft(array $input_data): array
{
  // Requirements control
  if (array_key_exists('coddraft', $input_data) &&
    !filter_var($input_data['coddraft'],
      FILTER_VALIDATE_INT,
      ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']])
  ) {
    return array('message' => 'The draft code is invalid');
  }

  if (array_key_exists('products', $input_data)) {
    $validation = validate_order_product_list($input_data['products']);
    if (array_key_exists('message', $validation)) return $validation;
  }

  if (array_key_exists('codcustomer', $input_data) &&
    !filter_var($input_data['codcustomer'],
      FILTER_VALIDATE_INT,
      ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']])
  ) {
    return array('message' => 'The customer code is invalid');
  }

  if (array_key_exists('namecustomertmp', $input_data)) {
    $input_data['namecustomertmp'] = trim($input_data['namecustomertmp']);
    if ($input_data['namecustomertmp'] == '') return array('message' => 'The customer name cannot be empty');
    if (strlen($input_data['namecustomertmp']) > 60) return array('message' => 'The customer name is invalid');
  }

  if (array_key_exists('telcustomertmp', $input_data)) {
    $input_data['telcustomertmp'] = trim($input_data['telcustomertmp']);
    if ($input_data['telcustomertmp'] == '') return array('message' => 'The customer phone number cannot be empty');
    if (strlen($input_data['telcustomertmp']) > 9) return array('message' => 'The customer phone number is invalid');
  }

  if (array_key_exists('pickuptime', $input_data) && !validateTime($input_data['pickuptime'])) {
    return array('message' => 'The pick up time is invalid');
  }

  try {
    $connection = create_pdo_object();
    if (array_key_exists('codcustomer', $input_data)) {
      // SQL Query to check if the customer exists
      $query = $connection->prepare("SELECT codcustomer FROM " . CUSTOMERS .
        " WHERE codcustomer = :codcustomer AND coduser = :coduser");

      // Parameters binding and execution
      $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $result = $query->fetch(PDO::FETCH_ASSOC);
      if (!$result) {
        clear_query_data($query, $connection);
        return array('message' => 'The customer does not exists');
      }
      $query->closeCursor();
    }

    // SQL Query to search a new primary key
    $query = $connection->prepare("SELECT MAX(coddraft) FROM " . DRAFTS);
    $query->execute();
    $coddraft = $query->fetch()[0];
    $query->closeCursor();
    $coddraft = $coddraft + 1;

    if ($coddraft > 9223372036854775808) {
      $connection = null;
      return array('overflow' => 'The draft list is full. Contact the administrator');
    }
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection->beginTransaction();
  try {

    // SQL Query to add a new draft
    $codcustomer_clause = array("", "");
    if (array_key_exists('codcustomer', $input_data)) {
      $codcustomer_clause[0] = ", codcustomer";
      $codcustomer_clause[1] = ", :codcustomer";
    }

    $namecustomertmp_clause = array("", "");
    if (array_key_exists('namecustomertmp', $input_data)) {
      $namecustomertmp_clause[0] = ", namecustomertmp";
      $namecustomertmp_clause[1] = ", :namecustomertmp";
    }

    $telcustomertmp_clause = array("", "");
    if (array_key_exists('telcustomertmp', $input_data)) {
      $telcustomertmp_clause[0] = ", telcustomertmp";
      $telcustomertmp_clause[1] = ", :telcustomertmp";
    }

    $pickuptime_clause = array("", "");
    if (array_key_exists('pickuptime', $input_data)) {
      $pickuptime_clause[0] = ", pickuptime";
      $pickuptime_clause[1] = ", :pickuptime";
    }

    $query = $connection->prepare("INSERT INTO " . DRAFTS . " (coddraft" . $codcustomer_clause[0] .
      $namecustomertmp_clause[0] . $telcustomertmp_clause[0] . $pickuptime_clause[0] . ", coduser) VALUES (:coddraft" .
      $codcustomer_clause[1] . $namecustomertmp_clause[1] . $telcustomertmp_clause[1] . $pickuptime_clause[1] .
      ", :coduser)");

    // Parameters binding and execution
    $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
    if (array_key_exists('codcustomer', $input_data)) {
      $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
    }
    if (array_key_exists('namecustomertmp', $input_data)) {
      $query->bindParam(':namecustomertmp', $input_data['namecustomertmp']);
    }
    if (array_key_exists('telcustomertmp', $input_data)) {
      $query->bindParam(':telcustomertmp', $input_data['telcustomertmp']);
    }
    if (array_key_exists('pickuptime', $input_data)) {
      $query->bindParam(':pickuptime', $input_data['pickuptime']);
    }
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $query->closeCursor();

    if (array_key_exists('products', $input_data)) {
      foreach ($input_data['products'] as $product) {
        // SQL Query to add product records to the draft
        $query = $connection->prepare("INSERT INTO " . DRAFTS_CONTAIN .
          " (codproduct, coddraft, amountproductdraft) VALUES (:codproduct, :coddraft, :amountproductdraft)");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $product['codproduct'], PDO::PARAM_INT);
        $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
        $query->bindParam(':amountproductdraft', $product['amountproduct'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();
      }
    }

    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The draft has been added correctly', 'coddraft' => $coddraft);
}

/**
 * Function to edit a draft added by a user
 * @param array $input_data
 * @return array
 */
function edit_draft(array $input_data): array
{
  // Obtain the draft data
  $draft_data = obtain_draft($input_data['coddraft']);
  if (array_key_exists('message', $draft_data)) {
    return $draft_data;
  }

  // Requirements control
  if (array_key_exists('namecustomertmp', $input_data)) {
    $input_data['namecustomertmp'] = trim($input_data['namecustomertmp']);
    if (strlen($input_data['namecustomertmp']) > 60) {
      return array('message' => 'The customer name is invalid');
    }
  }

  if (array_key_exists('telcustomertmp', $input_data)) {
    $input_data['telcustomertmp'] = trim($input_data['telcustomertmp']);
    if (strlen($input_data['telcustomertmp']) > 9) {
      return array('message' => 'The customer phone number is invalid');
    }
  }

  if ((((array_key_exists('namecustomertmp', $input_data) && $input_data['namecustomertmp'] !== '') ||
        (!array_key_exists('namecustomertmp', $input_data) && $draft_data['draft'][0]['namecustomertmp'] !== null)) ||
      ((array_key_exists('telcustomertmp', $input_data) && $input_data['telcustomertmp'] !== '') ||
        (!array_key_exists('telcustomertmp', $input_data) && $draft_data['draft'][0]['telcustomertmp'] !== null))) &&
    ((array_key_exists('codcustomer', $input_data) && $input_data['codcustomer'] != 0) ||
      (!array_key_exists('codcustomer', $input_data) && $draft_data['draft'][0]['codcustomer'] !== null))
  ) {
    return array('message', 'The customer code and the customer data cannot be inserted at the same time');
  }

  if (array_key_exists('coddraft', $input_data) &&
    !filter_var(
      $input_data['coddraft'],
      FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']])
  ) {
    return array('message' => 'The draft code is invalid');
  }

  if (array_key_exists('codcustomer', $input_data) &&
    !(filter_var($input_data['codcustomer'], FILTER_VALIDATE_INT) === 0 ||
      filter_var(
        $input_data['codcustomer'],
        FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
  ) {
    return array('message' => 'The customer code is invalid');
  }

  if (array_key_exists('products', $input_data) && $input_data['products'] !== []) {
    $validation = validate_order_product_list($input_data['products']);
    if (array_key_exists('message', $validation)) {
      return $validation;
    }
  }

  if (array_key_exists('pickuptime', $input_data)) {
    $input_data['pickuptime'] = trim($input_data['pickuptime']);
    if ((!validateTime($input_data['pickuptime'])) && $input_data['pickuptime'] != '') {
      return array('message' => 'The pick up time is invalid');
    }
  }

  $equal = 0;
  foreach ($input_data as $element => $value) {
    foreach ($draft_data['draft'][0] as $draft_attr => $draft_value) {

      if ($element == $draft_attr && $value == $draft_value) {
        $equal = $equal + 1;
      }

      if ($element == 'codcustomer' && $draft_attr == 'codcustomer' && $value == 0 && $draft_value === null) {
        $equal = $equal + 1;
      }

      if ($element == 'pickuptime' && $value != '' && $draft_attr == 'pickuptime' && $value . ':00' == $draft_value) {
        $equal = $equal + 1;
      }
    }
  }

  if (array_key_exists('products', $input_data)) {
    if (array_key_exists('products', $draft_data['draft'][0])) {

      $equal_products = 0;

      foreach ($input_data['products'] as $product) {
        foreach ($draft_data['draft'][0]['products'] as $draft_product) {
          if ($product['codproduct'] == $draft_product['codproduct'] &&
            $product['amountproduct'] == $draft_product['amountproductdraft']) {
            $equal_products = $equal_products + 1;
          }
        }
      }

      if ($equal_products == max(count($input_data['products']), count($draft_data['draft'][0]['products']))) {
        $equal = $equal + 1;
      }
    } else {
      if (count($input_data['products']) == 0) {
        $equal = $equal + 1;
      }
    }
  }

  if ($equal == count($input_data)) {
    return array('message' => 'There is nothing to change');
  }

  try {
    $connection = create_pdo_object();
    $connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    if (array_key_exists('codcustomer', $input_data) && $input_data['codcustomer'] != 0) {

      // SQL Query to check if the customer exists
      $query = $connection->prepare("SELECT codcustomer FROM " . CUSTOMERS .
        " WHERE codcustomer = :codcustomer AND coduser = :coduser");

      // Parameters binding and execution
      $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $result = $query->fetch(PDO::FETCH_ASSOC);
      if (!$result) {
        clear_query_data($query, $connection);
        return array('message' => 'The customer does not exists');
      }
      $query->closeCursor();
    }
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection->beginTransaction();
  try {

    // SQL Query to edit the draft
    if (
      array_key_exists('namecustomertmp', $input_data) || array_key_exists('telcustomertmp', $input_data) ||
      array_key_exists('codcustomer', $input_data) || array_key_exists('pickuptime', $input_data)
    ) {

      $namecustomertmp_clause = '';
      if (array_key_exists('namecustomertmp', $input_data)) {
        $namecustomertmp_clause = "namecustomertmp = :namecustomertmp";
      }

      $telcustomertmp_clause = '';
      if (array_key_exists('telcustomertmp', $input_data)) {
        if ($namecustomertmp_clause !== '') {
          $telcustomertmp_clause = ", telcustomertmp = :telcustomertmp";
        } else {
          $telcustomertmp_clause = "telcustomertmp = :telcustomertmp";
        }
      }

      $codcustomer_clause = '';
      if (array_key_exists('codcustomer', $input_data)) {
        if ($telcustomertmp_clause !== '' || $namecustomertmp_clause !== '') {
          $codcustomer_clause = ", codcustomer = :codcustomer";
        } else {
          $codcustomer_clause = "codcustomer = :codcustomer";
        }
      }

      $pickuptime_clause = '';
      if (array_key_exists('pickuptime', $input_data)) {
        if ($telcustomertmp_clause !== '' || $namecustomertmp_clause !== '' || $codcustomer_clause !== '') {
          $pickuptime_clause = ", pickuptime = :pickuptime";
        } else {
          $pickuptime_clause = "pickuptime = :pickuptime";
        }
      }

      $query = $connection->prepare("UPDATE " . DRAFTS . " SET " . $namecustomertmp_clause .
        $telcustomertmp_clause . $codcustomer_clause . $pickuptime_clause . " WHERE coddraft = :coddraft");

      // Parameters binding and execution
      $query->bindParam(':coddraft', $input_data['coddraft'], PDO::PARAM_INT);

      if (array_key_exists('codcustomer', $input_data)) {
        if ($input_data['codcustomer'] == 0) {
          $query->bindValue(':codcustomer', NULL, PDO::PARAM_NULL);
        } else {
          $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
        }
      }

      if (array_key_exists('namecustomertmp', $input_data)) {
        if ($input_data['namecustomertmp'] === '') {
          $query->bindValue(':namecustomertmp', NULL, PDO::PARAM_NULL);
        } else {
          $query->bindParam(':namecustomertmp', $input_data['namecustomertmp']);
        }
      }

      if (array_key_exists('telcustomertmp', $input_data)) {
        if ($input_data['telcustomertmp'] === '') {
          $query->bindValue(':telcustomertmp', NULL, PDO::PARAM_NULL);
        } else {
          $query->bindParam(':telcustomertmp', $input_data['telcustomertmp']);
        }
      }

      if (array_key_exists('pickuptime', $input_data)) {
        if ($input_data['pickuptime'] === '') {
          $query->bindValue(':pickuptime', NULL, PDO::PARAM_NULL);
        } else {
          $query->bindParam(':pickuptime', $input_data['pickuptime']);
        }
      }

      $query->execute();
      $query->closeCursor();
    }

    if (array_key_exists('products', $input_data)) {
      if (!array_key_exists('products', $draft_data['draft'][0])) {

        foreach ($input_data['products'] as $product) {
          // SQL Query to add product records to the draft
          $query = $connection->prepare("INSERT INTO " . DRAFTS_CONTAIN .
            " (codproduct, coddraft, amountproductdraft) VALUES (:codproduct, :coddraft, :amountproductdraft)");

          // Parameters binding and execution
          $query->bindParam(':codproduct', $product['codproduct'], PDO::PARAM_INT);
          $query->bindParam(':coddraft', $input_data['coddraft'], PDO::PARAM_INT);
          $query->bindParam(':amountproductdraft', $product['amountproduct'], PDO::PARAM_INT);

          $query->execute();
          $query->closeCursor();
        }
      } else {
        if ($equal_products != max(count($input_data['products']), count($draft_data['draft'][0]['products']))) {

          $codproducts_delete = [];
          foreach ($draft_data['draft'][0]['products'] as $draft_product) {
            $codproducts_delete[] = $draft_product['codproduct'];
          }

          $codproducts_insert = [];
          foreach ($input_data['products'] as $product) {
            $codproducts_insert[] = $product['codproduct'];
          }

          // Product elements modification
          foreach ($input_data['products'] as $product) {
            foreach ($draft_data['draft'][0]['products'] as $draft_product) {

              if ($product['codproduct'] == $draft_product['codproduct']) {

                if (($key = array_search($product['codproduct'], $codproducts_insert)) !== false) {
                  unset($codproducts_insert[$key]);
                }

                if (($key = array_search($draft_product['codproduct'], $codproducts_delete)) !== false) {
                  unset($codproducts_delete[$key]);
                }

                if ($product['amountproduct'] != $draft_product['amountproductdraft']) {
                  // SQL Query to add product records to the order
                  $query = $connection->prepare("UPDATE " . DRAFTS_CONTAIN .
                    " SET amountproductdraft = :amountproductdraft WHERE codproduct = :codproduct " .
                    "AND coddraft = :coddraft");

                  // Parameters binding and execution
                  $query->bindParam(':codproduct', $draft_product['codproduct'], PDO::PARAM_INT);
                  $query->bindParam(':coddraft', $input_data['coddraft'], PDO::PARAM_INT);
                  $query->bindParam(':amountproductdraft', $product['amountproduct'], PDO::PARAM_INT);

                  $query->execute();
                  $query->closeCursor();
                }
              }
            }
          }

          $products_delete = [];
          foreach ($draft_data['draft'][0]['products'] as $draft_product) {
            if (in_array($draft_product['codproduct'], $codproducts_delete)) {
              $products_delete[] = $draft_product;
            }
          }

          $products_insert = [];
          foreach ($input_data['products'] as $product) {
            if (in_array($product['codproduct'], $codproducts_insert)) {
              $products_insert[] = $product;
            }
          }

          // Product elements insertion
          foreach ($products_insert as $product_insert) {

            // SQL Query to add product records to the order
            $query = $connection->prepare("INSERT INTO " . DRAFTS_CONTAIN .
              " (codproduct, coddraft, amountproductdraft) VALUES (:codproduct, :coddraft, :amountproductdraft)");

            // Parameters binding and execution
            $query->bindParam(':codproduct', $product_insert['codproduct'], PDO::PARAM_INT);
            $query->bindParam(':coddraft', $input_data['coddraft'], PDO::PARAM_INT);
            $query->bindParam(':amountproductdraft', $product_insert['amountproduct'], PDO::PARAM_INT);

            $query->execute();
            $query->closeCursor();
          }

          // Product elements deletion
          foreach ($products_delete as $product_delete) {

            // SQL Query to add product records to the order
            $query = $connection->prepare("DELETE FROM " . DRAFTS_CONTAIN .
              " WHERE codproduct = :codproduct AND coddraft = :coddraft");

            // Parameters binding and execution
            $query->bindParam(':codproduct', $product_delete['codproduct'], PDO::PARAM_INT);
            $query->bindParam(':coddraft', $input_data['coddraft'], PDO::PARAM_INT);

            $query->execute();
            $query->closeCursor();
          }
        }
      }
    }

    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The draft has been edited correctly');
}

/**
 * Function to delete a draft added by a user
 * @param integer $coddraft
 * @return array
 */
function delete_draft(int $coddraft): array
{
  // Requirements control
  if (!filter_var($coddraft, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'The draft code is invalid');

  try {
    // Transaction to completely delete a draft
    $connection = create_pdo_object();
    $connection->beginTransaction();

    // SQL Query to delete the draft products
    $query = $connection->prepare("DELETE " . DRAFTS_CONTAIN . " FROM " . DRAFTS_CONTAIN . " JOIN " . DRAFTS . " ON " . DRAFTS_CONTAIN . ".coddraft = " . DRAFTS .
      ".coddraft WHERE " . DRAFTS_CONTAIN . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

    $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $query->closeCursor();

    // SQL Query to delete a draft
    $query = $connection->prepare("DELETE FROM " . DRAFTS . " WHERE coddraft = :coddraft AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $rows_affected = $query->rowCount();
    if ($rows_affected == 0) {
      clear_query_data($query, $connection);
      return array('message' => 'There is no coincident draft');
    }

    $query->closeCursor();
    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The draft has been deleted correctly');
}

/**
 * Function to delete all drafts added by a user
 * @return array
 */
function delete_all_drafts(): array
{
  try {
    // Transaction to completely delete a draft
    $connection = create_pdo_object();
    $connection->beginTransaction();

    // SQL Query to find the draft codes added by a user
    $query = $connection->prepare("SELECT coddraft FROM " . DRAFTS . " WHERE coduser = :coduser");
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    $query->closeCursor();

    if ($result) {
      foreach ($result as $draft) {
        // SQL Query to delete the draft products
        $query = $connection->prepare("DELETE FROM " . DRAFTS_CONTAIN . " WHERE coddraft = :coddraft");
        $query->bindParam(':coddraft', $draft['coddraft'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();

        // SQL Query to delete a draft
        $query = $connection->prepare("DELETE FROM " . DRAFTS . " WHERE coddraft = :coddraft");
        $query->bindParam(':coddraft', $draft['coddraft'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();
      }
    } else {
      $connection = null;
      return array('message' => 'There are no drafts');
    }

    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The drafts has been deleted correctly');
}
