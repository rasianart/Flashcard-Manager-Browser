
<?php

$query = $_GET['argument1'];


mysql_connect("127.0.0.1", "root", "Loonylupin87") or die("Error connecting to database: ".mysql_error());
     
mysql_select_db("Flashcards") or die(mysql_error());

$query = htmlspecialchars($query); 
// changes characters used in html to their equivalents, for example: < to &gt;
 
$query = mysql_real_escape_string($query);
// makes sure nobody uses SQL injection
 
$raw_results = mysql_query("SELECT * FROM cloze
    WHERE (`text` LIKE '%".$query."%') OR (`cloze` LIKE '%".$query."%')") or die(mysql_error());
 
if(mysql_num_rows($raw_results) > 0){ // if one or more rows are returned do following
        $a = array();
    while($results = mysql_fetch_array($raw_results)){
    // $results = mysql_fetch_array($raw_results) puts data from database into array, while it's valid it does the loop
     
        $obj = new stdClass();
        $obj->text= $results["text"];
        $obj->cloze = $results["cloze"];
        json_encode($obj);
        array_push($a, $obj);
    }
    echo json_encode($a);
}
else{ // if there is no matching rows do following
    echo 0;
}

?>