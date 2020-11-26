<?PHP

interface iDataPollServer
{
	function Connect($connectionString);
		
	function SetSubscription($subscription, $callback);
			
	function ReadSignal($tag);
	
	function WriteSignal($tag, $value, $timestamp, $quality);
	
	function Disconnect();
	
	function CheckForSignalUpates();	
}