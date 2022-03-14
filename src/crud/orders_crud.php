<?php

/**
 * Function to obtain am order added by a user
 * @param array $codorder
 * @return array
 */
function obtain_active_order($codorder)
{
    // Requirements control
    if (!filter_var($codorder, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
        return array('message' => 'The order code is invalid');

    try {
        $connection = create_pdo_object();

        // SQL Query to search active orders
        $query = $connection->prepare("SELECT " . ORDERS . ".codorder, " . ORDERS . ".numdayorder, " . ORDERS . ".dateorder, " . ORDERS . ".hourorder, " .
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
            $answer = array('message' => 'There is no coincident order');
        }

        clear_query_data($query, $connection);
        return $answer;
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }
}

/**
 * Function to convert a draft into an order
 * @param integer $coddraft
 * @return array
 */
function add_order($coddraft)
{
    // Requirements control
    if (!filter_var($coddraft, FILTER_VALIDATE_INT, ['options' => ['min_range' => '1', 'max_range' => '9223372036854775808']]))
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

            $draft = array('draft' => $result);
            $query->closeCursor();

            // SQL Query to search the products of the draft
            $query = $connection->prepare("SELECT " . DRAFTS_CONTAIN . ".codproduct, " . PRODUCTS . ".nameproduct, " . PRODUCTS . ".priceproduct, " . PRODUCTS . ".stockproduct, " .
                DRAFTS_CONTAIN . ".amountproductdraft FROM " . DRAFTS_CONTAIN . " JOIN " . PRODUCTS . " ON " . DRAFTS_CONTAIN . ".codproduct = " . PRODUCTS . ".codproduct JOIN " .
                DRAFTS . " ON " . DRAFTS_CONTAIN . ".coddraft = " . DRAFTS . ".coddraft WHERE " . DRAFTS_CONTAIN . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

            // Parameters binding and execution
            $query->bindParam(':coddraft', $coddraft, PDO::PARAM_INT);
            $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            if ($result) {
                $draft['draft'][0]['products'] = $result;
            } else {
                $query->closeCursor();
                return array('message' => 'An order cannot be empty');
            }
        } else {
            return array('message' => 'There is no coincident draft');
        }

        $query->closeCursor();

        if ($draft['draft'][0]['namecustomertmp'] == null && $draft['draft'][0]['telcustomertmp'] == null && $draft['draft'][0]['codcustomer'] == null)
            return array('message' => 'An order must have a customer');

        if ($draft['draft'][0]['codcustomer'] == null && $draft['draft'][0]['namecustomertmp'] == null && $draft['draft'][0]['telcustomertmp'] != null)
            return array('message' => 'An customer must have a name');

        if ($draft['draft'][0]['codcustomer'] == null && $draft['draft'][0]['namecustomertmp'] != null && $draft['draft'][0]['telcustomertmp'] == null)
            return array('message' => 'An order must have a phone number');
        
        if ($draft['draft'][0]['telcustomertmp'] != null && !preg_match('#^[6-9]([0-9]){8}$#', $draft['draft'][0]['telcustomertmp']))
            return array('message' => 'The phone number is not valid');

        if ($draft['draft'][0]['namecustomertmp'] != null && trim($draft['draft'][0]['namecustomertmp']) == '')
            return array('message' => 'The customer name is not valid');

        // SQL Query to search a new primary key 
        $query = $connection->prepare("SELECT max(codorder) FROM " . ORDERS);
        $query->execute();
        $codorder = $query->fetch()[0];
        $query->closeCursor();
        $codorder = $codorder + 1;

        if ($codorder > 9223372036854775808) return array('overflow' => 'The order list is full. Contact the administrator');

        $query = $connection->prepare("SELECT max(" . ORDERS . ".numdayorder) FROM " . ORDERS . " JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " .
            CUSTOMERS . ".codcustomer WHERE " . CUSTOMERS . ".coduser = :coduser AND " . ORDERS . ".dateorder = (CURDATE())");
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
        $query->execute();
        $numdayorder = $query->fetch()[0];
        $query->closeCursor();
        $numdayorder = $numdayorder + 1;

        if ($numdayorder > 8388607) return array('overflow' => 'The order list is full for today. Contact the administrator');

        if ($draft['draft'][0]['codcustomer'] == null) {
            $query = $connection->prepare("SELECT max(codcustomer) FROM " . CUSTOMERS);
            $query->execute();
            $codcustomer = $query->fetch()[0];
            $query->closeCursor();
            $codcustomer = $codcustomer + 1;

            if ($codcustomer > 9223372036854775808) return array('overflow' => 'The customer list is full. Contact the administrator');
        }
    } catch (PDOException $e) {
        return process_pdo_exception($e);
    }

    $connection->beginTransaction();
    try {
        if ($draft['draft'][0]['codcustomertmp'] == null) {
            // SQL Query to insert a customer
            $query = $connection->prepare("INSERT INTO " . CUSTOMERS . " (codcustomer, namecustomer, telcustomer, coduser) VALUES " .
                "(:codcustomer, :namecustomer, :telcustomer, :coduser)");

            // Parameters binding and execution
            $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
            $query->bindParam(':namecustomer', $draft['draft'][0]['namecustomertmp'], PDO::PARAM_STR);
            $query->bindParam(':telcustomer', $draft['draft'][0]['telcustomertmp'], PDO::PARAM_STR_CHAR);
            $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

            $query->execute();
            $query->closeCursor();
        }

        $query = $connection->prepare("INSERT INTO " . ORDERS . " (codorder, numdayorder, codcustomer) VALUES " .
            "(:codorder, :numdayorder, :codcustomer)");

        $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
        $query->bindParam(':numdayorder', $numdayorder, PDO::PARAM_INT);

        if ($draft['draft'][0]['codcustomer'] == null) {
            $query->bindParam(':codcustomer', $codcustomer, PDO::PARAM_INT);
        } else {
            $query->bindParam(':codcustomer', $draft['draft'][0]['codcustomer'], PDO::PARAM_INT);
        }

        $query->execute();
        $query->closeCursor();

        // Products insertion
        if (array_key_exists('products', $draft['draft'][0])) {
            foreach ($draft['draft'][0]['products'] as $draft_product) {
                // SQL Query to add product records to the order
                $query = $connection->prepare("INSERT INTO " . ORDERS_CONTAIN . " (codproduct, codorder, amountproductorder) VALUES (:codproduct, :codorder, :amountproductorder)");

                // Parameters binding and execution
                $query->bindParam(':codproduct', $draft_product['codproduct'], PDO::PARAM_INT);
                $query->bindParam(':codorder', $codorder, PDO::PARAM_INT);
                $query->bindParam(':amountproductorder', $draft_product['amountproductdraft'], PDO::PARAM_INT);

                $query->execute();
                $query->closeCursor();
            }
        }

        // SQL Query to delete the draft products
        $query = $connection->prepare("DELETE " . DRAFTS_CONTAIN . " FROM " . DRAFTS_CONTAIN . " JOIN " . DRAFTS . " ON " . DRAFTS_CONTAIN . ".coddraft = " . DRAFTS .
            ".coddraft WHERE " . DRAFTS_CONTAIN . ".coddraft = :coddraft AND " . DRAFTS . ".coduser = :coduser");

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
        return process_pdo_exception($e);
    }

    $connection = null;
    return array('success_message' => 'The order has been added correctly');
}
