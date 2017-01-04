
<?php
$servername = "127.0.0.1";
$username = "root";
$password = "Loonylupin87";
$dbname = "Flashcards";

$argument1 = $_GET['argument1'];
$argument2 = $_GET['argument2'];


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM cloze ORDER BY RAND() LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $obj = new stdClass();
		$obj->text= $row["text"];
		$obj->cloze = $row["cloze"];

		echo json_encode($obj);

    }
} else {
    echo "0 results";
}
$conn->close();	
?>