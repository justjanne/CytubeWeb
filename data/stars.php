<?php
    $db = new PDO('sqlite:/var/www/CytubeBot/cytubebot.db');
    $sql = "SELECT uname, award FROM users ORDER BY uname";

    $response = Array();
    $data = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    foreach ($data as $datum) {
        $name = $datum["uname"];
	if ($datum["award"] != 0) {
	        $response[$name] = $datum["award"];
	}
    }

    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    echo json_encode($response)."\n";
?>
