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
        $query = $connection->prepare("SELECT " . DRAFTS . ".coddraft, " . DRAFTS . ".namecustomertmp, " . DRAFTS . ".telcustomertmp, " . DRAFTS . ".codcustomer, " . CUSTOMERS . 
            ".namecustomer, " . CUSTOMERS . ".telcustomer FROM " . DRAFTS . " LEFT JOIN " . CUSTOMERS . " ON " . DRAFTS . ".codcustomer = " . CUSTOMERS . ".codcustomer WHERE " . 
            DRAFTS . ".coduser = :coduser ORDER BY " . DRAFTS . ".coddraft DESC");

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
        $query = $connection->prepare("SELECT " . DRAFTS . ".coddraft, " . DRAFTS . ".namecustomertmp, " . DRAFTS . ".telcustomertmp, " . DRAFTS . ".codcustomer, "
            . CUSTOMERS . ".namecustomer, " . CUSTOMERS . ".telcustomer FROM " . DRAFTS . " LEFT JOIN " . CUSTOMERS . " ON " . DRAFTS . ".codcustomer = "
            . CUSTOMERS . ".codcustomer WHERE " . DRAFTS . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

        // Parameters binding and execution
        $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {

            $answer = array('drafts' => $result);
            $query->closeCursor();

            // SQL Query to search the products of the draft
            $query = $connection->prepare("SELECT " . DRAFTS_CONTAIN . ".codproduct, " . PRODUCTS . ".nameproduct, " . PRODUCTS . ".priceproduct FROM " . DRAFTS_CONTAIN .
                " JOIN " . PRODUCTS . " ON " . DRAFTS_CONTAIN . ".codproduct = " . PRODUCTS . ".codproduct JOIN " . DRAFTS . " ON " . DRAFTS_CONTAIN . ".coddraft = " . DRAFTS .
                ".coddraft WHERE " . DRAFTS_CONTAIN . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

            // Parameters binding and execution
            $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
            $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            if ($result) $answer['drafts'][0]['products'] = $result;
        } else {
            $answer = array('message' => 'There is no coincident draft');
        }

        clear_query_data($query, $connection);
        return $answer;
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}

/**
 * Function to add a new draft for a user
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
        $query = $connection->prepare("SELECT max(coddraft) FROM " . DRAFTS);
        $query->execute();
        $coddraft = $query->fetch()[0];
        $query->closeCursor();
        $coddraft = $coddraft + 1;

        if ($coddraft > 9223372036854775808) return array('overflow' => 'The draft list is full. Contact the administrator');
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }

    $connection->beginTransaction();
    try {

        // SQL Query to add a new draft
        $codcustomer_clause = array("", "");
        if (array_key_exists("codcustomer", $input_data)) {
            $codcustomer_clause[0] = ", codcustomer";
            $codcustomer_clause[1] = ", :codcustomer";
        }

        $namecustomertmp_clause = array("", "");
        if (array_key_exists("namecustomertmp", $input_data)) {
            $namecustomertmp_clause[0] = ", namecustomertmp";
            $namecustomertmp_clause[1] = ", :namecustomertmp";
        }

        $telcustomertmp_clause = array("", "");
        if (array_key_exists("telcustomertmp", $input_data)) {
            $telcustomertmp_clause[0] = ", telcustomertmp";
            $telcustomertmp_clause[1] = ", :telcustomertmp";
        }

        $query = $connection->prepare("INSERT INTO " . DRAFTS . " (coddraft" . $codcustomer_clause[0] . $namecustomertmp_clause[0] . $telcustomertmp_clause[0] .
            ", coduser) VALUES (:coddraft" . $codcustomer_clause[1] . $namecustomertmp_clause[1] . $telcustomertmp_clause[1] . ", :coduser)");

        // Parameters binding and execution
        $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
        if (array_key_exists('codcustomer', $input_data)) $query->bindParam(':codcustomer', $input_data['codcustomer'], PDO::PARAM_INT);
        if (array_key_exists('namecustomertmp', $input_data)) $query->bindParam(':namecustomertmp', $input_data['namecustomertmp'], PDO::PARAM_STR);
        if (array_key_exists('telcustomertmp', $input_data)) $query->bindParam(':telcustomertmp', $input_data['telcustomertmp'], PDO::PARAM_STR);
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

        $query->execute();
        $query->closeCursor();

        if (array_key_exists('products', $input_data)) {
            foreach ($input_data['products'] as $index => $product) {
                // SQL Query to add product records to the order
                $query = $connection->prepare("INSERT INTO " . DRAFTS_CONTAIN . " (codproduct, coddraft, amountproductdraft) VALUES (:codproduct, :coddraft, :amountproductdraft)");

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
        return process_pdo_exception($e);
    }

    $connection = null;
    return array('success_message' => 'The draft has been added correctly');
}
