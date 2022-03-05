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
 * Function to obtain an order draft added by a user
 * @param array $codorder
 * @return array
 */
function obtain_draft($codorder)
{
    // Requirements control
    if ((!filter_var($codorder, FILTER_VALIDATE_INT)) || $codorder < 1)
        return array('message' => 'The order code is invalid');

    try {
        $connection = create_pdo_object();

        // SQL Query to search customers in alphabetic order
        $query = $connection->prepare("SELECT orders.codorder, customers.namecustomer, customers.telcustomer FROM " . ORDERS .
            " LEFT JOIN customers ON orders.codcustomer = customers.codcustomer WHERE orders.orderisdraft = 1 AND orders.codorder = :codorder AND orders.coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            $answer = array('drafts' => $result);
        } else {
            $answer = array('message' => 'There is no coincident draft');
        }

        clear_query_data($query, $connection);
        return $answer;
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}
