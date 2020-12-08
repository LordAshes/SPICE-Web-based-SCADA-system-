<?PHP

	$pdo = null;
	
	Connect("..\Database\SpiceData.db");
	$value = 1;
	$mul = 2;
	while(true)
	{
		$value = $value * $mul;
		if($value>65535){$mul = 0.5;}
		if($value<=1){$mul = 2;}
		echo $value . "\n";
		WriteSignal("Signal2",$value);
		Sleep(rand(2,3));
	}

	function Connect($connectionString)
	{
		global $pdo;
		
		$pdo = new \PDO("sqlite:".$connectionString);		
	}
	
	function WriteSignal($tag, $value, $timestamp=null, $quality=192)
	{
		global $pdo;
		
		if($timestamp==null){$timestamp=date("Y-m-d h:i:s");}
		$pdo->exec('INSERT INTO Signals VALUES ("'.$timestamp.'","'.$tag.'","'.$value.'",'.$quality.')');
	}
?>