<?php


/**
 * Class that defines a document that displays the sold orders between two dates
 */
class SoldOrdersPDFTemplate extends TCPDF
{
    /**
     * Function that defines the header of the document
     */
    public function Header()
    {
        $origin_x = 8;
        $origin_y = 8;
        $margin_label = 2;
        $date_label_width = 15;

        // Rectangle Frame
        $page_width = $this->getPageWidth();
        $header_height = 10;
        $this->Rect($origin_x, $origin_y, ($page_width - ($origin_x * 2)), $header_height, '', array('LTRB' => array('width' => 0.35)));

        // Shadow
        $this->Rect(($origin_x + 0.45), ($origin_y + 0.45), ($page_width - ($origin_x * 2)), $header_height, '', array(
            'L' => 0,
            'T' => 0,
            'R' => array('width' => 0.70),
            'B' => array('width' => 0.70)
        ));

        // Page number
        $this->setAbsX($origin_x + $margin_label);
        $this->setAbsY($origin_y);
        $this->SetFont('times', 'R', 11);
        $this->Cell(10, $header_height, 'Pag ' . $this->getAliasNumPage(), 0, false, 'L', 0, '', 0, false, 'T', 'M');

        // Date
        $this->setAbsX($page_width - $margin_label - $origin_x - $date_label_width);
        $this->setAbsY($origin_y);
        $this->Cell($date_label_width, $header_height, date_format($this->DatebeginDatetime, 'd/m/Y'), 0, false, 'R', 0, '', 0, false, 'T', 'M');

        // Title
        $this->setAbsX($origin_x);
        $this->setAbsY($origin_y);
        $this->SetFont('times', 'B', 17);
        $this->Cell(($page_width - ($origin_x * 2)), $header_height, 'Listado de Tickets', 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }

    // Page footer
    public function Footer()
    {
    }
}
