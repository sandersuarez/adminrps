<?php

require __DIR__ . '/../../src/pdo/pdo_factory.php';

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
                // SQL query
                $connection = create_pdo_object();
                $query = $connection->prepare("SELECT * FROM " . USERS . " WHERE coduser = :id");

                // Parameters binding and execution
                $coduser = $_SESSION['id'];
                $query->bindParam(':id', $coduser, PDO::PARAM_STR);
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
                $error = 'Error: ' . $e->getMessage();
                return array('error' => "Error: $error");
            }
        }
    }

    return $answer;
}

// Function that returns the reason why there is not an active session
function reason_no_session($security)
{
    if ($security < -2) {
        $answer = array('no_logged' => 'Not logged in previously');
    } elseif ($security < -1) {
        $answer = array('forbidden' => 'Restricted zone');
    } else {
        $answer = array('time' => 'Session time expired');
    }
    return $answer;
}

// Login function
function login($input_data)
{
    // Input data control
    $input_data['username'] = trim($input_data['username']);
    if ($input_data['username'] == '') return array('message' => 'The username is required');
    if (strlen($input_data['username']) > 60 || strlen($input_data['key']) > 255) return array('message' => 'The user is not registered');

    try {
        // SQL query to search for matching users
        $connection = create_pdo_object();
        $query = $connection->prepare("SELECT * FROM " . USERS . " WHERE nameuser = :username");

        // Parameters binding and execution
        $username = $input_data['username'];
        $query->bindParam(':username', $username, PDO::PARAM_STR);
        $query->execute();

        // If there are results, the password is verified with password_verify
        if ($result = $query->fetch(PDO::FETCH_ASSOC)) {
            if (password_verify($input_data['key'], $result['keyuser'])) {
                // If the password is verified the session begins
                unset($result['keyuser']);
                $answer = array('user' => $result);
                $_SESSION['id'] = $result['coduser'];
                $_SESSION['key'] = $input_data['key'];
                $_SESSION['last_access'] = time();
                $_SESSION['inactive_time'] = SESSION_TIME;
            } else {
                $answer = array('message' => 'The password is incorrect');
            }
        } else {
            $answer = array('message' => 'The user is not registered');
        }

        // Liberación de los input_data de la consulta y destrucción del objeto PDO
        $query->closeCursor();
        $connection = null;
    } catch (PDOException $e) {
        // Recogida de errores y notificación
        $error = 'Error: ' . $e->getMessage();
        return array('error' => "Error: $error");
    }

    return $answer;
}
