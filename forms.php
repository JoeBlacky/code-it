<?php
    $to = "gooddealthanks@gmail.com";
    $subject = "Feed form";
    $txt = "Name: "    . $_POST["name"] . " \n" .
    			 "Phone: "   . $_POST["phone"] . " \n" .
    			 "Email: "   . $_POST["email"] . " \n" .
    			 "Message: " . $_POST["message"];
    mail($to,$subject,$txt);
?>