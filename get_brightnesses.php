<?php

require "config.php";

$from = isset($_GET["from"]) ? intval($_GET["from"]) : 0;
$to = isset($_GET["to"]) ? intval($_GET["to"]) : time();

$con = mysqli_connect($MYSQL_HOST, $MYSQL_SENSORS_USER, $MYSQL_SENSORS_PASSWORD, $MYSQL_SENSORS_DB);

$res = mysqli_query($con, "SELECT * FROM light WHERE time > " . mysqli_real_escape_string($con, strval($from)) . " AND time < " . mysqli_real_escape_string($con, strval($to)));

$data = array();

while($row = mysqli_fetch_array($res)) {
	array_push($data, array(
		"time" => intval($row["time"]),
		"bright" => floatval($row["brightness"])
	));
}

mysqli_close($con);

echo json_encode(array(
	"from" => $from,
	"to" => $to,
	"data" => $data
));