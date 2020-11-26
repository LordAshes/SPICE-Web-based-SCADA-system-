<?php

// Class for handling client websocket requests
class ClientHandler
{
	// Array of dictionaries for holding client data including client id, client channels, client subscription and client socket
	private $clientData = [];
	
	// Reference to the data server
	private $dataServer = null;
	
	// Class constructor updates the local data server reference pass to it by the websocket server
	function __construct($dataServer)
	{
		$this->dataServer = $dataServer;
	}
	
	// Function for processing client connections
	function connection($client_ip_address, $socket)
	{
		global $clientData;
		
		echo "Connected $client_ip_address\r\n";
		$message = 'New client ' . $client_ip_address.' connected';
		$this->clientData[(int)$socket]=['id'=> $client_ip_address, 'channels'=>['all'], 'subscription'=>'', 'socket'=>$socket];
		$this->send($message,"connections");
	}
	
	// Function for processing client disconnections
	function disconnection($client_ip_address, $socket)
	{
		global $clientData;
		
		echo "Disconnected $client_ip_address\r\n";
		$message = 'Client ' . $client_ip_address.' disconnected';
		unset($this->clientData[(int)$socket]);
		$this->send($message,"connections");
		$this->updateDataServerSubscription();
	}
	
	// Function for processing client requests
	function receive($client_ip_address, $socket, $sealedMessage)
	{
		global $clientData;
		
		$message = $this->unseal($sealedMessage);
		$action = substr($message,0,strpos($message,"|"));
		$message = substr($message,strpos($message,"|")+1);
		echo "Source: ".$client_ip_address."\r\n";
		echo "Action: ".$action."\r\n";
		switch(strtolower($action))
		{
			// Determines the communication channels that the client is listening to
			case "channels":
			    echo "Client ".$client_ip_address." set channels to ".$message."\r\n";
				$this->clientData[(int)$socket]['channels']=explode(',',$message);
		    break;	
			// Determines the signals that the client is interested in getting updates for
			case "subscribe":
				echo "Client ".$client_ip_address." has subscribed to ".$message."\r\n";
				$this->clientData[(int)$socket]['subscription']=explode(',',$message);
				$this->updateDataServerSubscription();
				$initial = [];
				forEach(explode(',',$message) as $signal)
				{
					array_push($initial,$this->dataServer->ReadSignal($signal));
				}
				$this->dataChange($initial);
		    break;	
			// Request to change a signal's value (and/or timestamp and quality)
			case "command":
				$parts = explode("|",$message);
				if(isset($parts[2])===false){$parts[2]=date("Y-m-d h:i:s");}
				if(isset($parts[3])===false){$parts[3]=192;}
				$this->dataServer->WriteSignal($parts[0],$parts[1],$parts[2],$parts[3]);
		    break;	
			// Request to send other clients a message based on communication channel
			case "message":
				$channel = strtolower(substr($message,0,strpos($message,"|")));
				$message = substr($message,strpos($message,"|")+1);
				$this->send("message|".$message,$channel);
		    break;	
		}
	}
	
	// Function to send a client a message based on communication channels. By default, a client subscribes to the "all" channel.
	// Messages can be sent using the all channel or can specify any other channel. Only clients which subscribe to the indicated
	// channel will obtain the message. This allows clients to send broadcasts or to communicate with other client without having
	// to set a signal on the data server.
	function send($message,$channel="all")
	{
		global $clientData;
		
		$sealedMessage = $this->seal($message);
		$messageLength = strlen($sealedMessage);
		echo "Send: '".$message."' to channel '".$channel."'\r\n";
		foreach($this->clientData as $socket=>$client)
		{
			if(in_array($channel,$client['channels'])===true)
			{
				@socket_write($client['socket'],$sealedMessage,$messageLength);
			}
		}
	}
	
	// Update master subscription on the data server. Called when a client subscription changes and when a client disconnects.
	function updateDataServerSubscription()
	{
		global $clientData;
		global $dataServer;
		
		$masterSubscription = [];
		foreach($this->clientData as $socket=>$client)
		{
			if($client['subscription']==NULL)
			{
				echo "Client ".$client['id']." has a empty subscription.\r\n";
			}
			else			
			{
				foreach($client['subscription'] as $subscriptionItem)
				{
					if(in_array($subscriptionItem,$masterSubscription)===false)
					{
						array_push($masterSubscription,$subscriptionItem);
					}
				}
			}
		}
		$this->dataServer->SetSubscription($masterSubscription, function($signals){$this->dataChange($signals);});
	}
	
	// Callback function containing any signals changes for any signals in the master data server subscription.
	// It is the responsibility of this callback function to send each signal update to the appropriate client or clients.
	function dataChange($signals)
	{
		global $clientData;
		
		// Check each client
		foreach($this->clientData as $socket=>$client)
		{
			// Process each signal update
			$message = "signal|";
			foreach($signals as $signal)
			{
				// Check to see if client subscribes to the signal
				if(in_array($signal['signal'],$client['subscription'])===true)
				{
					// Build individual signals updates for the value, timestamp and quality
					$message = $message .$signal['signal']."=".$signal['value']."|";
					$message = $message .$signal['signal'].".timestamp=".$signal['timestamp']."|";
					$message = $message .$signal['signal'].".quality=".$signal['quality']."|";
				}
			}

			// Check to see if any signal updates are subscribed ones
			if($message!="signal|")
			{
				$sealedMessage = $this->seal($message);
				$messageLength = strlen($sealedMessage);
				
				@socket_write($client['socket'],$sealedMessage,$messageLength);
			}
		}
	}

	// Convert a sealed (encoded) webscoket message to a unsealed (decoded) message
	function unseal($socketData)
	{
		$length = ord($socketData[1]) & 127;
		if($length == 126) {
			$masks = substr($socketData, 4, 4);
			$data = substr($socketData, 8);
		}
		elseif($length == 127) {
			$masks = substr($socketData, 10, 4);
			$data = substr($socketData, 14);
		}
		else {
			$masks = substr($socketData, 2, 4);
			$data = substr($socketData, 6);
		}
		$socketData = "";
		for ($i = 0; $i < strlen($data); ++$i) {
			$socketData .= $data[$i] ^ $masks[$i%4];
		}
		return $socketData;
	}

	// Convert an unsealed (decoded) message to a sealed (encoded) websocket message
	function seal($socketData)
	{
		$b1 = 0x80 | (0x1 & 0x0f);
		$length = strlen($socketData);
		
		if($length <= 125)
			$header = pack('CC', $b1, $length);
		elseif($length > 125 && $length < 65536)
			$header = pack('CCn', $b1, 126, $length);
		elseif($length >= 65536)
			$header = pack('CCNN', $b1, 127, $length);
		return $header.$socketData;
	}

	// Function for performing a wbesocket handshake
	function doHandshake($received_header,$client_socket_resource, $host_name, $port)
	{
		$headers = array();
		$lines = preg_split("/\r\n/", $received_header);
		foreach($lines as $line)
		{
			$line = chop($line);
			if(preg_match('/\A(\S+): (.*)\z/', $line, $matches))
			{
				$headers[$matches[1]] = $matches[2];
			}
		}

		$secKey = $headers['Sec-WebSocket-Key'];
		$secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
		$buffer  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
		"Upgrade: websocket\r\n" .
		"Connection: Upgrade\r\n" .
		"WebSocket-Origin: $host_name\r\n" .
		"WebSocket-Location: ws://$host_name:$port/demo/shout.php\r\n".
		"Sec-WebSocket-Accept:$secAccept\r\n\r\n";
		socket_write($client_socket_resource,$buffer,strlen($buffer));
	}
}
?>