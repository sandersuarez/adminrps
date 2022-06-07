<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../../src-php/pdf_generation/sold_orders_pdf.php';

$app->get('/obtain_sold_orders_pdf', function (Request $request, Response $response) {

    $response_content = '';

    // Security check
    $security = security();
    if (is_array($security)) {
        if (array_key_exists('user', $security)) {
            // Check for required parameters
            $params = $request->getQueryParams();

            if (array_key_exists('datebegin', $params) && array_key_exists('dateend', $params)) {

                $requirements['datebegin'] = $params['datebegin'];
                $requirements['dateend'] = $params['dateend'];

                $pdf = generate_sold_orders_pdf($requirements['datebegin'], $requirements['dateend'], $security['user']['ivaprefuser']);
                if (is_array($pdf) && array_key_exists('message', $pdf)) {
                    $response_content = json_encode($pdf);
                } else {
                    $response_content = $pdf->Output('listado_de_tickets' . $params['datebegin'] . '.pdf', 'I');
                }
            } else {
                $response_content = json_encode(array('message' => 'Required field missing'), JSON_UNESCAPED_UNICODE);
            }
        } else {
            $response_content = json_encode(array('forbidden', 'You do not have permission to access this service'), JSON_UNESCAPED_UNICODE);
        }
    } else {
        $response_content = json_encode(reason_no_session($security), JSON_UNESCAPED_UNICODE);
    }

    $response->getBody()->write($response_content);
    return $response;
});
