version = { "Model": "1.1" };

function uniqueId(base)
{
	var sequence = parseInt(Math.random()*65535);
	while(document.getElementById(base+"_"+sequence)!=null)
	{
		sequence = parseInt(Math.random()*65535);
	}
	return base+"_"+sequence;
}

// ------------------------------------------------------------------
// Model for creating a basic analog thermometer with red indicator
// ------------------------------------------------------------------
// container = Container holding the thermomenter (filled in automatically by the Spice Core Framework
// signal = Signal used to determine the thermometer value
// vmin = Minimum signal value
// vmax = Maximum signal value
// tmin = Label of the minimum thermometer level
// tmid = Label of the mid thermometer level
// tmax = Label of the maximum thermometer level
// units = Label above thermometer indicator (typically the units)
function Thermometer(container,signal,vmin,vmax,tmin,tmid,tmax,units)
{		
	var Thermometer_id = uniqueId("Thermometer");
	var Thermometer_Backplate = document.createElement("IMG");
	Thermometer_Backplate.id = Thermometer_id+"_Backplate";
	Thermometer_Backplate.className = "Part Thermometer";
	Thermometer_Backplate.style.position = "absolute";
	Thermometer_Backplate.style.left = "0px";
	Thermometer_Backplate.style.top = "0px";
	Thermometer_Backplate.style.zIndex = 1;
	Thermometer_Backplate.src = "./Images/Thermometer_BackPlate.png";

	var Thermometer_Indicator = document.createElement("DIV");
	Thermometer_Indicator.id = Thermometer_id+"_Indicator";
	Thermometer_Indicator.className = "Dynamic Part Thermometer";
	Thermometer_Indicator.style.position = "absolute";
	Thermometer_Indicator.style.left = "25px";
	Thermometer_Indicator.style.top = "0px";	
	Thermometer_Indicator.style.zIndex = 2;	
	Thermometer_Indicator.style.width = "65px";
	Thermometer_Indicator.style.backgroundColor = "red";
	Thermometer_Indicator.setAttribute("Dynamic","setHeight_('"+signal+"',0,100,65,270,280);");

	var Thermometer_Frontplate = document.createElement("IMG");
	Thermometer_Frontplate.id = Thermometer_id+"_Frontplate";
	Thermometer_Frontplate.className = "Part Thermometer";
	Thermometer_Frontplate.style.position = "absolute";
	Thermometer_Frontplate.style.left = "0px";
	Thermometer_Frontplate.style.top = "0px";
	Thermometer_Frontplate.style.zIndex = 3;	
	Thermometer_Frontplate.src = "./Images/Thermometer_FrontPlate.png";

	var Thermometer_Scale_Max = document.createElement("span");
	Thermometer_Scale_Max.id = Thermometer_id+"_Scale_Max";
	Thermometer_Scale_Max.className = "Part Thermometer";
	Thermometer_Scale_Max.innerHTML=tmax;
	Thermometer_Scale_Max.style.position = "absolute";
	Thermometer_Scale_Max.style.left = "10px";
	Thermometer_Scale_Max.style.top = "65px";	
	Thermometer_Scale_Max.style.zIndex = 4;	

	var Thermometer_Scale_Mid = document.createElement("span");
	Thermometer_Scale_Mid.id = Thermometer_id+"_Scale_Mid";
	Thermometer_Scale_Mid.className = "Part Thermometer";
	Thermometer_Scale_Mid.innerHTML=tmid;
	Thermometer_Scale_Mid.style.position = "absolute";
	Thermometer_Scale_Mid.style.left = "10px";
	Thermometer_Scale_Mid.style.top = "170px";	
	Thermometer_Scale_Mid.style.zIndex = 5;	

	var Thermometer_Scale_Min = document.createElement("span");
	Thermometer_Scale_Min.id = Thermometer_id+"_Scale_Min";
	Thermometer_Scale_Min.className = "Part Thermometer";
	Thermometer_Scale_Min.innerHTML=tmin;
	Thermometer_Scale_Min.style.position = "absolute";
	Thermometer_Scale_Min.style.left = "10px";
	Thermometer_Scale_Min.style.top = "270px";	
	Thermometer_Scale_Min.style.zIndex = 6;	

	var Thermometer_Units = document.createElement("span");
	Thermometer_Units.id = Thermometer_id+"_Scale_Min";
	Thermometer_Units.className = "Part Thermometer";
	Thermometer_Units.innerHTML=units;
	Thermometer_Units.style.position = "absolute";
	Thermometer_Units.style.left = "50px";
	Thermometer_Units.style.top = "25px";	
	Thermometer_Units.style.zIndex = 7;	
	
	container.appendChild(Thermometer_Backplate);
	container.appendChild(Thermometer_Indicator);
	container.appendChild(Thermometer_Frontplate);
	container.appendChild(Thermometer_Scale_Max);
	container.appendChild(Thermometer_Scale_Mid);
	container.appendChild(Thermometer_Scale_Min);
	container.appendChild(Thermometer_Units);
	
	return Thermometer_id;
}

// ---------------------------------------------------------------------------------------------------
// Model for creating an analog thermometer with indicator that changes color according to ranges
// ---------------------------------------------------------------------------------------------------
// container = Container holding the thermomenter (filled in automatically by the Spice Core Framework
// signal = Signal used to determine the thermometer value
// vmin = Minimum signal value
// vmax = Maximum signal value
// tmin = Label of the minimum thermometer level
// tmid = Label of the mid thermometer level
// tmax = Label of the maximum thermometer level
// units = Label above thermometer indicator (typically the units)
// ranges = Array of ranges for determining color boundaries
// colors = Array of colors associated with each range
function ThermometerRanged(container,signal,vmin,vmax,tmin,tmid,tmax,units,ranges,colors)
{
	var id = Thermometer(container,signal,vmin,vmax,tmin,tmid,tmax,units);
	var el = document.getElementById(id+"_Indicator");
	var dynamic = el.getAttribute("Dynamic");
	var colorString = "";
	for(let c in colors)
	{
		colorString = colorString + "'"+colors[c]+"',";
	}
	colorString = colorString.substring(0,colorString.length-1);
	el.setAttribute("Dynamic",dynamic+"setBackgroundColor_('"+signal+"',["+ranges+"],["+colorString+"]);");

	return id;
}

// ---------------------------------------------------------------------------------------------------
// Model for creating an analog gause with calculated ticks from min to max
// ---------------------------------------------------------------------------------------------------
// container = Container holding the thermomenter (filled in automatically by the Spice Core Framework
// signal = Signal used to determine the thermometer value
// vmin = Minimum signal value
// vmax = Maximum signal value
// smin = Label of the minimum dial level
// smax = Label of the maximum dial level
// units = Label above thermometer indicator (typically the units)
function Gauge(container,signal,vmin,vmax,smin,smax,units)
{
	var Gauge_id = uniqueId("Gauge");
	var Gauge_Backplate = document.createElement("IMG");
	Gauge_Backplate.id = Gauge_id+"_Backplate";
	Gauge_Backplate.className = "Part Gauge";
	Gauge_Backplate.style.position = "absolute";
	Gauge_Backplate.style.left = "0px";
	Gauge_Backplate.style.top = "0px";
	Gauge_Backplate.style.zIndex = 1;
	Gauge_Backplate.src = "./Images/Gauge_Body.png";

	var positions =
	[
		{"x":80,"y":235,"align":"left"},
		{"x":60,"y":185,"align":"left"},
		{"x":65,"y":130,"align":"left"},
		{"x":90,"y":90,"align":"left"},
		{"x":120,"y":65,"align":"left"},
		{"x":170,"y":55,"align":"ceter"},
		{"x":130,"y":65,"align":"right"},
		{"x":160,"y":95,"align":"right"},
		{"x":185,"y":135,"align":"right"},
		{"x":190,"y":185,"align":"right"},
		{"x":175,"y":235,"align":"right"},
	];
	
	var tick = 0;
	var tickValue = (smax-smin)/10;
	for(pos of positions)
	{
		var Gauge_Scale = document.createElement("span");
		Gauge_Scale.id = Gauge_id+"_Tick_"+tick;
		Gauge_Scale.className = "Part Gauge";
		Gauge_Scale.innerHTML=parseInt(tick*tickValue+smin);
		Gauge_Scale.style.position = "absolute";
		Gauge_Scale.style.left = pos['x']+"px";
		Gauge_Scale.style.top = pos['y']+"px";
		Gauge_Scale.style.zIndex = 2;	
		Gauge_Scale.style.width = "120px";
		Gauge_Scale.style.fontSize = "24px";
		Gauge_Scale.style.textAlign = pos['align'];		
		
		container.appendChild(Gauge_Scale);
		
		tick++;
	}

	var Gauge_Units = document.createElement("span");
	Gauge_Units.id = Gauge_id+"_Scale_Min";
	Gauge_Units.className = "Part Gauge";
	Gauge_Units.innerHTML=units;
	Gauge_Units.style.position = "absolute";
	Gauge_Units.style.left = "125px";
	Gauge_Units.style.top = "240px";
	Gauge_Units.style.width = "120px";
	Gauge_Units.style.zIndex = 3;	
	Gauge_Units.style.fontSize = "28px";
	Gauge_Units.style.textAlign = "center";

	var Gauge_Indicator = document.createElement("IMG");
	Gauge_Indicator.id = Gauge_id+"_Indicator";
	Gauge_Indicator.className = "Dynamic Part Gauge";
	Gauge_Indicator.style.position = "absolute";
	Gauge_Indicator.style.left = "0px";
	Gauge_Indicator.style.top = "0px";	
	Gauge_Indicator.style.zIndex = 4;	
	Gauge_Indicator.src = "./Images/Gauge_Needle.png";
	Gauge_Indicator.style.visibility = "visible";
	Gauge_Indicator.setAttribute("Dynamic","setRotate_('"+signal+"',0,100,-120,120);");

	container.appendChild(Gauge_Backplate);
	container.appendChild(Gauge_Indicator);
	container.appendChild(Gauge_Units);
	
	return Gauge_id;
}