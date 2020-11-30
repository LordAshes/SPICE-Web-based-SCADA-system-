var websocket = null; 
var signals = [];
var version = { "Core": "1.1" };

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

function getSignals()
{
	var content = "";
	var list = "";
	for(script of document.scripts)
	{
		content = content + "[SCRIPT]\r\n" + script.text + "\r\n";
	}
	for(el of document.getElementsByClassName("Dynamic"))
	{
		content = "[ELEMENT]\r\n" + buildDynamicsCode(el) + "\r\n" + content;
	}

	var list = [];
    var work = content;
	while(work.indexOf("signals['")>0)
	{
		work = work.substring(work.indexOf("signals['")+("signals['".length));
		signal = work.substring(0,work.indexOf("'"));
		if(!list.includes(signal)){list.push(signal);}
	}
	var work = content;
	while(work.indexOf('signals["')>0)
	{
		work = work.substring(work.indexOf('signals["')+('signals["'.length));
		signal = work.substring(0,work.indexOf('"'));
		if(!list.includes(signal)){list.push(signal);}
	}
	return list.join();
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
		eval(buildDynamicsCode(el));
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

/* --- Helper Functions --- */

function buildDynamicsCode(el)
{
	var dynamics = "var dynamic=document.getElementById('"+el.id+"');\r\n"+el.getAttribute("Dynamic");
	while(dynamics.indexOf("@[")>-1)
	{
		dynamics = dynamics.replace("@[","dynamic.innerHTML=signals[");
	}
	while(dynamics.indexOf(");")>-1)
	{
		dynamics = dynamics.replace(");",",document.getElementById('"+el.id+"')) ;");
	}
	return dynamics;
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
