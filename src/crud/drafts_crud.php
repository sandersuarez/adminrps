<?php

/**
 * Function to obtain order drafts added by a user
 * @return array
 */
function obtain_drafts()
{
    try {
        $connection = create_pdo_object();

        // SQL Query to search customers in alphabetic order
        $query = $connection->prepare("SELECT orders.codorder, customers.namecustomer, customers.telcustomer FROM " . ORDERS .
            " LEFT JOIN customers ON orders.codcustomer = customers.codcustomer WHERE orders.orderisdraft = 1 AND orders.coduser = :coduser ORDER BY orders.codorder DESC");

        // Parameters binding and execution
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            $answer = array('drafts' => $result);
        } else {
            $answer = array('message' => 'There are no drafts');
        }

        clear_query_data($query, $connection);
        return $answer;
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}

/**
 * Function to add a new order draft for a user
 * @param array $input_data
 * @return array
 */
function add_draft($input_data)
{
    // Requirements control
    if (array_key_exists('codcustomer', $input_data) && ((!filter_var($input_data['codcustomer'], FILTER_VALIDATE_INT)) || $input_data['codcustomer'] < 1))
        return array('message' => 'The customer code is invalid');

    if (array_key_exists('products', $input_data)) {
        $validation = validate_order_product_list($input_data['products']);
        if (array_key_exists('message', $validation)) return $validation;
    }

    try {
        $connection = create_pdo_object();
        if (array_key_exists('codcustomer', $input_data)) {
            // SQL Query to check if the customer exists
            $query = $connection->prepare("SELECT codcustomer FROM " . CUSTOMERS . " WHERE codcustomer = :codcustomer AND coduser = :coduser");

            // Parameters binding and execution
            $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
            $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

            $query->execute();
            $result = $query->fetch(PDO::FETCH_ASSOC);
            if (!$result) return array('message' => 'The customer does not exists');
            $query->closeCursor();
        }

        // SQL Query to search a new primary key
        $query = $connection->prepare("SELECT max(codorder) FROM " . ORDERS);
        $query->execute();
        $codorder = $query->fetch()[0];
        $query->closeCursor();
        $codorder = $codorder + 1;

        if ($codorder > 2147483647) return array('overflow' => 'The order list is full. Contact the administrator');
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }

    $connection->beginTransaction();
    try {

        // SQL Query to add a new draft
        if (array_key_exists('codcustomer', $input_data)) {
            $query = $connection->prepare("INSERT INTO " . ORDERS . " (codorder, codcustomer, coduser) VALUES (:codorder, :codcustomer, :coduser)");
        } else {
            $query = $connection->prepare("INSERT INTO " . ORDERS . " (codorder, coduser) VALUES (:codorder, :coduser)");
        }

        // Parameters binding and execution
        $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
        if (array_key_exists('codcustomer', $input_data)) $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();

        if (array_key_exists('products', $input_data)) {
            foreach ($input_data['products'] as $index => $product) {
                // SQL Query to add product records to the order
                $query = $connection->prepare("INSERT INTO " . CONTAIN . " (codproduct, codorder, amountproductorder) VALUES (:codproduct, :codorder, :amountproductorder)");

                // Parameters binding and execution
                $query->bindParam(':codproduct', $product['codproduct'], PDO::PARAM_INT);
                $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
                $query->bindParam(':amountproductorder', $product['amountproductorder'], PDO::PARAM_INT);

                $query->execute();
                $query->closeCursor();
            }
        }

        $connection->commit();
    } catch (PDOException $e) {
        $connection->rollBack();
        return process_pdo_exception($e);
    }

    $connection = null;
    return array('success_message' => 'The draft has been added correctly');
}
