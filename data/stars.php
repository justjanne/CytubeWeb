<?php
    $db = new PDO('sqlite:/opt/cytube/cytubebot.db');
    $sql = "SELECT uname, award FROM users ORDER BY uname";

    $response = Array();
    $data = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    foreach ($data as $datum) {
        $name = $datum["uname"];
	if ($datum["award"] != 0) {
	        $response[$name] = $datum["award"];
	}
    }
    echo json_encode($response);
?>
