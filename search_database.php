
<?php
$servername = "127.0.0.1";
$username = "root";
$password = "Loonylupin87";
$dbname = "Flashcards";

$argument1 = $_GET['argument1'];
// $arg = mysql_escape_string($argument1);
// echo $argument1;
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

// $sql = $conn->prepare("SELECT * FROM basic WHERE front = '?' OR = LIKE '?'");
// $sql->execute(array($argument1, $argument1));


// $sql = sprintf("SELECT * FROM basic WHERE front='?'", mysql_escape_string($argument1));


// $sql = $conn->prepare("SELECT `*` FROM `basic` WHERE `front` LIKE ? AND `back` LIKE ?");
// $sql->bind_param("ss", $argument1, $argument1);
// $sql->execute();

// $sql= "SELECT * FROM basic WHERE front = ?", $argument1

// $stmt = mysqli_prepare($conn, "SELECT * FROM basic WHERE front=?");

//     /* bind parameters for markers */
//     mysqli_stmt_bind_param("s", $argument1);

//     /* execute query */
//     mysqli_stmt_execute();

//     $result = $stmt->get_result();
 

$sql= "SELECT * FROM basic WHERE front LIKE '%".$argument1."%' AND back LIKE '%".$argument1."%'";

// $query = mysql_query($sql);
// echo $sql;

$result = $conn->query($sql);

  // $sql = 'SELECT * ';
  // $sql .= 'FROM `basic` ';
  // $sql .= "WHERE `front` ='$argument1';";
  // $result = $conn->query($sql);



if ($result->num_rows > 0) {
    // output data of each row
    $a = array();
    while($row = $result->fetch_assoc()) {
        $obj = new stdClass();
		$obj->front= $row["front"];
		$obj->back = $row["back"];
		json_encode($obj);
    	array_push($a, $obj);
    }
    echo json_encode($a);
} else {
    echo "0 results";
}
$conn->close();

?>