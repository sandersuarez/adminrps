<?php

/**
 * Function to obtain drafts added by a user
 * @return array
 */
function obtain_drafts()
{
    try {
        $connection = create_pdo_object();

        // SQL Query to search customers in alphabetic order
        $query = $connection->prepare("SELECT drafts.coddraft, drafts.namecustomertmp, drafts.telcustomertmp, drafts.codcustomer, customers.namecustomer, customers.telcustomer FROM " . DRAFTS .
            " LEFT JOIN customers ON drafts.codcustomer = customers.codcustomer WHERE drafts.coduser = :coduser ORDER BY drafts.coddraft DESC");

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
 * Function to obtain a draft added by a user
 * @param array $coddraft
 * @return array
 */
function obtain_draft($coddraft)
{
    // Requirements control
    if ((!filter_var($coddraft, FILTER_VALIDATE_INT)) || $coddraft < 1 || $coddraft > 9223372036854775808)
        return array('message' => 'The draft code is invalid');

    try {
        $connection = create_pdo_object();

        // SQL Query to search customers in alphabetic order
        $query = $connection->prepare("SELECT drafts.coddraft, drafts.namecustomertmp, drafts.telcustomertmp, drafts.codcustomer, customers.namecustomer, customers.telcustomer FROM " . DRAFTS .
            " LEFT JOIN customers ON drafts.codcustomer = customers.codcustomer WHERE drafts.coddraft = :coddraft AND drafts.coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
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
