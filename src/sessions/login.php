<?php

// Security function to protect services
function security()
{
    $answer = -3;
    // User login check
    if (isset($_SESSION['id']) && isset($_SESSION['key']) && isset($_SESSION['last_access'])) {

        // Session time check
        if (time() - $_SESSION['last_access'] > 60 * $_SESSION['inactive_time']) {
            $answer = -1;
        } else {
            try {
                // PDO object creation
                $connection = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_KEY);
                $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // SQL Query
                $query = $connection->prepare("SELECT * FROM " . USERS . " WHERE coduser = :id");

                // Parameters binding and execution
                $coduser = $_SESSION['id'];
                $query->bindParam(":id", $coduser, PDO::PARAM_STR);
                $query->execute();

                // If there are results, the password is verified with password_verify
                if ($result = $query->fetch(PDO::FETCH_ASSOC)) {
                    if (password_verify($_SESSION['key'], $result['keyuser'])) {
                        // If the password is verified the session is renewed
                        $_SESSION['last_access'] = time();
                        unset($result['keyuser']);
                        $answer = array('user' => $result);
                    } else {
                        $answer = -2;
                    }
                } else {
                    $answer = -2;
                }

                // Query data and PDO object destruction
                $query->closeCursor();
                $connection = null;
            } catch (PDOException $e) {
                // Error catch and notification
                $error = "Error: " . $e->getMessage();
                return array("error" => "Error: $error");
            }
        }
    }

    return $answer;
}