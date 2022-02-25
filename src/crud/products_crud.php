<?php

/**
 * Function to obtain products added by a user that meet certain requirements and according to paging
 * @param array $requirements
 * @return array
 */
function obtain_products($requirements)
{
    // If the page number is invalid its value will be the default
    if ((!filter_var($requirements['page'], FILTER_VALIDATE_INT)) || $requirements['page'] < 1) $requirements['page'] = 1;

    // Paging calculation
    $begin = $requirements['page'] - 1;
    $end = 15;

    switch ($requirements['products_number']) {
        case 15:
            $end = 15;
            break;
        case 30:
            $end = 30;
            break;
        default:
            $end = 15;
    }

    $begin = $begin * $end;
    $end = $begin + $end;

    try {
        $connection = create_pdo_object();

        // If there is a product name to search, the clause is added
        $name_clause = '';
        $requirements['name'] = trim($requirements['name']);
        if ($requirements['name'] != '') $name_clause = " AND (nameproduct REGEXP :nameproduct)";

        // SQL Query to search products in alphabetic order
        $query = $connection->prepare("SELECT codproduct, nameproduct, stockproduct, priceproduct FROM " . PRODUCTS . " WHERE coduser = :coduser" . $name_clause .
            " ORDER BY nameproduct LIMIT :begin, :end");

        // Parameters binding and execution
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
        $query->bindParam(':begin', $begin, PDO::PARAM_INT);
        $query->bindParam(':end', $end, PDO::PARAM_INT);

        if ($requirements['name'] != '') $query->bindParam(':nameproduct', $name_clause, PDO::PARAM_STR);

        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            $answer = array('products' => $result);
        } else {
            $answer = array('message' => 'There are no coincident products');
        }

        clear_query_data($query, $connection);
        return $answer;
    } catch (PDOException $e) {
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
    if ((!filter_var($codproduct, FILTER_VALIDATE_INT)) || $codproduct < 1) return array('message' => 'The product code is invalid');

    try {
        // SQL Query to search products in alphabetic order
        $connection = create_pdo_object();
        $query = $connection->prepare("SELECT codproduct, nameproduct, stockproduct, priceproduct FROM " . PRODUCTS . " WHERE coduser = :coduser AND codproduct = :codproduct");

        // Parameters binding and execution
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
        $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);

        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            $answer = array('product' => $result);
        } else {
            $answer = array('message' => 'There is no coincident product');
        }

        clear_query_data($query, $connection);
        return $answer;
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}

/**
 * Function to add a new product for a user
 * @param array $input_data
 * @return array
 */
function add_product($input_data)
{
    // Requirements control
    $input_data['nameproduct'] = trim($input_data['nameproduct']);
    if ($input_data['nameproduct'] == '') return array('message' => 'The product name is required');
    if (strlen($input_data['nameproduct']) > 240) return array('message' => 'The product name is invalid');

    if ((!is_numeric($input_data['priceproduct'])) || $input_data['priceproduct'] < 0 || round($input_data['priceproduct'], 2) > 999.99) return array('message' => 'The price is invalid');
    $input_data['priceproduct'] = round($input_data['priceproduct'], 2);

    if (
        array_key_exists('stockproduct', $input_data) &&
        ((!filter_var($input_data['stockproduct'], FILTER_VALIDATE_INT)) || $input_data['stockproduct'] < 0 || $input_data['stockproduct'] > 2147483647)
    )
        return array('message' => 'The stock is invalid');

    try {

        // SQL Query to search a new primary key
        $connection = create_pdo_object();
        $query = $connection->prepare("SELECT max(codproduct) FROM " . PRODUCTS);
        $query->execute();
        $codproduct = $query->fetch()[0];
        $query->closeCursor();
        $codproduct = $codproduct + 1;

        if ($codproduct > 2147483647) return array('overflow' => 'The product list is full. Contact the administrator');

        // SQL Query to insert a product
        if (array_key_exists('stockproduct', $input_data)) {
            $query = $connection->prepare("INSERT INTO " . PRODUCTS . " (codproduct, nameproduct, stockproduct, priceproduct, coduser) VALUES " .
                "(:codproduct, :nameproduct, :stockproduct, :priceproduct, :coduser)");
        } else {
            $query = $connection->prepare("INSERT INTO " . PRODUCTS . " (codproduct, nameproduct, priceproduct, coduser) VALUES " .
                "(:codproduct, :nameproduct, :priceproduct, :coduser)");
        }

        // Parameters binding and execution
        $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
        $query->bindParam(':nameproduct', $input_data['nameproduct'], PDO::PARAM_STR);
        $query->bindParam(':priceproduct', $input_data['priceproduct'], PDO::PARAM_STR);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
        if (array_key_exists('stockproduct', $input_data)) $query->bindParam(':stockproduct', $input_data['stockproduct'], PDO::PARAM_INT);

        $query->execute();

        $connection = null;
        return array('success_message' => 'The product has been added correctly');
    } catch (PDOException $e) {
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
        if ($input_data['nameproduct'] == '') return array('message' => 'The product name is required');
        if (strlen($input_data['nameproduct']) > 240) return array('message' => 'The product name is invalid');
    }

    if (array_key_exists('priceproduct', $input_data)) {
        if ((!is_numeric($input_data['priceproduct'])) || $input_data['priceproduct'] < 0 || round($input_data['priceproduct'], 2) > 999.99) return array('message' => 'The price is invalid');
        $input_data['priceproduct'] = round($input_data['priceproduct'], 2);
    }

    if (
        array_key_exists('stockproduct', $input_data) &&
        (((!filter_var($input_data['stockproduct'], FILTER_VALIDATE_INT)) || $input_data['stockproduct'] < 0 || $input_data['stockproduct'] > 2147483647) && $input_data['stockproduct'] != 'null')
    )
        return array('message' => 'The stock is invalid');

    if ((!filter_var($input_data['codproduct'], FILTER_VALIDATE_INT)) || $input_data['codproduct'] < 1) return array('message' => 'The product code is invalid');

    // Obtain the product data
    $product_data = obtain_product($input_data['codproduct']);
    if (array_key_exists('message', $product_data)) return $product_data;
    $equal = 0;
    foreach ($input_data as $element => $value) {
        foreach ($product_data['product'] as $product_attr => $product_value) {
            if ($element == $product_attr && ($value == $product_value || ($value == 'null' && $product_value == null))) {
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
            if ($nameproduct_clause != '') {
                $stockproduct_clause = ", stockproduct = :stockproduct";
            } else {
                $stockproduct_clause = "stockproduct = :stockproduct";
            }
        }

        $priceproduct_clause = '';
        if (array_key_exists('priceproduct', $input_data)) {
            if ($stockproduct_clause != '' || $nameproduct_clause != '') {
                $priceproduct_clause = ", priceproduct = :priceproduct";
            } else {
                $priceproduct_clause = "priceproduct = :priceproduct";
            }
        }

        $query = $connection->prepare("UPDATE " . PRODUCTS . " SET " . $nameproduct_clause . $stockproduct_clause . $priceproduct_clause . " WHERE codproduct = :codproduct AND coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $input_data['codproduct'], PDO::PARAM_INT);
        if (array_key_exists('nameproduct', $input_data)) $query->bindParam(':nameproduct', $input_data['nameproduct'], PDO::PARAM_STR);
        if (array_key_exists('priceproduct', $input_data)) $query->bindParam(':priceproduct', $input_data['priceproduct'], PDO::PARAM_STR);
        if (array_key_exists('stockproduct', $input_data)) {
            if ($input_data['stockproduct'] == 'null') {
                $query->bindValue(':stockproduct', NULL, PDO::PARAM_NULL);
            } else {
                $query->bindParam(':stockproduct', $input_data['stockproduct'], PDO::PARAM_INT);
            }
        }
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();

        $connection = null;
        return array('success_message' => 'The product has been edited correctly');
    } catch (PDOException $e) {
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
    if ((!filter_var($codproduct, FILTER_VALIDATE_INT)) || $codproduct < 1) return array('message' => 'The product code is invalid');

    try {
        // SQL Query to delete a product
        $connection = create_pdo_object();
        $query = $connection->prepare("DELETE FROM " . PRODUCTS . " WHERE codproduct = :codproduct AND coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':codproduct', $codproduct, PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $rows_affected = $query->rowCount();
        if ($rows_affected == 0) {
            return array('message' => 'There is no coincident product');
        }

        $connection = null;
        return array('success_message' => 'The product has been deleted correctly');
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}
