<?php
define('HOST_NAME',"localhost"); 
define('PORT',"8090");
$null = NULL;

require_once("SQLiteServer.php");
require_once("ClientHandler.php");

$dataServer = new SQLiteServer();
$dataServer->Connect("..\Database\SpiceData.db");

$clientHandler = new ClientHandler($dataServer);

$socketResource = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_set_option($socketResource, SOL_SOCKET, SO_REUSEADDR, 1);
socket_bind($socketResource, 0, PORT);
socket_listen($socketResource);

$clientSocketArray = array($socketResource);
while (true)
{
	$newSocketArray = $clientSocketArray;
	socket_select($newSocketArray, $null, $null, 0, 10);
	
	if (in_array($socketResource, $newSocketArray))
	{
		$newSocket = socket_accept($socketResource);
		$clientSocketArray[] = $newSocket;
		
		$header = socket_read($newSocket, 1024);
		$clientHandler->doHandshake($header, $newSocket, HOST_NAME, PORT);
		
		socket_getpeername($newSocket, $client_ip_address, $port);
		$clientHandler->connection($client_ip_address.":".$port,$newSocket);
		
		$newSocketIndex = array_search($socketResource, $newSocketArray);
		unset($newSocketArray[$newSocketIndex]);
	}
	
	foreach ($newSocketArray as $newSocketArrayResource) 
	{	
		while(socket_recv($newSocketArrayResource, $socketData, 1024, 0) >= 1)
		{
			socket_getpeername($newSocketArrayResource, $client_ip_address, $port);
			$clientHandler->receive($client_ip_address.":".$port, $newSocketArrayResource, $socketData);
			break 2;
		}
		
		$socketData = @socket_read($newSocketArrayResource, 1024, PHP_NORMAL_READ);
		if ($socketData === false)
		{ 
			socket_getpeername($newSocketArrayResource, $client_ip_address, $port);
			$clientHandler->disconnection($client_ip_address.":".$port,$newSocketArrayResource);
			
			$newSocketIndex = array_search($newSocketArrayResource, $clientSocketArray);
			unset($clientSocketArray[$newSocketIndex]);			
		}
	}
	
	$dataServer->CheckForSignalUpates();
	usleep(250000);
}
socket_close($socketResource);