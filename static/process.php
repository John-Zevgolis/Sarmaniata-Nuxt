<?php

$formerrors=false;
$data=array();
$errors=array();

$name = $_POST["name"];
$email = $_POST["email"];
$subject = $_POST["subject"];
$message = $_POST["message"];

if (empty($name)) {

    array_push($errors, (object)[
        "field" => "name",
        "text" => "Το πεδίο είναι υποχρεωτικό",
    ]);

    $formerrors=true;

}

if (empty($email)) {

    array_push($errors, (object)[
        "field" => "email",
        "text" => "Το πεδίο είναι υποχρεωτικό",
    ]);

    $formerrors=true;

} else if( !filter_var($email,FILTER_VALIDATE_EMAIL) ) {

    array_push($errors, (object)[
        "field" => "email",
        "text" => "Το email δεν είναι έγκυρο",
    ]);

    $formerrors=true;

}

if (empty($subject)) {
    
    array_push($errors, (object)[
        "field" => "subject",
        "text" => "Το πεδίο είναι υποχρεωτικό",
    ]);

    $formerrors=true;

}

if (empty($message)) {

    array_push($errors, (object)[
        "field" => "message",
        "text" => "Το πεδίο είναι υποχρεωτικό",
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
    $subject="Θέμα: " .$subject;
    $body="Στοιχεια επισκέπτη \n";
    $body.="Ονομα: $name \n";
    $body.="Εmail: $email \n";
    $body.="Μηνυμα: $message \n";

    $r=mail($to,$subject,$body,$headers);

    $data["text"] = "Το μήνυμά σας απεστάλη με επιτυχία! Θα επικοινωνήσουμε άμεσα μαζί σας τις επομένες ώρες.";
    $data["status"] = "success";
    echo json_encode($data);

} else {
    $data["status"] = "error";
    $data["errors"] = $errors;
    echo json_encode($data);
}
?>