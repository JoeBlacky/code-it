<?php
    $to = "gooddealthanks@gmail.com";
    $subject = "Feed form";
    $txt = "Имя: " . $_POST["name"] . '<br>' . "Телефон: " . $_POST["phone"] . '<br>' . "Почта: " . $_POST["email"]  . '<br>' . "Сообщение: " . $_POST["message"];

    mail($to,$subject,$txt);
?>