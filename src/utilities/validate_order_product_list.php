<?php

/**
 * Function to add a new order draft for a user
 * @param array $product_list
 * @return array
 */
function validate_order_product_list($product_list)
{
    if (is_array($product_list)) {
        $productids = [];
        foreach ($product_list as $index => $product) {
            if (is_array($product)) {
                if (in_array($product['codproduct'], $productids)) {
                    return array('message' => 'A product is duplicated');
                } else {
                    array_push($productids, $product['codproduct']);
                }

                if (!array_key_exists('codproduct', $product)) return array('message' => 'A product code is missing');
                if (!filter_var($product['codproduct'], FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
                    return array('message' => 'The product code is invalid');
                if (!array_key_exists('amountproduct', $product)) return array('message' => 'A product amount is missing');
                if (!filter_var($product['amountproduct'], FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '32767']]))
                    return array('message' => 'The amount of product is invalid');

                try {
                    // SQL Query to check if the product exists
                    $connection = create_pdo_object();
                    $query = $connection->prepare("SELECT codproduct FROM " . PRODUCTS . " WHERE codproduct = :codproduct AND productdeleted = 0 AND coduser = :coduser");

                    // Parameters binding and execution
                    $query->bindParam(':codproduct', $product['codproduct'], PDO::PARAM_INT);
                    $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

                    $query->execute();
                    $result = $query->fetch(PDO::FETCH_ASSOC);
                    clear_query_data($query, $connection);
                    if (!$result) return array('message' => 'The product ' . $product['codproduct'] . ' does not exists or is deleted');
                } catch (PDOException $e) {
                    return process_pdo_exception($e);
                }
            } else {
                return array('message' => 'The product list is malformed');
            }
        }
    } else {
        return array('message' => 'The product list is invalid');
    }
    return array('success_message' => 'The product list is valid');
}
