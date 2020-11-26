# SPICE (Web based SCADA-system)
-----------------------------------------------------------------
This is a Javascript/PHP/SQLite implementation of a SCADA system. The default configured SCADA screen showcases some of the SCADA system features.

Installation Notes:
* Requires a PHP enabled web server (such as IIS)
* Copy contents into the wwwroot (or equivalent) folder
* Run the server with: php SpiceServer\Server\SpireServer.php
* Run the client with the browser url: http:\\server\\SpiceServer\Client.html

Known Limitations:

The provided client source code both writes data and visualizes the database stored data. There is no implementation of a connector to field equipment. When collecting data from actual field equipment, the field devices would either communicate over websockets (just like the client) or, for higher performance, write diretcly to the server database. The current implementation supports either interface but no implementation code is currently provided.

Coming Soon:
* Sample code for implementing both styles of interfaces to collect data from field equipment.
* Alarm Server functionality
* Alarm Banner functionality
* Trend Banner functionality  

