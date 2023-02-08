<?php

/**
 * Function to obtain the active orders added by a user according to paging
 * @param array $requirements
 * @return array
 */
function obtain_active_orders(array $requirements): array
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

  $orders_number = match ($requirements['orders_number']) {
    '30' => 30,
    default => 16,
  };

  $begin = $begin * $orders_number;

  try {
    $connection = create_pdo_object();

    $today_clause = '';
    if ($requirements['today'] == 1 || $requirements['today'] == 0) {
      if ($requirements['today']) {
        $today_clause = " AND " . ORDERS . ".dateorder = (CURDATE()) ORDER BY " . ORDERS . ".pickuptime, " .
          ORDERS . ".numdayorder";
      } else {
        $today_clause = " AND " . ORDERS . ".dateorder <> (CURDATE()) ORDER BY " . ORDERS . ".dateorder DESC";
      }
    } else {
      return array('message' => 'Selecciona un espacio de tiempo válido');
    }

    // If there is a customer name to search, the clause is added
    $tel_name_clause = '';
    $requirements['telnamecustomer'] = trim($requirements['telnamecustomer']);
    if ($requirements['telnamecustomer'] !== '' && $requirements['today'] == 1) {
      $tel_name_clause = " AND ((" . CUSTOMERS . ".namecustomer REGEXP :telnamecustomer) OR (" . CUSTOMERS .
        ".telcustomer REGEXP :telnamecustomer))";
    }

    // SQL Query to search total number products
    $query = $connection->prepare("SELECT count(" . ORDERS . ".codorder) FROM " . ORDERS . " JOIN " . CUSTOMERS .
      " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer  LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS .
      ".codorder = " . ORDERS_SOLD . ".codorder WHERE " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD .
      ".codordersold IS NULL" . $tel_name_clause . $today_clause);

    // Parameters binding and execution
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    if ($requirements['telnamecustomer'] !== '' && $requirements['today'] == 1) {
      $query->bindParam(':telnamecustomer', $requirements['telnamecustomer']);
    }

    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if ($result && $result["count(" . ORDERS . ".codorder)"]) {

      // If the page is out of bounds, the page it is redirected to the last posible one
      if ($result["count(" . ORDERS . ".codorder)"] <= $begin) {
        // Pagination calculation
        $redirect_page = ceil($result["count(" . ORDERS . ".codorder)"] / $orders_number);
        $begin = $redirect_page - 1;
        $begin = $begin * $orders_number;
      }

      // The posible pages number
      $posible_pages = ceil($result["count(" . ORDERS . ".codorder)"] / $orders_number);

      // SQL Query to search active orders
      $query = $connection->prepare("SELECT " . ORDERS . ".codorder, " . ORDERS . ".numdayorder, " . ORDERS .
        ".dateorder, " . ORDERS . ".hourorder, " . ORDERS . ".pickuptime, " . ORDERS . ".codcustomer, " . CUSTOMERS .
        ".namecustomer, " . CUSTOMERS . ".telcustomer FROM " . ORDERS . " JOIN " . CUSTOMERS . " ON " . ORDERS .
        ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS . ".codorder = " .
        ORDERS_SOLD . ".codorder WHERE " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD .
        ".codordersold IS NULL" . $tel_name_clause . $today_clause . " LIMIT :begin, :end");

      // Parameters binding and execution
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
      $query->bindParam(':begin', $begin, PDO::PARAM_INT);
      $query->bindParam(':end', $orders_number, PDO::PARAM_INT);

      if ($requirements['telnamecustomer'] !== '' && $requirements['today'] == 1) {
        $query->bindParam(':telnamecustomer', $requirements['telnamecustomer']);
      }

      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_ASSOC);
      if ($result) {

        $answer = array('orders' => $result);
        $query->closeCursor();

        for ($i = 0; sizeof($answer['orders']) > $i; $i++) {

          // SQL Query to search the products of the order
          $query = $connection->prepare("SELECT " . ORDERS_CONTAIN . ".codproduct, " . PRODUCTS .
            ".nameproduct, " . PRODUCTS . ".priceproduct, " . PRODUCTS . ".stockproduct, " . ORDERS_CONTAIN .
            ".amountproductorder FROM " . ORDERS_CONTAIN . " JOIN " . PRODUCTS . " ON " . ORDERS_CONTAIN .
            ".codproduct = " . PRODUCTS . ".codproduct JOIN " . ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " .
            ORDERS . ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS .
            ".codcustomer WHERE " . ORDERS_CONTAIN . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser");

          // Parameters binding and execution
          $query->bindParam(':codorder', $answer['orders'][$i]['codorder'], PDO::PARAM_INT);
          $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

          $query->execute();
          $result = $query->fetchAll(PDO::FETCH_ASSOC);
          if ($result) {
            $answer['orders'][$i]['products'] = $result;
          }
          $query->closeCursor();
        }

        $answer['pages'] = $posible_pages;
      } else {
        if ($requirements['today']) {
          $answer = array('message' => 'No hay pedidos activos');
        } else {
          $answer = array('message' => 'No hay pedidos sin reclamar');
        }
      }
    } else {
      if ($requirements['telnamecustomer'] !== '') {
        $answer = array('empty' => 'No hay pedidos que coincidan con la búsqueda');
      } else {
        if ($requirements['today']) {
          $answer = array('message' => 'No hay pedidos activos');
        } else {
          $answer = array('message' => 'No hay pedidos sin reclamar');
        }
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
 * Function to obtain an order added by a user
 * @param integer $codorder
 * @return array
 */
function obtain_active_order($codorder)
{
  // Requirements control
  if (!filter_var($codorder, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'El código de pedido es inválido');

  try {
    $connection = create_pdo_object();

    // SQL Query to search active orders
    $query = $connection->prepare("SELECT " . ORDERS . ".codorder, " . ORDERS . ".numdayorder, " . ORDERS . ".dateorder, " . ORDERS . ".hourorder, " . ORDERS . ".pickuptime, " .
      ORDERS . ".codcustomer, " . CUSTOMERS . ".namecustomer, " . CUSTOMERS . ".telcustomer FROM " . ORDERS . " JOIN " . CUSTOMERS . " ON " .
      ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD . ".codorder WHERE " .
      ORDERS . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD . ".codordersold IS NULL");

    // Parameters binding and execution
    $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {

      $answer = array('order' => $result);
      $query->closeCursor();

      // SQL Query to search the products of the order
      $query = $connection->prepare("SELECT " . ORDERS_CONTAIN . ".codproduct, " . PRODUCTS . ".nameproduct, " . PRODUCTS . ".priceproduct, " . PRODUCTS . ".stockproduct, " .
        ORDERS_CONTAIN . ".amountproductorder FROM " . ORDERS_CONTAIN . " JOIN " . PRODUCTS . " ON " . ORDERS_CONTAIN . ".codproduct = " . PRODUCTS . ".codproduct JOIN " .
        ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS . ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer WHERE " .
        ORDERS_CONTAIN . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser");

      // Parameters binding and execution
      $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_ASSOC);
      if ($result) $answer['order'][0]['products'] = $result;
    } else {
      $answer = array('message' => 'El pedido no existe');
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
 * Function to obtain the sold orders according to requirements
 * @param array $requirements
 * @return array
 */
function obtain_sold_orders($requirements)
{
  // Requirements control
  if (array_key_exists('datebegin', $requirements) && !validateDate($requirements['datebegin'])) return array('message' => 'La fecha mínima es inválida');
  if (array_key_exists('dateend', $requirements) && !validateDate($requirements['dateend'])) return array('message' => 'La fecha máxima es inválida');

  // If the page number is invalid its value will be the default
  if (!filter_var($requirements['page'], FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '99999999999999999']])) $requirements['page'] = 1;

  // Pagination calculation
  $begin = $requirements['page'] - 1;
  $end = 15;

  switch ($requirements['orders_number']) {
    case 30:
      $end = 30;
      break;
    case 60:
      $end = 60;
      break;
    default:
      $end = 30;
  }

  $begin = $begin * $end;
  $end = $begin + $end;

  try {
    $connection = create_pdo_object();

    // If there is a customer name or number phone to search, the clause is added
    $telname_clause = '';
    $requirements['nametelcustomer'] = trim($requirements['nametelcustomer']);
    if ($requirements['nametelcustomer'] !== '') $telname_clause = " AND (" . CUSTOMERS . ".namecustomer REGEXP :nametelcustomer OR " . CUSTOMERS . ".telcustomer REGEXP :nametelcustomer)";

    // Date clauses
    $datebegin_clause = '';
    if (array_key_exists('datebegin', $requirements)) $datebegin_clause = " AND " . ORDERS_SOLD . ".dateordersold >= :datebegin";

    $dateend_clause = '';
    if (array_key_exists('dateend', $requirements)) $dateend_clause = " AND " . ORDERS_SOLD . ".dateordersold <= :dateend";

    // SQL Query to search products ordered by their id
    $query = $connection->prepare("SELECT " . ORDERS_SOLD . ".codordersold, " . ORDERS_SOLD . ".idordersold, " . ORDERS_SOLD . ".dateordersold, " . ORDERS_SOLD .
      ".hourordersold, " . CUSTOMERS . ".namecustomer, " . CUSTOMERS . ".telcustomer FROM " . ORDERS_SOLD . " JOIN " . ORDERS . " ON " . ORDERS_SOLD . ".codorder = " . ORDERS .
      ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer WHERE " . CUSTOMERS . ".coduser = :coduser" . $telname_clause .
      $datebegin_clause . $dateend_clause . " LIMIT :begin, :end");

    // Parameters binding and execution
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
    $query->bindParam(':begin', $begin, PDO::PARAM_INT);
    $query->bindParam(':end', $end, PDO::PARAM_INT);
    if ($requirements['nametelcustomer'] !== '') $query->bindParam(':nametelcustomer', $requirements['nametelcustomer'], PDO::PARAM_STR);
    if (array_key_exists('datebegin', $requirements)) $query->bindParam(':datebegin', $requirements['datebegin'], PDO::PARAM_STR);
    if (array_key_exists('dateend', $requirements)) $query->bindParam(':dateend', $requirements['dateend'], PDO::PARAM_STR);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {
      $answer = array('sold_orders' => $result);
    } else {
      $answer = array('message' => 'No hay pedidos vendidos coincidentes');
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
 * Function to obtain a sold order added by a user
 * @param integer $codorder
 * @return array
 */
function obtain_sold_order($codordersold)
{
  // Requirements control
  if (!filter_var($codordersold, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'El código de pedido es inválido');

  try {
    $connection = create_pdo_object();

    // SQL Query to search active orders
    $query = $connection->prepare("SELECT " . ORDERS_SOLD . ".codordersold, " . ORDERS_SOLD . ".idordersold, " . ORDERS_SOLD . ".dateordersold, " . ORDERS_SOLD . ".moneyreceived, " .
      ORDERS_SOLD . ".hourordersold, " . ORDERS . ".dateorder, " . ORDERS . ".hourorder, " . ORDERS . ".pickuptime, " . CUSTOMERS . ".codcustomer, " . CUSTOMERS . ".namecustomer, " . CUSTOMERS .
      ".telcustomer FROM " . ORDERS_SOLD . " JOIN " . ORDERS . " ON " . ORDERS_SOLD . ".codorder = " . ORDERS . ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " .
      CUSTOMERS . ".codcustomer WHERE " . ORDERS_SOLD . ".codordersold = :codordersold AND " . CUSTOMERS . ".coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':codordersold', $codordersold, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {

      $answer = array('order_sold' => $result);
      $query->closeCursor();

      // SQL Query to search the products of the order
      $query = $connection->prepare("SELECT " . ORDERS_CONTAIN . ".codproduct, " . PRODUCTS . ".nameproduct, " . PRODUCTS . ".priceproduct, " . PRODUCTS . ".stockproduct, " .
        ORDERS_CONTAIN . ".amountproductorder FROM " . ORDERS_CONTAIN . " JOIN " . PRODUCTS . " ON " . ORDERS_CONTAIN . ".codproduct = " . PRODUCTS . ".codproduct JOIN " .
        ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS . ".codorder JOIN " . ORDERS_SOLD . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS_SOLD .
        ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer WHERE " . ORDERS_SOLD . ".codordersold = :codordersold AND " .
        CUSTOMERS . ".coduser = :coduser");

      // Parameters binding and execution
      $query->bindParam(':codordersold', $codordersold, PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_ASSOC);
      if ($result) $answer['order_sold'][0]['products'] = $result;
    } else {
      $answer = array('message' => 'El pedido vendido no existe');
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
 * Function to convert a draft into an order
 * @param integer $coddraft
 * @return array
 */
function add_order(int $coddraft): array
{
  // Requirements control
  if (!filter_var(
    $coddraft,
    FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']])
  ) {
    return array('message' => 'El código de borrador es inválido');
  }

  try {
    $connection = create_pdo_object();

    // SQL Query to search customers in alphabetic order
    $query = $connection->prepare("SELECT " . DRAFTS . ".coddraft, " . DRAFTS . ".namecustomertmp, " . DRAFTS .
      ".telcustomertmp, " . DRAFTS . ".pickuptime, " . DRAFTS . ".codcustomer, " . CUSTOMERS . ".namecustomer, " .
      CUSTOMERS . ".telcustomer FROM " . DRAFTS . " LEFT JOIN " . CUSTOMERS . " ON " . DRAFTS . ".codcustomer = " .
      CUSTOMERS . ".codcustomer WHERE " . DRAFTS . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    if ($result) {

      $draft = array('draft' => $result);
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
      if ($result) {
        $draft['draft'][0]['products'] = $result;
      } else {
        clear_query_data($query, $connection);
        return array('message' => 'Un pedido no puede estar vacío');
      }
    } else {
      clear_query_data($query, $connection);
      return array('message' => 'El borrador no existe');
    }

    $query->closeCursor();

    if ($draft['draft'][0]['namecustomertmp'] === null && $draft['draft'][0]['telcustomertmp'] === null &&
      $draft['draft'][0]['codcustomer'] === null) {
      $connection = null;
      return array('message' => 'Un pedido debe pertenecer a un cliente');
    }

    if ($draft['draft'][0]['codcustomer'] === null && $draft['draft'][0]['namecustomertmp'] === null &&
      $draft['draft'][0]['telcustomertmp'] !== null) {
      $connection = null;
      return array('message' => 'Un cliente debe tener un nombre');
    }

    if ($draft['draft'][0]['codcustomer'] === null && $draft['draft'][0]['namecustomertmp'] !== null &&
      $draft['draft'][0]['telcustomertmp'] === null) {
      $connection = null;
      return array('message' => 'Un cliente debe tener un número de teléfono');
    }

    if ($draft['draft'][0]['telcustomertmp'] !== null
      && !preg_match('#^[6-9](\d){8}$#', $draft['draft'][0]['telcustomertmp'])) {
      $connection = null;
      return array('message' => 'El número de teléfono no es válido');
    }

    if ($draft['draft'][0]['namecustomertmp'] !== null && trim($draft['draft'][0]['namecustomertmp']) === '') {
      $connection = null;
      return array('message' => 'El nombre del cliente no es válido');
    }

    // SQL Query to search a new primary key
    $query = $connection->prepare("SELECT MAX(codorder) FROM " . ORDERS);
    $query->execute();
    $codorder = $query->fetch()[0];
    $query->closeCursor();
    $codorder = $codorder + 1;

    if ($codorder > 9223372036854775808) {
      $connection = null;
      return array('overflow' => 'The order list is full. Contact the administrator');
    }

    $query = $connection->prepare("SELECT max(" . ORDERS . ".numdayorder) FROM " . ORDERS . " JOIN " .
      CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer WHERE " . CUSTOMERS .
      ".coduser = :coduser AND " . ORDERS . ".dateorder = (CURDATE())");

    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
    $query->execute();
    $numdayorder = $query->fetch()[0];
    $query->closeCursor();
    $numdayorder = $numdayorder + 1;

    if ($numdayorder > 8388607) {
      $connection = null;
      return array('overflow' => 'The order list is full for today. Contact the administrator');
    }

    if ($draft['draft'][0]['codcustomer'] == null) {
      $query = $connection->prepare("SELECT MAX(codcustomer) FROM " . CUSTOMERS);
      $query->execute();
      $codcustomer = $query->fetch()[0];
      $query->closeCursor();
      $codcustomer = $codcustomer + 1;

      if ($codcustomer > 9223372036854775808) {
        $connection = null;
        return array('overflow' => 'The customer list is full. Contact the administrator');
      }
    }
  } catch (PDOException $e) {
    $query?->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection->beginTransaction();
  try {
    if ($draft['draft'][0]['codcustomer'] === null) {
      // SQL Query to insert a customer
      $query = $connection->prepare("INSERT INTO " . CUSTOMERS .
        " (codcustomer, namecustomer, telcustomer, coduser) VALUES " .
        "(:codcustomer, :namecustomer, :telcustomer, :coduser)");

      // Parameters binding and execution
      $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
      $query->bindParam(':namecustomer', $draft['draft'][0]['namecustomertmp']);
      $query->bindParam(':telcustomer', $draft['draft'][0]['telcustomertmp'], PDO::PARAM_STR_CHAR);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $query->closeCursor();
    }

    $pickuptime_clause = array("", "");
    if ($draft['draft'][0]['pickuptime'] !== null) {
      $pickuptime_clause[0] = ", pickuptime";
      $pickuptime_clause[1] = ", :pickuptime";
    }

    $query = $connection->prepare("INSERT INTO " . ORDERS . " (codorder, numdayorder" . $pickuptime_clause[0] .
      ", codcustomer) VALUES " . "(:codorder, :numdayorder" . $pickuptime_clause[1] . ", :codcustomer)");

    $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
    $query->bindParam(':numdayorder', $numdayorder, PDO::PARAM_INT);

    if ($draft['draft'][0]['codcustomer'] === null) {
      $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
    } else {
      $query->bindParam(':codcustomer', $draft['draft'][0]['codcustomer'], PDO::PARAM_INT);
    }

    if ($draft['draft'][0]['pickuptime'] !== null) {
      $query->bindParam(':pickuptime', $draft['draft'][0]['pickuptime']);
    }

    $query->execute();
    $query->closeCursor();

    // Products insertion
    if (array_key_exists('products', $draft['draft'][0])) {
      foreach ($draft['draft'][0]['products'] as $draft_product) {
        // SQL Query to add product records to the order
        $query = $connection->prepare("INSERT INTO " . ORDERS_CONTAIN .
          " (codproduct, codorder, amountproductorder) VALUES (:codproduct, :codorder, :amountproductorder)");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $draft_product['codproduct'], PDO::PARAM_INT);
        $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
        $query->bindParam(':amountproductorder', $draft_product['amountproductdraft'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();

        // SQL Query to update the products stock if needed
        if ($draft_product['stockproduct'] !== null) {
          $query = $connection->prepare("UPDATE " . PRODUCTS .
            " SET stockproduct = :stockproduct WHERE codproduct = :codproduct");

          if ($draft_product['stockproduct'] >= $draft_product['amountproductdraft']) {
            $new_stock = $draft_product['stockproduct'] - $draft_product['amountproductdraft'];
          } else {
            $connection->rollBack();
            $connection = null;
            return array('message' => 'El producto ' . $draft_product['nameproduct'] . ' no tiene suficiente stock');
          }

          $query->bindParam(':codproduct', $draft_product['codproduct'], PDO::PARAM_INT);
          $query->bindParam(':stockproduct', $new_stock, PDO::PARAM_INT);

          $query->execute();
          $query->closeCursor();
        }
      }
    }

    // SQL Query to delete the draft products
    $query = $connection->prepare("DELETE " . DRAFTS_CONTAIN . " FROM " . DRAFTS_CONTAIN . " JOIN " . DRAFTS .
      " ON " . DRAFTS_CONTAIN . ".coddraft = " . DRAFTS . ".coddraft WHERE " . DRAFTS_CONTAIN .
      ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

    $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $query->closeCursor();

    // SQL Query to delete the draft
    $query = $connection->prepare("DELETE FROM " . DRAFTS . " WHERE coddraft = :coddraft AND coduser = :coduser");

    // Parameters binding and execution
    $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $query->closeCursor();
    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The order has been added correctly', 'codorder' => $codorder);
}

/**
 * Function to mark an order as sold
 * @param integer $codorder
 * @param float $moneyreceived
 * @return array
 */
function sell_order($codorder, $moneyreceived)
{
  // Requirements control
  if (!filter_var($codorder, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'El código de pedido es inválido');

  if ((!is_numeric($moneyreceived)) || $moneyreceived < 0 || round($moneyreceived, 2) > 999.99) return array('message' => 'The money received is invalid');
  $moneyreceived = round($moneyreceived, 2);

  try {
    // Check if the money received is enough
    $order = obtain_active_order($codorder);
    if (array_key_exists('message', $order)) return $order;
    $total_price = 0;
    foreach ($order['order'][0]['products'] as $product) $total_price += ($product['priceproduct'] * $product['amountproductorder']);
    if ($total_price > $moneyreceived) return array('message' => 'El dinero recibido es insuficiente');

    $connection = create_pdo_object();

    // SQL Query to search for a primary key
    $query = $connection->prepare("SELECT MAX(codordersold) FROM " . ORDERS_SOLD);
    $query->execute();
    $codordersold = $query->fetch()[0];
    $query->closeCursor();
    $codordersold = $codordersold + 1;

    if ($codordersold > 9223372036854775808) {
      $connection = null;
      return array('overflow' => 'The orders sold list is full. Contact the administrator');
    }

    // SQL Query to search for a unique id
    $query = $connection->prepare("SELECT MAX(CAST(idordersold AS SIGNED)) FROM " . ORDERS_SOLD);
    $query->execute();
    $idordersold = $query->fetch()[0];
    $query->closeCursor();
    $idordersold = $idordersold + 1;

    if ($codordersold > 999999) {
      $connection = null;
      return array('overflow' => 'The orders sold id list is full. Contact the administrator');
    }
    $idordersold = str_pad($idordersold, 6, '0', STR_PAD_LEFT);

    // SQL Query to set an order as sold
    $query = $connection->prepare("INSERT INTO " . ORDERS_SOLD . " (codordersold, idordersold, moneyreceived, codorder) VALUES (:codordersold, :idordersold, :moneyreceived, :codorder)");

    // Parameters binding and execution
    $query->bindParam(':codordersold', $codordersold, PDO::PARAM_INT);
    $query->bindParam(':idordersold', $idordersold, PDO::PARAM_STR_CHAR);
    $query->bindParam(':moneyreceived', $moneyreceived, PDO::PARAM_STR);
    $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);

    $query->execute();
    $query->closeCursor();
    $connection = null;
    return array('success_message' => 'The order has been marked as sold correctly');
  } catch (PDOException $e) {
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }
}

/**
 * Function to edit an order added by a user
 * @param array $input_data
 * @return array
 */
function edit_order($input_data)
{
  // Obtain the order data
  $order_data = obtain_active_order($input_data['codorder']);
  if (array_key_exists('message', $order_data)) return $order_data;

  // Requirements control
  if (!filter_var($input_data['codorder'], FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'El código de pedido es inválido');

  if ((array_key_exists('namecustomer', $input_data) || array_key_exists('telcustomer', $input_data)) && array_key_exists('codcustomer', $input_data))
    return array('message', 'El código de cliente no se puede insertar a la vez que los datos para añadir uno nuevo');

  if (array_key_exists('namecustomer', $input_data)) {
    $input_data['namecustomer'] = trim($input_data['namecustomer']);
    if (strlen($input_data['namecustomer']) > 60 || strlen($input_data['namecustomer']) == 0) return array('message' => 'El nombre de cliente no es válido');
  }

  if (array_key_exists('telcustomer', $input_data)) {
    $input_data['telcustomer'] = trim($input_data['telcustomer']);
    if (!preg_match('#^[6-9]([0-9]){8}$#', $input_data['telcustomer'])) return array('message' => 'El número de teléfono no es válido');
  }

  if (array_key_exists('pickuptime', $input_data)) {
    $input_data['pickuptime'] = trim($input_data['pickuptime']);
    if ((!validateTime($input_data['pickuptime'])) && $input_data['pickuptime'] != '') return array('message' => 'La hora de recogida no es válida');
  }

  if (array_key_exists('codcustomer', $input_data) && !filter_var($input_data['codcustomer'], FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'El código de cliente es inválido');

  if (!array_key_exists('codcustomer', $input_data) && !array_key_exists('namecustomer', $input_data) && array_key_exists('telcustomer', $input_data))
    return array('message' => 'Un cliente debe tener un nombre');

  if (!array_key_exists('codcustomer', $input_data) && array_key_exists('namecustomer', $input_data) && !array_key_exists('telcustomer', $input_data))
    return array('message' => 'Un cliente debe tener un número de teléfono');

  $validation = validate_order_product_list($input_data['products']);
  if (array_key_exists('message', $validation)) return $validation;

  $equal = 0;
  foreach ($input_data as $element => $value) {
    foreach ($order_data['order'][0] as $order_attr => $order_value) {
      if ($element == $order_attr && $value == $order_value) $equal = $equal + 1;
      if ($element == 'pickuptime' && $value != '' && $order_attr == 'pickuptime' && $value . ':00' == $order_value) $equal = $equal + 1;
    }
  }

  $equal_products = 0;
  foreach ($input_data['products'] as $product) {
    foreach ($order_data['order'][0]['products'] as $order_product) {
      if ($product['codproduct'] == $order_product['codproduct'] && $product['amountproduct'] == $order_product['amountproductorder'])
        $equal_products = $equal_products + 1;
    }
  }
  if ($equal_products == max(count($input_data['products']), count($order_data['order'][0]['products']))) $equal = $equal + 1;

  if ($equal == count($input_data)) return array('message' => 'No hay nada que cambiar');

  try {
    $connection = create_pdo_object();
    $connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    if (array_key_exists('codcustomer', $input_data) && $input_data['codcustomer'] != 0) {
      // SQL Query to check if the customer exists
      $query = $connection->prepare("SELECT codcustomer FROM " . CUSTOMERS . " WHERE codcustomer = :codcustomer AND coduser = :coduser");

      // Parameters binding and execution
      $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $result = $query->fetch(PDO::FETCH_ASSOC);
      $query->closeCursor();
      if (!$result) {
        $connection = null;
        return array('message' => 'El cliente no existe');
      }
    }
  } catch (PDOException $e) {
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection->beginTransaction();
  try {

    // SQL Query to insert a new customer
    if (array_key_exists('namecustomer', $input_data) || array_key_exists('telcustomer', $input_data)) {

      // SQL Query to find a primary key
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
      $query = $connection->prepare("INSERT INTO " . CUSTOMERS . " (codcustomer, namecustomer, telcustomer, coduser) VALUES " .
        "(:codcustomer, :namecustomer, :telcustomer, :coduser)");

      // Parameters binding and execution
      $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
      $query->bindParam(':namecustomer', $input_data['namecustomer'], PDO::PARAM_STR);
      $query->bindParam(':telcustomer', $input_data['telcustomer'], PDO::PARAM_STR_CHAR);
      $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

      $query->execute();
      $query->closeCursor();
    }

    // SQL Query to edit the order
    if (
      array_key_exists('namecustomer', $input_data) || array_key_exists('telcustomer', $input_data) || array_key_exists('codcustomer', $input_data) ||
      array_key_exists('pickuptime', $input_data)
    ) {

      $codcustomer_clause = '';
      if (array_key_exists('namecustomer', $input_data) || array_key_exists('telcustomer', $input_data) || array_key_exists('codcustomer', $input_data))
        $codcustomer_clause = "codcustomer = :codcustomer";

      $pickuptime_clause = '';
      if (array_key_exists('pickuptime', $input_data)) {
        if ($codcustomer_clause !== '') {
          $pickuptime_clause = ", pickuptime = :pickuptime";
        } else {
          $pickuptime_clause = "pickuptime = :pickuptime";
        }
      }

      $query = $connection->prepare("UPDATE " . ORDERS . " SET " . $codcustomer_clause . $pickuptime_clause . " WHERE codorder = :codorder");

      // Parameters binding and execution
      $query->bindParam(':codorder', $input_data['codorder'], PDO::PARAM_INT);

      if (array_key_exists('namecustomer', $input_data) || array_key_exists('telcustomer', $input_data) || array_key_exists('codcustomer', $input_data)) {
        if (array_key_exists('codcustomer', $input_data)) {
          $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
        } else {
          $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
        }
      }

      if (array_key_exists('pickuptime', $input_data)) {
        if ($input_data['pickuptime'] === '') {
          $query->bindValue(':pickuptime', NULL, PDO::PARAM_NULL);
        } else {
          $query->bindParam(':pickuptime', $input_data['pickuptime'], PDO::PARAM_STR);
        }
      }

      $query->execute();
      $query->closeCursor();
    }

    if ($equal_products != max(count($input_data['products']), count($order_data['order'][0]['products']))) {

      $codproducts_delete = [];
      foreach ($order_data['order'][0]['products'] as $order_product)
        array_push($codproducts_delete, $order_product['codproduct']);

      $codproducts_insert = [];
      foreach ($input_data['products'] as $product)
        array_push($codproducts_insert, $product['codproduct']);

      // Product elements modification
      foreach ($input_data['products'] as $product) {
        foreach ($order_data['order'][0]['products'] as $order_product) {
          if ($product['codproduct'] == $order_product['codproduct']) {

            if (($key = array_search($product['codproduct'], $codproducts_insert)) !== false) unset($codproducts_insert[$key]);
            if (($key = array_search($order_product['codproduct'], $codproducts_delete)) !== false) unset($codproducts_delete[$key]);

            if ($product['amountproduct'] != $order_product['amountproductorder']) {
              // SQL Query to add product records to the order
              $query = $connection->prepare("UPDATE " . ORDERS_CONTAIN . " SET amountproductorder = :amountproductorder WHERE codproduct = :codproduct " .
                "AND codorder = :codorder");

              // Parameters binding and execution
              $query->bindParam(':codproduct', $order_product['codproduct'], PDO::PARAM_INT);
              $query->bindParam(':codorder', $input_data['codorder'], PDO::PARAM_INT);
              $query->bindParam(':amountproductorder', $product['amountproduct'], PDO::PARAM_INT);

              $query->execute();
              $query->closeCursor();

              // SQL Query to obtain the product stock
              $query = $connection->prepare("SELECT stockproduct FROM " . PRODUCTS . " WHERE codproduct = :codproduct AND coduser = :coduser");

              // Parameters binding and execution
              $query->bindParam(':codproduct', $order_product['codproduct'], PDO::PARAM_INT);
              $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

              $query->execute();
              $result = array_values($query->fetch(PDO::FETCH_ASSOC));
              $stockproduct = $result[0];
              $nameproduct = $result[1];
              $query->closeCursor();

              // SQL Query to update the products stock if needed
              if ($stockproduct !== null) {
                if ($product['amountproduct'] > $order_product['amountproductorder']) {

                  $query = $connection->prepare("UPDATE " . PRODUCTS . " SET stockproduct = :stockproduct WHERE codproduct = :codproduct");

                  if (($stockproduct + $order_product['amountproductorder']) >= $product['amountproduct']) {
                    $new_stock = $stockproduct - $product['amountproduct'] + $order_product['amountproductorder'];
                  } else {
                    $connection->rollBack();
                    $connection = null;
                    return array('message' => 'El producto ' . $nameproduct . ' no tiene suficiente stock');
                  }

                  $query->bindParam(':codproduct', $order_product['codproduct'], PDO::PARAM_INT);
                  $query->bindParam(':stockproduct', $new_stock, PDO::PARAM_INT);

                  $query->execute();
                  $query->closeCursor();
                }

                if ($product['amountproduct'] < $order_product['amountproductorder']) {
                  $query = $connection->prepare("UPDATE " . PRODUCTS . " SET stockproduct = :stockproduct WHERE codproduct = :codproduct");

                  $new_stock = $stockproduct - $product['amountproduct'] + $order_product['amountproductorder'];

                  $query->bindParam(':codproduct', $order_product['codproduct'], PDO::PARAM_INT);
                  $query->bindParam(':stockproduct', $new_stock, PDO::PARAM_INT);

                  $query->execute();
                  $query->closeCursor();
                }
              }
            }
          }
        }
      }

      $products_delete = [];
      foreach ($order_data['order'][0]['products'] as $order_product) {
        if (in_array($order_product['codproduct'], $codproducts_delete)) array_push($products_delete, $order_product);
      }

      $products_insert = [];
      foreach ($input_data['products'] as $product) {
        if (in_array($product['codproduct'], $codproducts_insert)) array_push($products_insert, $product);
      }

      // Product elements insertion
      foreach ($products_insert as $product_insert) {
        // SQL Query to add product records to the order
        $query = $connection->prepare("INSERT INTO " . ORDERS_CONTAIN . " (codproduct, codorder, amountproductorder) VALUES (:codproduct, :codorder, :amountproductorder)");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $product_insert['codproduct'], PDO::PARAM_INT);
        $query->bindParam(':codorder', $input_data['codorder'], PDO::PARAM_INT);
        $query->bindParam(':amountproductorder', $product_insert['amountproduct'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();

        // SQL Query to obtain the product stock
        $query = $connection->prepare("SELECT stockproduct FROM " . PRODUCTS . " WHERE codproduct = :codproduct AND coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $product_insert['codproduct'], PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $result = array_values($query->fetch(PDO::FETCH_ASSOC));
        $stockproduct = $result[0];
        $nameproduct = $result[1];
        $query->closeCursor();

        // SQL Query to update the products stock if needed
        if ($stockproduct !== null) {
          $query = $connection->prepare("UPDATE " . PRODUCTS . " SET stockproduct = :stockproduct WHERE codproduct = :codproduct");

          if ($stockproduct >= $product_insert['amountproduct']) {
            $new_stock = $stockproduct - $product_insert['amountproduct'];
          } else {
            $connection->rollBack();
            $connection = null;
            return array('message' => 'El producto ' . $nameproduct . ' no tiene suficiente stock');
          }

          $query->bindParam(':codproduct', $product_insert['codproduct'], PDO::PARAM_INT);
          $query->bindParam(':stockproduct', $new_stock, PDO::PARAM_INT);

          $query->execute();
          $query->closeCursor();
        }
      }

      // Product elements deletion
      foreach ($products_delete as $product_delete) {
        // SQL Query to add product records to the order
        $query = $connection->prepare("DELETE FROM " . ORDERS_CONTAIN . " WHERE codproduct = :codproduct AND codorder = :codorder");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $product_delete['codproduct'], PDO::PARAM_INT);
        $query->bindParam(':codorder', $input_data['codorder'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();

        // SQL Query to obtain the product stock
        $query = $connection->prepare("SELECT stockproduct FROM " . PRODUCTS . " WHERE codproduct = :codproduct AND coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $product_delete['codproduct'], PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $result = array_values($query->fetch(PDO::FETCH_ASSOC));
        $stockproduct = $result[0];
        $nameproduct = $result[1];
        $query->closeCursor();

        // SQL Query to update the products stock if needed
        if ($stockproduct !== null) {
          $query = $connection->prepare("UPDATE " . PRODUCTS . " SET stockproduct = :stockproduct WHERE codproduct = :codproduct");

          $new_stock = $stockproduct + $product_delete['amountproductorder'];

          $query->bindParam(':codproduct', $product_delete['codproduct'], PDO::PARAM_INT);
          $query->bindParam(':stockproduct', $new_stock, PDO::PARAM_INT);

          $query->execute();
          $query->closeCursor();
        }
      }
    }

    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The order has been edited correctly');
}

/**
 * Function to delete an active order added by a user
 * @param integer $codorder
 * @return array
 */
function delete_order($codorder)
{
  // Requirements control
  if (!filter_var($codorder, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
    return array('message' => 'El código de pedido es inválido');

  try {
    // Transaction to completely delete an order
    $connection = create_pdo_object();
    $connection->beginTransaction();

    // SQL Query to delete the order products data
    $query = $connection->prepare("SELECT " . ORDERS_CONTAIN . ".codproduct, " . ORDERS_CONTAIN . ".amountproductorder, " . PRODUCTS . ".stockproduct FROM " .
      ORDERS_CONTAIN . " JOIN " . PRODUCTS . " ON " . ORDERS_CONTAIN . ".codproduct = " . PRODUCTS . ".codproduct JOIN " . ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS .
      ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD .
      ".codorder WHERE " . ORDERS_CONTAIN . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD . ".codordersold IS NULL");

    // Parameters binding and execution
    $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $products = $query->fetchAll(PDO::FETCH_ASSOC);
    $query->closeCursor();

    foreach ($products as $product) {
      // SQL Query to update the products stock if needed
      if ($product['stockproduct'] !== null) {
        $query = $connection->prepare("UPDATE " . PRODUCTS . " SET stockproduct = :stockproduct WHERE codproduct = :codproduct");

        $new_stock = $product['stockproduct'] + $product['amountproductorder'];

        $query->bindParam(':codproduct', $product['codproduct'], PDO::PARAM_INT);
        $query->bindParam(':stockproduct', $new_stock, PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();
      }
    }

    // SQL Query to delete the order products
    $query = $connection->prepare("DELETE " . ORDERS_CONTAIN . " FROM " . ORDERS_CONTAIN . " JOIN " . ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS . ".codorder JOIN " .
      CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD . ".codorder WHERE " .
      ORDERS_CONTAIN . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD . ".codordersold IS NULL");

    $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $query->closeCursor();

    // SQL Query to delete an order
    $query = $connection->prepare("DELETE " . ORDERS . " FROM " . ORDERS . " JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " .
      ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD . ".codorder WHERE " . ORDERS . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser AND " .
      ORDERS_SOLD . ".codordersold IS NULL");

    // Parameters binding and execution
    $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $rows_affected = $query->rowCount();
    if ($rows_affected == 0) {
      $query->closeCursor();
      $connection = null;
      return array('message' => 'El pedido no existe');
    }

    $query->closeCursor();
    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The order has been deleted correctly');
}

/**
 * Function to delete all the unclaimed orders of a user
 * @return array
 */
function delete_all_unclaimed_orders()
{
  try {
    // Transaction to completely delete an order
    $connection = create_pdo_object();
    $connection->beginTransaction();

    // SQL Query to search unclaimed active orders
    $query = $connection->prepare("SELECT " . ORDERS . ".codorder, " . ORDERS . ".numdayorder, " . ORDERS . ".dateorder, " . ORDERS . ".hourorder, " .
      ORDERS . ".codcustomer, " . CUSTOMERS . ".namecustomer, " . CUSTOMERS . ".telcustomer FROM " . ORDERS . " JOIN " . CUSTOMERS . " ON " .
      ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD . ".codorder WHERE " .
      CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD . ".codordersold IS NULL AND " . ORDERS . ".dateorder <> (CURDATE()) ORDER BY " . ORDERS . ".dateorder DESC");

    // Parameters binding and execution
    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    $query->closeCursor();

    if ($result) {
      foreach ($result as $order) {

        // SQL Query to delete the order products data
        $query = $connection->prepare("SELECT " . ORDERS_CONTAIN . ".codproduct, " . ORDERS_CONTAIN . ".amountproductorder, " . PRODUCTS . ".stockproduct FROM " .
          ORDERS_CONTAIN . " JOIN " . PRODUCTS . " ON " . ORDERS_CONTAIN . ".codproduct = " . PRODUCTS . ".codproduct JOIN " . ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS .
          ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD .
          ".codorder WHERE " . ORDERS_CONTAIN . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD . ".codordersold IS NULL");

        // Parameters binding and execution
        $query->bindParam(':codorder', $order['codorder'], PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $products = $query->fetchAll(PDO::FETCH_ASSOC);
        $query->closeCursor();

        foreach ($products as $product) {
          // SQL Query to update the products stock if needed
          if ($product['stockproduct'] !== null) {
            $query = $connection->prepare("UPDATE " . PRODUCTS . " SET stockproduct = :stockproduct WHERE codproduct = :codproduct");

            $new_stock = $product['stockproduct'] + $product['amountproductorder'];

            $query->bindParam(':codproduct', $product['codproduct'], PDO::PARAM_INT);
            $query->bindParam(':stockproduct', $new_stock, PDO::PARAM_INT);

            $query->execute();
            $query->closeCursor();
          }
        }

        // SQL Query to delete the order products
        $query = $connection->prepare("DELETE " . ORDERS_CONTAIN . " FROM " . ORDERS_CONTAIN . " JOIN " . ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS . ".codorder JOIN " .
          CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " . ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD . ".codorder WHERE " .
          ORDERS_CONTAIN . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS_SOLD . ".codordersold IS NULL");

        $query->bindParam(':codorder', $order['codorder'], PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();

        // SQL Query to delete an order
        $query = $connection->prepare("DELETE " . ORDERS . " FROM " . ORDERS . " JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer LEFT JOIN " .
          ORDERS_SOLD . " ON " . ORDERS . ".codorder = " . ORDERS_SOLD . ".codorder WHERE " . ORDERS . ".codorder = :codorder AND " . CUSTOMERS . ".coduser = :coduser AND " .
          ORDERS_SOLD . ".codordersold IS NULL");

        // Parameters binding and execution
        $query->bindParam(':codorder', $order['codorder'], PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();
      }
    } else {
      $connection = null;
      return array('message' => 'No hay pedidos sin reclamar');
    }

    $connection->commit();
  } catch (PDOException $e) {
    $connection->rollBack();
    if ($query !== null) $query->closeCursor();
    $connection = null;
    return process_pdo_exception($e);
  }

  $connection = null;
  return array('success_message' => 'The orders have been deleted correctly');
}
