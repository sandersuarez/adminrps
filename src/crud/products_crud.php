<?php

/**
 * Function to obtain products added by a user that meet certain requirements and according to paging
 * @param array $requirements
 */
function obtain_products($requirements)
{
    // Requirements control
    if ((!is_numeric($requirements['page'])) || $requirements['page'] < 1) {
        // If the page number is invalid its value will be the default
        $requirements['page'] = 1;
    }

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
        if ($requirements['name'] != '' && $requirements['name'] != '000nothing_in_here000') {
            $name_clause = " AND (nameproduct REGEXP :nameproduct)";
        }

        // SQL Query to search products in alphabetic order
        $query = $connection->prepare("SELECT codproduct, nameproduct, stockproduct, priceproduct FROM " . PRODUCTS . " WHERE coduser = :coduser" . $name_clause .
            " ORDER BY nameproduct LIMIT :begin, :end");

        // Parameters binding and execution
        $coduser = $_SESSION['coduser'];
        $query->bindParam(':coduser', $coduser, PDO::PARAM_INT);
        $query->bindParam(':begin', $begin, PDO::PARAM_INT);
        $query->bindParam(':end', $end, PDO::PARAM_INT);

        if ($requirements['name'] != '' && $requirements['name'] != '000nothing_in_here000') {
            $query->bindParam(':nameproduct', $name_clause, PDO::PARAM_STR);
        }

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
 */
function obtain_product($codproduct)
{
    // Requirements control
    if ((!is_numeric($codproduct)) || $codproduct < 1) return array("mensaje" => "El código de libro especificado no es válido");

    try {
        // SQL Query to search products in alphabetic order
        $connection = create_pdo_object();
        $query = $connection->prepare("SELECT codproduct, nameproduct, stockproduct, priceproduct FROM " . PRODUCTS . " WHERE coduser = :coduser AND codproduct = :codproduct");

        // Parameters binding and execution
        $coduser = $_SESSION['coduser'];
        $query->bindParam(':coduser', $coduser, PDO::PARAM_INT);
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
 */
function add_product($input_data)
{
}

/**
 * Function to edit a product added by a user
 * @param array $input_data
 */
function edit_product($input_data)
{
}

/**
 * Function to delete a product added by a user
 * @param integer $codproduct
 */
function delete_product($codproduct)
{
}
