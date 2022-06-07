<?php

function validateDate($date, $format = 'Y-m-d'){
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

function validateTime($time, $format = 'H:i'){
    $t = DateTime::createFromFormat($format, $time);
    return $t && $t->format($format) === $time;
}