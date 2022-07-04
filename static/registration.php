<?php

$formerrors=false;
$data=array();
$errors=array();

$name = $_POST["name"];
$phone = $_POST["phone"];
$members = $_POST["members"];

if (empty($name)) {

    array_push($errors, (object)[
        "field" => "name",
        "text" => "Το πεδίο είναι υποχρεωτικό",
    ]);

    $formerrors=true;

}

if (empty($phone)) {

    array_push($errors, (object)[
        "field" => "phone",
        "text" => "Το πεδίο είναι υποχρεωτικό",
    ]);

    $formerrors=true;

} else if(!is_numeric($phone)) {

    array_push($errors, (object)[
        "field" => "phone",
        "text" => "Μη επιτρεπόμενοι χαρακτήρες. Επιτρέπονται μόνο αριθμοί",
    ]);

    $formerrors=true;

} else if((is_numeric($phone) && strlen($phone) < 10) || (is_numeric($phone) && strlen($phone) > 10)) {

    array_push($errors, (object)[
        "field" => "phone",
        "text" => "Το πεδίο πρέπει να έχει 10 ψηφία",
    ]);

    $formerrors=true;

}

if (empty($members)) {
    
    array_push($errors, (object)[
        "field" => "members",
        "text" => "Πρέπει να επιλέξετε τουλάχιστον 1 άτομο",
    ]);

    $formerrors=true;

} else if ($members > 5) {

    array_push($errors, (object)[
        "field" => "members",
        "text" => "Μπορείτε να επιλέξετε μέχρι 4 άτομα",
    ]);

    $formerrors=true;

}

else if ($members < 1) {

    array_push($errors, (object)[
        "field" => "members",
        "text" => "Πρέπει να επιλέξετε τουλάχιστον 1 άτομο",
    ]);

    $formerrors=true;

}

if (!$formerrors) {
    $headers  = "From: info@sarmaniata.gr\n";
    $header  = "\r\n";
    $header  = "MIME-Version: 1.0 \r\n";
    $header  = "Content-Type: text/plain; charset= UTF-8\r\n";
    $header  = "\r\n"; 
    $to="tasou.ga@hotmail.com";
    $subject="Θέμα: Δήλωση συμμετοχής";
    $body="Στοιχεια επισκέπτη \n";
    $body.="Ονομα: $name \n";
    $body.="Τηλέφωνο: $phone \n";
    $body.="Αριθμός Ατόμων: $members \n";

    $r=mail($to,$subject,$body,$headers);

    $data["text"] = "Σε τσακώσαμε! Αντάμωση μπούνε στο παιχνίδι μας.";
    $data["status"] = "success";
    echo json_encode($data);

} else {
    $data["status"] = "error";
    $data["errors"] = $errors;
    echo json_encode($data);
}
?>