# SPICE (Web based SCADA-system)
-----------------------------------------------------------------
This is a Javascript/PHP/SQLite implementation of a SCADA system. The default configured SCADA screen showcases some of the SCADA system features.

##Installation Notes:
* Requires a PHP enabled web server (such as IIS)
* Copy contents into the wwwroot (or equivalent) folder
* Run the server with: php SpiceServer\Server\SpireServer.php
* Run the client with the browser url: http:\\server\\SpiceServer\Client.html

##Change Log:
* Added getSignals() to Core Framework which automatically detects used signals (typically passed to subscribe)
* Added version object to Core Framework which is updated by each of the 3 Frameworks (for determining version info)

##Known Limitations:

The provided client source code both writes data and visualizes the database stored data. There is no implementation of a connector to field equipment. When collecting data from actual field equipment, the field devices would either communicate over websockets (just like the client) or, for higher performance, write directly to the server database. The current implementation supports either interface but no implementation code is currently provided.

##Coming Soon:
* Automatic subscription functionality.
* Sample code for implementing both styles of interfaces to collect data from field equipment.
* Alarm Server functionality
* Alarm Banner functionality
* Trend Banner functionality  

##Automatic Signal Detection Notes:

The getSignals() function, typically used for automatic subscription, attempts to automatically detetc signals being used by the page and returns a unique set of the signals in a comma separated list format (compatible with the subscribe() function) format. However, there are limits to this automatic detection and in some cases it needs to be either replace with a manaual list or augmented manually. As a general rule, if the signal is written out the automatic detection will likley detect it. However if a signal is constructed dynamically (usually by concatenation of parts) the automatic detection will not work. In such a case one of the below solutions needs to be used.

Basically the automatic signal detection looks through the page SCRIPT code and all element of the Dynamic attributes of all elements of the Dynamic class and searches for the pattern *signals["x"]* and *signals['x']* (where x is one of more characters representing the signal name. This means references such as *signals["Signal1"]* but references such as *signals["Signal"+index]* do not work correctly.

###Automatic Signal Detection - Workaround 1:

Go completely manual (just like the initial version of the SPICE server). The subscribe function takes a comma separated list of signals, so one solution is to not use the getSignals() function at all and instead provide your own list of signals. This solution is ideal for pages which are generated dynamically and have the list of signals in a configuration file or database. It is also suitable for pages with only a few signals since creating a manual list is not an issue.

###Automatic Signal Detection - Workaround 2:

The SetText shortcut does get registered during the getSignals() process because it is expanded out into its actual Javascript function first. Thus any signals which are displayed somewhere with the *@["x"]* syntax will be registered.

###Automatic Signal Detection - Workaround 3:

Since the getSignals() function does not distinguish between comments and code, subscription references can be added in script comments. For example: // signals["Signal3"]
The comment will be ignored by the scripting interpreter but will be recognized by the getSignals() function.

###Automatic Signal Detection - Workaround 4:

A combination of manual and automatic subscription can be used. The getSignals() can be used to automatically detect signals and then the result of it can be appended with additional signals. The result can then be sent to the subscribe() function.
