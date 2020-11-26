<?PHP

// Include interface file
require_once("iDataPollServer.php");

// SQLite implementation of iDataPollSever
class SQLiteServer implements iDataPollServer
{
	// PDO for performing SQLite operations
	private $pdo;
	
	// Cutoff time used to determine if there are any new SQLite entries (signal updates)
	private $cutoff;

	// Holds the master subscription list. It is the responsibility of the Client Handler to combine multiple client subscriptions into one master subscription
	// and provide it to the server via the SetSubscription method. Any signal updates which do not match the master subscription are not propagated to the Client Handler.
	private $subscription;
	
	// Holds the Client Handler callback function which gets subscribed signal changes
	private $callback = null;
	
	// Function for making an connection to the SQLite database
	function Connect($connectionString)
	{
		global $pdo;
		global $cutoff;
		global $subscription;
		
		$pdo = new \PDO("sqlite:".$connectionString);		
		$cutoff = "2000-01-01 12:00:00";
		$subscription = ["@SubscriptionList"];
	}

    // Function for setting the master subscription list and the corresponding Client Handler callback function	
	function SetSubscription($subscriptionList, $callbackFunction)
	{
		global $subscription;
		global $callback;
		
		$subscription = $subscriptionList;
		$callback = $callbackFunction;
	}
		
	// Function for performing a non-subscription signal read
	function ReadSignal($tag)
	{
		global $pdo;
		
		foreach($pdo->query('SELECT * FROM Signals WHERE signal="'.$tag.'" ORDER BY Timestamp DESC Limit 1', PDO::FETCH_ASSOC ) as $row)
		{
			return $row;
		}
	}
	
	// Function for performing a signal value write with optional setting of timestamp and quality
	function WriteSignal($tag, $value, $timestamp=null, $quality=192)
	{
		global $pdo;
		
		if($timestamp==null){$timestamp=date("Y-m-d h:i:s");}
		$pdo->exec('INSERT INTO Signals VALUES ("'.$timestamp.'","'.$tag.'","'.$value.'",'.$quality.')');
	}

	// Function for disconnecting from the SQLite database
	function Disconnect()
	{
		global $pdo;
		
		$dpo = null;
	}
		
	// Function for checking if there are any new signal updates. The function validates any signal changes against the master subscription
	// and only subscribed signals are sent to the Client Handler's callback function. The data server employs a single master subscription
	// to avoid duplication of data if multiple clients are interested in the same data. It is up to the Client Handler to distribute the
	// updates to the individual clients.
	function CheckForSignalUpates()
	{
		global $pdo;
		global $cutoff;

		global $subscription;
		global $callback;
				
		$cutoff_orig = $cutoff;
		$results = [];
		$query = $pdo->query('SELECT * FROM Signals WHERE timestamp>"'.$cutoff.'" ORDER BY timestamp ASC', PDO::FETCH_ASSOC );
		foreach($query as $row)
		{
			if(in_array($row['signal'],$subscription)===true){ array_push($results,$row); }			
			if($row["timestamp"]!="null") { $cutoff = $row["timestamp"]; }
		}
		if($cutoff!=$cutoff_orig){echo "Cutoff is now '".$cutoff."'\r\n";}
		if($results!=NULL)
		{
			echo "Sending updates for ".count($results)." entries\r\n";
			if($callback!=null)
			{
				$callback($results);
			}
		}
	}
}
