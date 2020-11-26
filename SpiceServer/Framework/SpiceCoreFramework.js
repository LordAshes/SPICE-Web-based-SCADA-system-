var websocket = null; 
var signals = [];

function connect(url, callback)
{
	websocket = new WebSocket(url); 
	
	websocket.onopen = function(event)
	{ 
		callback();
	}
	
	websocket.onmessage = function(event)
	{
		incoming(event.data);
	};
	
	websocket.onerror = function(event)
	{
		alert("Error: "+event.message);
	};
	
	websocket.onclose = function(event)
	{
	}; 
}

function channels(list)
{
	websocket.send("channels|"+list);
}

function subscribe(list)
{
	websocket.send("subscribe|"+list);
}

function command(signal,value,timestamp=null,quality=192)
{
	if(timestamp==null)
	{
		var date = new Date();
		timestamp=pad(date.getFullYear(),4)+"-"+pad(date.getMonth()+1)+"-"+pad(date.getDate())+" "+pad(date.getHours())+":"+pad(date.getMinutes())+":"+pad(date.getSeconds());
	}
	websocket.send("command|"+signal+"|"+value+"|"+timestamp+"|"+quality+"|");
}

function message(msg,channel="all")
{
	websocket.send("message|"+channel+"|"+msg);
}

function incoming(request)
{
	var parts = request.split('|');
	switch(parts[0])
	{
		case "message":
		case "signal":
		  request = request.substring(request.indexOf("|")+1);
		  var parts = request.split("|");
		  parts.forEach(function(update)
		  {
			  if(update!="")
			  {
			    var signalName = update.substring(0,update.indexOf("="));
				var signalValue = update.substring(update.indexOf("=")+1);
				signals[signalName]=signalValue;
			  }
		  });
		  if(typeof dataChange === "function"){dataChange(request);}else{baseDataChange(request);}
		  break;
	}
}

function baseDataChange(updates)
{
	var els = document.getElementsByClassName("Dynamic");
	for (let el of els)
	{
		dynamics = el.getAttribute("Dynamic");
		dynamics = "var dynamic=document.getElementById('"+el.id+"');\r\n"+dynamics;
		while(dynamics.indexOf("@[")>-1)
		{
			dynamics = dynamics.replace("@[","dynamic.innerHTML=signals[");
		}
		while(dynamics.indexOf(");")>-1)
		{
			dynamics = dynamics.replace(");",",document.getElementById('"+el.id+"')) ;");
		}
		eval(dynamics);
	};
}

function buildModels()
{
	var els = document.getElementsByClassName("Model");
	for (let el of els) 
	{
		var buildCode = el.getAttribute("Model");
		while(buildCode.indexOf("(")>-1)
		{
			buildCode = buildCode.replace("(","{document.getElementById{'"+el.id+"'),");
		}
		while(buildCode.indexOf("{")>-1)
		{
			buildCode = buildCode.replace("{","(");
		}
		eval(buildCode);
	}
}

function pad(txt,len=2,padding="0")
{
	txt = txt.toString();
	while(txt.length<len)
	{
		txt = padding+txt;
	}
	return txt;
}
