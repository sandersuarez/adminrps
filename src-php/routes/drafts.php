<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src-php/crud/drafts_crud.php';

$app->get('/obtain_drafts', function (Request $request, Response $response) {

  // Security check
  $security = security();
  if (is_array($security)) {
    if (array_key_exists('user', $security)) {
      $response_content = json_encode(obtain_drafts(), JSON_UNESCAPED_UNICODE);
    } else {
      $response_content =
        json_encode(
          array('forbidden' => 'You do not have permission to access this service'),
          JSON_UNESCAPED_UNICODE
        );
    }
  } else {
    $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
  }

  $response->getBody()->write($response_content);
  return $response
    ->withHeader('Content-Type', 'application/json')
    ->withStatus(200);
});

$app->get('/obtain_draft', function (Request $request, Response $response) {

  // Security check
  $security = security();
  if (is_array($security)) {
    if (array_key_exists('user', $security)) {

      // Check for required parameters
      $params = $request->getQueryParams();

      if (array_key_exists('coddraft', $params)) {
        $response_content = json_encode(obtain_draft($params['coddraft']), JSON_UNESCAPED_UNICODE);
      } else {
        $response_content = json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
      }
    } else {
      $response_content =
        json_encode(
          array('forbidden' => 'You do not have permission to access this service'),
          JSON_UNESCAPED_UNICODE
        );
    }
  } else {
    $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
  }

  $response->getBody()->write($response_content);
  return $response
    ->withHeader('Content-Type', 'application/json')
    ->withStatus(200);
});

$app->post('/add_draft', function (Request $request, Response $response) {

  // Security check
  $security = security();
  if (is_array($security)) {
    if (array_key_exists('user', $security)) {

      // Check for required parameters
      $params = $request->getParsedBody();
      if (!((array_key_exists('namecustomertmp', $params) || array_key_exists('telcustomertmp', $params))
        && array_key_exists('codcustomer', $params))) {

        $input_data = [];
        if (array_key_exists('namecustomertmp', $params)) {
          $input_data['namecustomertmp'] = $params['namecustomertmp'];
        }
        if (array_key_exists('telcustomertmp', $params)) {
          $input_data['telcustomertmp'] = $params['telcustomertmp'];
        }
        if (array_key_exists('pickuptime', $params)) {
          $input_data['pickuptime'] = $params['pickuptime'];
        }
        if (array_key_exists('codcustomer', $params)) {
          $input_data['codcustomer'] = $params['codcustomer'];
        }
        if (array_key_exists('products', $params)) {
          $input_data['products'] =
            json_decode(json_encode($params['products'], JSON_UNESCAPED_UNICODE), true);
        }

        $response_content = json_encode(add_draft($input_data), JSON_UNESCAPED_UNICODE);
      } else {
        $response_content =
          json_encode(
            array('message' => 'The customer code and the customer data cannot be inserted at the same time'),
            JSON_UNESCAPED_UNICODE
          );
      }
    } else {
      $response_content =
        json_encode(
          array('forbidden' => 'You do not have permission to access this service'),
          JSON_UNESCAPED_UNICODE
        );
    }
  } else {
    $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
  }

  $response->getBody()->write($response_content);
  return $response
    ->withHeader('Content-Type', 'application/json')
    ->withStatus(200);
});

$app->put('/edit_draft', function (Request $request, Response $response) {

  // Security check
  $security = security();
  if (is_array($security)) {
    if (array_key_exists('user', $security)) {

      // Check for required parameters
      $params = $request->getParsedBody();

      if (array_key_exists('coddraft', $params)) {
        $input_data = [];
        $input_data['coddraft'] = $params['coddraft'];
        if (array_key_exists('namecustomertmp', $params)) {
          $input_data['namecustomertmp'] = $params['namecustomertmp'];
        }
        if (array_key_exists('telcustomertmp', $params)) {
          $input_data['telcustomertmp'] = $params['telcustomertmp'];
        }
        if (array_key_exists('pickuptime', $params)) {
          $input_data['pickuptime'] = $params['pickuptime'];
        }
        if (array_key_exists('codcustomer', $params)) {
          $input_data['codcustomer'] = $params['codcustomer'];
        }
        if (array_key_exists('products', $params)) {
          $input_data['products'] =
            json_decode(json_encode($params['products'], JSON_UNESCAPED_UNICODE), true);
        }

        $response_content = json_encode(edit_draft($input_data), JSON_UNESCAPED_UNICODE);
      } else {
        $response_content = json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
      }
    } else {
      $response_content =
        json_encode(
          array('forbidden' => 'You do not have permission to access this service'),
          JSON_UNESCAPED_UNICODE
        );
    }
  } else {
    $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
  }

  $response->getBody()->write($response_content);
  return $response
    ->withHeader('Content-Type', 'application/json')
    ->withStatus(200);
});

$app->delete('/delete_draft', function (Request $request, Response $response) {

  // Security check
  $security = security();
  if (is_array($security)) {
    if (array_key_exists('user', $security)) {

      // Check for required parameters
      $params = $request->getQueryParams();

      if (array_key_exists('coddraft', $params)) {
        $response_content = json_encode(delete_draft($params['coddraft']), JSON_UNESCAPED_UNICODE);
      } else {
        $response_content = json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
      }
    } else {
      $response_content =
        json_encode(
          array('forbidden' => 'You do not have permission to access this service'),
          JSON_UNESCAPED_UNICODE
        );
    }
  } else {
    $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
  }

  $response->getBody()->write($response_content);
  return $response
    ->withHeader('Content-Type', 'application/json')
    ->withStatus(200);
});

$app->delete('/delete_all_drafts', function (Request $request, Response $response) {

  // Security check
  $security = security();
  if (is_array($security)) {
    if (array_key_exists('user', $security)) {
      $response_content = json_encode(delete_all_drafts(), JSON_UNESCAPED_UNICODE);
    } else {
      $response_content =
        json_encode(
          array('forbidden' => 'You do not have permission to access this service'),
          JSON_UNESCAPED_UNICODE
        );
    }
  } else {
    $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
  }

  $response->getBody()->write($response_content);
  return $response
    ->withHeader('Content-Type', 'application/json')
    ->withStatus(200);
});
