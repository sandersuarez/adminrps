<?php

require __DIR__ . '/../../src-php/pdf_generation/templates/SoldOrdersPDFTemplate.php';

/**
 * Function that generates a pdf with the sold orders information
 * @param string $datebegin
 * @param string $dateend
 * @return array|SoldOrdersPDFTemplate
 */
function generate_sold_orders_pdf($datebegin, $dateend, $iva)
{
    // Requirements control
    if (!validateDate($datebegin)) return array('message' => 'The minimum date is invalid');
    if (!validateDate($dateend)) return array('message' => 'The maximum date is invalid');

    $datebegin_datetime = new DateTime($datebegin . ' 00:00:00');
    $dateend_datetime = new DateTime($dateend . ' 00:00:00');
    $interval = $datebegin_datetime->diff($dateend_datetime);
    if ($datebegin_datetime > $dateend_datetime) return array('message' => 'The minimum date is bigger than the maximum date');
    if (!($interval->y === 0 || ($interval->y === 1 && $interval->m === 0 && $interval->d === 0))) return array('message' => 'The search interval cannot be higher than 1 year');

    // Create new PDF document
    $pdf = new SoldOrdersPDFTemplate(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

    // Positioning constraints
    $origin_x = 8;
    $page_width = $pdf->getPageWidth();
    $margin_top = 25;
    $margin_left = 8;

    // Set document information
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetTitle('Listado de Tickets');

    // Set default header data and fonts
    $pdf->SetHeaderData(PDF_HEADER_TITLE, PDF_HEADER_STRING);
    $pdf->setHeaderFont(array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));

    // Set default monospaced font
    $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

    // Set margins
    $pdf->SetMargins($margin_left, $margin_top, PDF_MARGIN_RIGHT);
    $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);

    // Set auto page breaks
    $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

    $pdf->DatebeginDatetime = $datebegin_datetime;

    // Set some language-dependent strings
    if (@file_exists(dirname(__FILE__) . '/lang/esp.php')) {
        require_once(dirname(__FILE__) . '/lang/esp.php');
        $pdf->setLanguageArray($l);
    }

    $pdf->SetFont('times', 'R', 11);
    $pdf->AddPage();

    // SQL statement to search the orders
    try {
        $connection = create_pdo_object();
        $query = $connection->prepare("SELECT " . ORDERS_SOLD . ".codordersold, " . ORDERS_SOLD . ".idordersold, " . ORDERS_SOLD . ".dateordersold, " . ORDERS_SOLD .
            ".hourordersold FROM " . ORDERS_SOLD . " JOIN " . ORDERS . " ON " . ORDERS_SOLD . ".codorder = " . ORDERS .
            ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer WHERE " . CUSTOMERS . ".coduser = :coduser" .
            " AND " . ORDERS_SOLD . ".dateordersold >= :datebegin AND " . ORDERS_SOLD . ".dateordersold <= :dateend");

        // Parameters binding and execution
        $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);
        $query->bindParam(':datebegin', $datebegin, PDO::PARAM_STR);
        $query->bindParam(':dateend', $dateend, PDO::PARAM_STR);

        $query->execute();
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            $orders = $result;
        } else {
            clear_query_data($query, $connection);
            return array('message' => 'There are no coincident sold orders');
        }

        clear_query_data($query, $connection);
    } catch (PDOException $e) {
        if ($query !== null) $query->closeCursor();
        $connection = null;
        return process_pdo_exception($e);
    }

    // Set the table data
    $element_width = ($page_width - ($origin_x * 2)) / 6;
    $orders_table = <<<HTML
    <table nobr="true">
        <thead nobr="true">
            <tr style="text-align:center;font-weight:bold;text-decoration:underline" nobr="true">
                <th style="width: {$element_width}mm;">Num. Ticket</th>
                <th style="width: {$element_width}mm;">Fecha</th>
                <th style="width: {$element_width}mm;">Hora</th>
                <th style="width: {$element_width}mm;">Base Imponible</th>
                <th style="width: {$element_width}mm;">C. IVA</th>
                <th style="width: {$element_width}mm;">Total Ticket</th>
            </tr>
        </thead>
        <tbody nobr="true">
    HTML;

    $total_price = 0;

    // Data display for each order
    foreach ($orders as $order) {

        // Date and time
        $ordersold_datetime = new DateTime($order['dateordersold'] . ' ' . $order['hourordersold']);
        $dateordersold_formatted = date_format($ordersold_datetime, 'd/m/Y');
        $hourordersold_formatted = date_format($ordersold_datetime, 'H:i');

        // Product price

        // SQL statement to search the products
        try {
            $connection = create_pdo_object();
            $query = $connection->prepare("SELECT " . PRODUCTS . ".priceproduct, " . ORDERS_CONTAIN . ".amountproductorder FROM " . ORDERS_CONTAIN . " JOIN " . PRODUCTS . " ON " .
                ORDERS_CONTAIN . ".codproduct = " . PRODUCTS . ".codproduct JOIN " .
                ORDERS . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS . ".codorder JOIN " . ORDERS_SOLD . " ON " . ORDERS_CONTAIN . ".codorder = " . ORDERS_SOLD .
                ".codorder JOIN " . CUSTOMERS . " ON " . ORDERS . ".codcustomer = " . CUSTOMERS . ".codcustomer WHERE " . ORDERS_SOLD . ".codordersold = :codordersold AND " .
                CUSTOMERS . ".coduser = :coduser");

            // Parameters binding and execution
            $query->bindParam(':codordersold', $order['codordersold'], PDO::PARAM_INT);
            $query->bindParam(':coduser', $_SESSION['id'], PDO::PARAM_INT);

            $query->execute();
            $result = $query->fetchAll(PDO::FETCH_ASSOC);
            $products = $result;

            clear_query_data($query, $connection);
        } catch (PDOException $e) {
            if ($query !== null) $query->closeCursor();
            $connection = null;
            return process_pdo_exception($e);
        }

        $total_order_price = 0;
        foreach ($products as $product) {
            $total_order_price += $product['priceproduct'] * $product['amountproductorder'];
        }

        $c_iva = $total_order_price * $iva;
        $base = $total_order_price - $c_iva;

        $total_price += $total_order_price;

        $total_order_price = number_format($total_order_price, 2, ',', '.');
        $c_iva = number_format($c_iva, 2, ',', '.');
        $base = number_format($base, 2, ',', '.');

        $orders_table .= <<<HTML
            <tr nobr="true">
                <td style="width: {$element_width}mm;font-weight:bold;text-align:center;">{$order['idordersold']}</td>
                <td style="width: {$element_width}mm;text-align:center;">{$dateordersold_formatted}</td>
                <td style="width: {$element_width}mm;text-align:center;">{$hourordersold_formatted}</td>
                <td style="width: {$element_width}mm;text-align:center;">{$base}</td>
                <td style="width: {$element_width}mm;text-align:center;">{$c_iva}</td>
                <td style="width: {$element_width}mm;font-weight:bold;text-align:center;">{$total_order_price}</td>
            </tr>
        HTML;
    }

    $total_price = number_format($total_price, 2, ',', '.');

    $orders_table .= <<<HTML
            <tr nobr="true">
                <td style="width: {$element_width}mm;border-top: 1px solid black;"></td>
                <td style="width: {$element_width}mm;border-top: 1px solid black;"></td>
                <td style="width: {$element_width}mm;border-top: 1px solid black;"></td>
                <td style="width: {$element_width}mm;border-top: 1px solid black;"></td>
                <td style="width: {$element_width}mm;font-weight:bold;text-align:center;border-top: 1px solid black;">Total</td>
                <td style="width: {$element_width}mm;font-weight:bold;text-align:center;border-top: 1px solid black;">{$total_price}</td>
            </tr>
        </tbody>
    </table>
    HTML;

    $pdf->writeHTML($orders_table, true, false, false, false, '');

    return $pdf;
}
