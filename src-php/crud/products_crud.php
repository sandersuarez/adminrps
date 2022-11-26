<?php

/**
 * Function to obtain products added by a user that meet certain requirements and according to paging
 * @param array $requirements
 * @return array
 */
function obtain_products(array $requirements): array
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

  $products_number = match ($requirements['products_number']) {
    '30' => 30,
    default => 15,
  };

  $begin = $begin * $products_number;

  try {
    $connection = create_pdo_object();

    // If there is a product name to search, the clause is added
    $name_clause = '';
    $requirements['name'] = trim($requirements['name']);
    if ($requirements['name'] !== '') {
      $name_clause = " AND (nameproduct REGEXP :nameproduct)";
    }

    // SQL Query to search total number customers
    $query = $connection->prepare("SELECT count(codproduct) FROM " . PRODUCTS .
      " WHERE productdeleted = :productdeleted AND coduser = :coduser" . $name_clause);

    // Parameters binding and execution
    $query->bindParam(':productdeleted', $requirements['deleted'], PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    if ($requirements['name'] != '') {
      $query->bindParam(':nameproduct', $requirements['name']);
    }

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if ($result && $result['count(codproduct)']) {

      // If the page is out of bounds, the page it is redirected to the last posible one
      if ($result['count(codproduct)'] <= $begin) {
        // Pagination calculation
        $redirect_page = ceil($result['count(codproduct)'] / $products_number);
        $begin = $redirect_page - 1;
        $begin = $begin * $products_number;
      }

      // The posible pages number
      $posible_pages = ceil($result['count(codproduct)'] / $products_number);

      // SQL Query to search products in alphabetic order
      $query = $connection->prepare("SELECT codproduct, nameproduct, stockproduct, priceproduct FROM " .
        PRODUCTS . " WHERE productdeleted = :productdeleted AND coduser = :coduser" . $name_clause .
        " ORDER BY nameproduct, codproduct LIMIT :begin, :end");

      // Parameters binding and execution
      $query->bindParam(':productdeleted', $requirements['deleted'], PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
      $query->bindParam(':begin', $begin, PDO::PARAM_INT);
      $query->bindParam(':end', $products_number, PDO::PARAM_INT);

      if ($requirements['name'] !== '') $query->bindParam(':nameproduct', $requirements['name']);

      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_ASSOC);
      if ($result) {
        $answer = array('products' => $result);
        $query->closeCursor();

        if ($requirements['deleted']) {
          for ($i = 0; sizeof($answer['products']) > $i; $i++) {

            // SQL Query search a product on orders and drafts
            $query = $connection->prepare("SELECT EXISTS (SELECT " . PRODUCTS . ".codproduct FROM " . PRODUCTS .
              " JOIN " . ORDERS_CONTAIN . " ON " . PRODUCTS . ".codproduct = " . ORDERS_CONTAIN . ".codproduct WHERE " .
              PRODUCTS . ".productdeleted = 1 AND " . PRODUCTS . ".codproduct = :codproduct AND " . PRODUCTS .
              ".coduser = :coduser) OR EXISTS (SELECT " . PRODUCTS . ".codproduct FROM " . PRODUCTS . " JOIN " .
              DRAFTS_CONTAIN . " ON " . PRODUCTS . ".codproduct = " . DRAFTS_CONTAIN . ".codproduct WHERE " . PRODUCTS .
              ".productdeleted = 0 AND " . PRODUCTS . ".codproduct = :codproduct AND " . PRODUCTS .
              ".coduser = :coduser)");

            // Parameters binding and execution
            $query->bindParam(':codproduct', $answer['products'][$i]['codproduct'], PDO::PARAM_INT);
            $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

            $query->execute();
            $result = array_values($query->fetch(PDO::FETCH_ASSOC))[0];
            $query->closeCursor();
            if ($result) {
              $answer['products'][$i]['canbedeleted'] = 0;
            } else {
              $answer['products'][$i]['canbedeleted'] = 1;
            }
          }
        }

        $answer['pages'] = $posible_pages;
      } else {
        $answer = array('empty' => 'No hay productos que coincidan con la búsqueda');
      }
    } else {
      if ($requirements['name'] !== '') {
        $answer = array('empty' => 'No hay productos que coincidan con la búsqueda');
      } else {
        $answer = array('empty' => 'No hay productos');
      }
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
 * Function to obtain the data of a product added by a user
 * @param integer $codproduct
 * @return array
 */
function obtain_product($codproduct)
{
  // Requirements control
  if (!filter_var($codproduct, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'The product code is invalid');

  try {
    // SQL Query to search the product
    $connection = create_pdo_object();
    $query = $connection->prepare("SELECT codproduct, nameproduct, stockproduct, priceproduct, productdeleted FROM " . PRODUCTS .
      " WHERE coduser = :coduser AND codproduct = :codproduct");

    // Parameters binding and execution
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if ($result) {
      $answer = array('product' => $result);

      if ($answer['product']['productdeleted'] == 1) {
        // SQL Query search a product on orders and drafts
        $query = $connection->prepare("SELECT EXISTS (SELECT " . PRODUCTS . ".codproduct FROM " . PRODUCTS . " JOIN " . ORDERS_CONTAIN . " ON " . PRODUCTS . ".codproduct = " .
          ORDERS_CONTAIN . ".codproduct WHERE " . PRODUCTS . ".productdeleted = 1 AND " . PRODUCTS . ".codproduct = :codproduct AND " . PRODUCTS .
          ".coduser = :coduser) OR EXISTS (SELECT " . PRODUCTS . ".codproduct FROM " . PRODUCTS . " JOIN " . DRAFTS_CONTAIN . " ON " . PRODUCTS . ".codproduct = " . DRAFTS_CONTAIN .
          ".codproduct WHERE " . PRODUCTS . ".productdeleted = 0 AND " . PRODUCTS . ".codproduct = :codproduct AND " . PRODUCTS . ".coduser = :coduser)");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $result = array_values($query->fetch(PDO::FETCH_ASSOC))[0];
        $query->closeCursor();
        if ($result) {
          $answer['product']['canbedeleted'] = 0;
        } else {
          $answer['product']['canbedeleted'] = 1;
        }
      }
    } else {
      $answer = array('message' => 'There is no coincident product');
    }

    clear_query_data($query, $connection);
    return $answer;
  } catch (PDOException $e) {
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to add a new product for a user
 * @param array $input_data
 * @return array
 */
function add_product(array $input_data): array
{
  // Requirements control
  $input_data['nameproduct'] = trim($input_data['nameproduct']);
  if ($input_data['nameproduct'] === '') {
    return array('message' => 'The product name is required');
  }
  if (strlen($input_data['nameproduct']) > 240) {
    return array('message' => 'The product name is invalid');
  }

  if (
    (!is_numeric($input_data['priceproduct'])) ||
    $input_data['priceproduct'] < 0 ||
    round($input_data['priceproduct'], 2) > 999.99) {
    return array('message' => 'The price is invalid');
  }
  $input_data['priceproduct'] = round($input_data['priceproduct'], 2);

  if (
    array_key_exists('stockproduct', $input_data) &&
    !(
      filter_var($input_data['stockproduct'], FILTER_VALIDATE_INT) === 0 ||
      filter_var(
        $input_data['stockproduct'],
        FILTER_VALIDATE_INT,
        ['options' => ['min_range' => '1', 'max_range' => '2147483647']])
    )
  )
    return array('message' => 'The stock is invalid');

  try {
    // SQL Query to search a new primary key
    $connection = create_pdo_object();
    $query = $connection->prepare("SELECT MAX(codproduct) FROM " . PRODUCTS);
    $query->execute();
    $codproduct = $query->fetch()[0];
    $query->closeCursor();
    $codproduct = $codproduct + 1;

    if ($codproduct > 9223372036854775808) {
      $connection = null;
      return array('overflow' => 'The product list is full. Contact the administrator');
    }

    // SQL Query to insert a product
    if (array_key_exists('stockproduct', $input_data)) {
      $query = $connection->prepare("INSERT INTO " . PRODUCTS .
        " (codproduct, nameproduct, stockproduct, priceproduct, coduser) VALUES " .
        "(:codproduct, :nameproduct, :stockproduct, :priceproduct, :coduser)");
    } else {
      $query = $connection->prepare("INSERT INTO " . PRODUCTS .
        " (codproduct, nameproduct, priceproduct, coduser) VALUES " .
        "(:codproduct, :nameproduct, :priceproduct, :coduser)");
    }

    // Parameters binding and execution
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
    $query->bindParam(':nameproduct', $input_data['nameproduct']);
    $query->bindParam(':priceproduct', $input_data['priceproduct']);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
    if (array_key_exists('stockproduct', $input_data)) {
      $query->bindParam(':stockproduct', $input_data['stockproduct'], PDO::PARAM_INT);
    }

    $query->execute();

    clear_query_data($query, $connection);
    return array('success_message' => 'The product has been added correctly', 'codproduct' => $codproduct);
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to edit a product added by a user
 * @param array $input_data
 * @return array
 */
function edit_product($input_data)
{
  // Requirements control
  if (array_key_exists('nameproduct', $input_data)) {
    $input_data['nameproduct'] = trim($input_data['nameproduct']);
    if ($input_data['nameproduct'] === '') return array('message' => 'The product name is required');
    if (strlen($input_data['nameproduct']) > 240) return array('message' => 'The product name is invalid');
  }

  if (array_key_exists('priceproduct', $input_data)) {
    if ((!is_numeric($input_data['priceproduct'])) || $input_data['priceproduct'] < 0 || round($input_data['priceproduct'], 2) > 999.99) return array('message' => 'The price is invalid');
    $input_data['priceproduct'] = round($input_data['priceproduct'], 2);
  }

  if (
    array_key_exists('stockproduct', $input_data) &&
    ((!(filter_var($input_data['stockproduct'], FILTER_VALIDATE_INT) === 0 ||
        filter_var($input_data['stockproduct'], FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '2147483647']])))
      && $input_data['stockproduct'] != 'null')
  )
    return array('message' => 'The stock is invalid');

  if (!filter_var($input_data['codproduct'], FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'The product code is invalid');

  // Obtain the product data
  $product_data = obtain_product($input_data['codproduct']);
  if (array_key_exists('message', $product_data)) return $product_data;
  $equal = 0;
  foreach ($input_data as $element => $value) {
    foreach ($product_data['product'] as $product_attr => $product_value) {
      if ($element == $product_attr && ($value == $product_value || (($value === 'null' || $value === null) && $product_value === null))) {
        $equal = $equal + 1;
      }
    }
  }
  if ($equal == count($input_data)) return array('message' => 'There is nothing to change');

  try {
    // SQL Query to edit a product
    $connection = create_pdo_object();
    $connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $nameproduct_clause = '';
    if (array_key_exists('nameproduct', $input_data)) $nameproduct_clause = "nameproduct = :nameproduct";

    $stockproduct_clause = '';
    if (array_key_exists('stockproduct', $input_data)) {
      if ($nameproduct_clause !== '') {
        $stockproduct_clause = ", stockproduct = :stockproduct";
      } else {
        $stockproduct_clause = "stockproduct = :stockproduct";
      }
    }

    $priceproduct_clause = '';
    if (array_key_exists('priceproduct', $input_data)) {
      if ($stockproduct_clause !== '' || $nameproduct_clause !== '') {
        $priceproduct_clause = ", priceproduct = :priceproduct";
      } else {
        $priceproduct_clause = "priceproduct = :priceproduct";
      }
    }

    $query = $connection->prepare("UPDATE " . PRODUCTS . " SET " . $nameproduct_clause . $stockproduct_clause . $priceproduct_clause .
      " WHERE productdeleted = 0 AND codproduct = :codproduct AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codproduct', $input_data['codproduct'], PDO::PARAM_INT);
    if (array_key_exists('nameproduct', $input_data)) $query->bindParam(':nameproduct', $input_data['nameproduct'], PDO::PARAM_STR);
    if (array_key_exists('priceproduct', $input_data)) $query->bindParam(':priceproduct', $input_data['priceproduct'], PDO::PARAM_STR);
    if (array_key_exists('stockproduct', $input_data)) {
      if ($input_data['stockproduct'] === 'null' || $input_data['stockproduct'] === null) {
        $query->bindValue(':stockproduct', NULL, PDO::PARAM_NULL);
      } else {
        $query->bindParam(':stockproduct', $input_data['stockproduct'], PDO::PARAM_INT);
      }
    }
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();

    clear_query_data($query, $connection);
    return array('success_message' => 'The product has been edited correctly');
  } catch (PDOException $e) {
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to send a product added by a user to the trash
 * @param integer $codproduct
 * @return array
 */
function send_product_to_trash($codproduct)
{
  // Requirements control
  if (!filter_var($codproduct, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'The product code is invalid');

  try {
    $connection = create_pdo_object();

    // SQL Query to check if the product exists
    $query = $connection->prepare("SELECT codproduct FROM " . PRODUCTS . " WHERE productdeleted = 0 AND codproduct = :codproduct AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
      clear_query_data($query, $connection);
      return array('message' => 'There is no coincident product');
    }

    // SQL Query to modify a product to display as deleted
    $query = $connection->prepare("UPDATE " . PRODUCTS . " SET productdeleted = 1 WHERE productdeleted = 0 AND codproduct = :codproduct AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();

    clear_query_data($query, $connection);
    return array('success_message' => 'The product has been sent to the trash correctly');
  } catch (PDOException $e) {
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to restore a product from the user trash
 * @param integer $codproduct
 * @return array
 */
function restore_product($codproduct)
{
  // Requirements control
  if (!filter_var($codproduct, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'The product code is invalid');

  try {
    $connection = create_pdo_object();

    // SQL Query to check if the deleted product exists
    $query = $connection->prepare("SELECT codproduct FROM " . PRODUCTS . " WHERE productdeleted = 1 AND codproduct = :codproduct AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
      clear_query_data($query, $connection);
      return array('message' => 'There is no coincident product in the trash');
    }
    $query->closeCursor();

    // SQL Query to modify a product to not display as deleted
    $query = $connection->prepare("UPDATE " . PRODUCTS . " SET productdeleted = 0 WHERE productdeleted = 1 AND codproduct = :codproduct AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();

    clear_query_data($query, $connection);
    return array('success_message' => 'The product has been restored correctly');
  } catch (PDOException $e) {
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to delete a product added by a user
 * @param integer $codproduct
 * @return array
 */
function delete_product($codproduct)
{
  // Requirements control
  if (!filter_var($codproduct, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'The product code is invalid');

  try {
    $connection = create_pdo_object();

    // SQL Query to check if the product exists
    $query = $connection->prepare("SELECT codproduct FROM " . PRODUCTS . " WHERE productdeleted = 1 AND codproduct = :codproduct AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
      clear_query_data($query, $connection);
      return array('message' => 'There is no coincident product');
    }
    $query->closeCursor();

    // SQL Query search a product on orders and drafts
    $query = $connection->prepare("SELECT EXISTS (SELECT " . PRODUCTS . ".codproduct FROM " . PRODUCTS . " JOIN " . ORDERS_CONTAIN . " ON " . PRODUCTS . ".codproduct = " .
      ORDERS_CONTAIN . ".codproduct WHERE " . PRODUCTS . ".productdeleted = 1 AND " . PRODUCTS . ".codproduct = :codproduct AND " . PRODUCTS .
      ".coduser = :coduser) OR EXISTS (SELECT " . PRODUCTS . ".codproduct FROM " . PRODUCTS . " JOIN " . DRAFTS_CONTAIN . " ON " . PRODUCTS . ".codproduct = " . DRAFTS_CONTAIN .
      ".codproduct WHERE " . PRODUCTS . ".productdeleted = 0 AND " . PRODUCTS . ".codproduct = :codproduct AND " . PRODUCTS . ".coduser = :coduser)");

    // Parameters binding and execution
    $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = array_values($query->fetch(PDO::FETCH_ASSOC))[0];
    $query->closeCursor();
    if ($result) {
      clear_query_data($query, $connection);
      return array('message' => 'The product cannot be deleted because it is part of an order or draft');
    } else {
      // SQL Query to delete a product
      $query = $connection->prepare("DELETE FROM " . PRODUCTS . " WHERE productdeleted = 1 AND codproduct = :codproduct AND coduser = :coduser");

      // Parameters binding and execution
      $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
    }

    clear_query_data($query, $connection);
    return array('success_message' => 'The product has been deleted correctly');
  } catch (PDOException $e) {
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}
