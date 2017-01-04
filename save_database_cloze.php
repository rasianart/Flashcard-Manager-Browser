
<?php
$servername = "127.0.0.1";
$username = "root";
$password = "Loonylupin87";
$dbname = "Flashcards";

$text = $_GET['argument1'];
$cloze = $_GET['argument2'];
// $arg = mysql_escape_string($argument1);
// echo $argument1;
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$sql = "INSERT INTO cloze (text, cloze)
VALUES ('$text', '$cloze')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>