<?php

/**
 * Function to obtain the last key update date
 */
function obtain_date_last_key()
{
    try {
        // SQL Query to edit the iva
        $connection = create_pdo_object();

        $query = $connection->prepare("SELECT datlastkeyuser FROM " . USERS . " WHERE coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);
        $answer = $result;

        clear_query_data($query, $connection);
        return $answer;
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}

/**
 * Function to modify the applied iva of the user
 * @param float $iva
 * @param float $old_iva
 */
function edit_user_iva($iva, $old_iva)
{
    // Requirements control
    if ((!is_numeric($iva)) || $iva < 0 || round($iva, 2) > 1.00) return array('message' => 'The iva is invalid');
    $iva = round($iva, 2);
    if ($iva == $old_iva) return array('message' => 'The iva is the same');

    try {
        // SQL Query to edit the iva
        $connection = create_pdo_object();

        $query = $connection->prepare("UPDATE " . USERS . " SET ivaprefuser = :ivaprefuser WHERE coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':ivaprefuser', $iva, PDO::PARAM_STR);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();

        $connection = null;
        return array('success_message' => 'The iva has been updated correctly');
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}

/**
 * Function to update the user password
 * @param array $input_data
 */
function update_password($input_data)
{
    // Requirements control
    if ($input_data['old_password'] != $_SESSION['key']) return array('message' => 'The password is incorrect');
    if (strlen($input_data['password']) < 6 || strlen($input_data['password']) > 20) return array('message' => 'The password must have a length between 6 and 20');
    if ($input_data['password'] != $input_data['repeat_password']) return array('message' => 'The passwords do not match');
    if ($input_data['old_password'] == $input_data['password']) return array('message' => 'The password is the same');
    

    try {
        // SQL Query to update the password
        $connection = create_pdo_object();

        $query = $connection->prepare("UPDATE " . USERS . " SET datlastkeyuser = :datlastkeyuser, keyuser = :keyuser WHERE coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':keyuser', password_hash($input_data['password'], PASSWORD_DEFAULT), PDO::PARAM_STR);
        $query->bindParam(':datlastkeyuser', date('Y-m-d'), PDO::PARAM_STR);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();

        $connection = null;
        return array('success_message' => 'The password has been updated correctly');
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}
