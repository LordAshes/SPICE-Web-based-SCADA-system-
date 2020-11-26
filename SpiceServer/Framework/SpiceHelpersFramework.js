// -----------------------------------------------------------------------------------------------
// Function for setting the text (innerHTML) of a dynamic element based on the signal value.
// The core framework also has a short-cut for this function using the syntax @['SignalName']
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setValue(signal,el)
{
	el.innerHTML=signals[signal];
}

// -----------------------------------------------------------------------------------------------
// Function for text (innerHTML) of a dynamic element based on the value ranges and corresponding
// text enumeration. The text of the first range whose value is greater than or equal to the
// signal values is displayed.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// ranges = Array of values indicating the upper boundaries for each range
// names = Array of names to be displayed for each range
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setText(signal,ranges,names,el)
{
	for(var i=0; i<ranges.length;i++)
	{
		if(parseFloat(signals[signal])<=parseFloat(ranges[i]))
		{
			el.innerHTML=names[i];
			break;
		}
	}
}

// -----------------------------------------------------------------------------------------------
// Function for text color of a dynamic element based on the value ranges and corresponding
// colors. The color of the first range whose value is greater than or equal to the signal values
// is used.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// ranges = Array of values indicating the upper boundaries for each range
// color = Array of colors to be used for each range
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setTextColor(signal,ranges,colors,el)
{
	for(var i=0; i<ranges.length;i++)
	{
		if(parseFloat(signals[signal])<=parseFloat(ranges[i]))
		{
			el.style.color=colors[i];
			break;
		}
	}
}

// -----------------------------------------------------------------------------------------------
// Function for background color of a dynamic element based on the value ranges and corresponding
// colors. The color of the first range whose value is greater than or equal to the signal values
// is used.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// ranges = Array of values indicating the upper boundaries for each range
// color = Array of colors to be used for each range
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setBackgroundColor(signal,ranges,colors,el)
{
	for(var i=0; i<ranges.length;i++)
	{
		if(parseFloat(signals[signal])<=parseFloat(ranges[i]))
		{
			el.style.backgroundColor=colors[i];
			break;
		}
	}
}

// -----------------------------------------------------------------------------------------------
// Function for setting image source of a dynamic element based on the value ranges and an array
// of image sources. The image correspondong to the first range whose value is greater than or
// equal to the signal values is used.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// ranges = Array of values indicating the upper boundaries for each range
// urls = Array of image urls to be used for each range
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setIcon(signal,ranges,urls,el)
{
	for(var i=0; i<ranges.length;i++)
	{
		if(parseFloat(signals[signal])<=parseFloat(ranges[i]))
		{
			el.src=urls[i];
			break;
		}
	}
}

// -----------------------------------------------------------------------------------------------
// Function for opacity of a dynamic element based on the value ranges and corresponding
// opacity. The opacity of the first range whose value is greater than or equal to the signal values
// is used.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// ranges = Array of values indicating the upper boundaries for each range
// opacity = Array of colors to be used for each range
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setOpacity(signal,ranges,opacity,el)
{
	for(var i=0; i<ranges.length;i++)
	{
		if(parseFloat(signals[signal])<=parseFloat(ranges[i]))
		{
			el.style.opacity=opacity[i];
			el.style.backgroundColor.a=opacity[i];
			break;
		}
	}
}

// -----------------------------------------------------------------------------------------------
// Function for setting rotation of a dynamic element based on a min and max value range and a min
// and max rotation range. If the signal is less than the minimum or more than the maximum then it is
// capped to the limits for the purpose of the width calculation.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// vmin = Minimum signal value
// vmax = Maximum signal value
// rmin = Minimum rotate value
// rmax = Maximum rotate	 value
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setRotate(signal,vmin,vmax,rmin,rmax,el)
{
	var signalValue = signals[signal];
	if(signalValue<vmin){signalValue=vmin;}
	if(signalValue>vmax){signalValue=vmax;}
	el.style.transform = "rotate("+parseInt(((rmax-rmin)*((signalValue-vmin)/(vmax-vmin)))+rmin)+"deg)";
}

// -----------------------------------------------------------------------------------------------
// Function for setting width of a dynamic element based on a min and max value range and a min
// and max width range. If the signal is less than the minimum or more than the maximum then it is
// capped to the limits for the purpose of the width calculation.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// vmin = Minimum signal value
// vmax = Maximum signal value
// wmin = Minimum width value
// wmax = Maximum width value
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setWidth(signal,vmin,vmax,wmin,wmax,el)
{
	var signalValue = signals[signal];
	if(signalValue<vmin){signalValue=vmin;}
	if(signalValue>vmax){signalValue=vmax;}
	el.style.width = (((wmax-wmin)*((signalValue-vmin)/(vmax-vmin)))+wmin)+"px";
}

// -----------------------------------------------------------------------------------------------
// Function for setting width of a dynamic element based on a min and max values range and a min
// and max width range. If the signal is less than the minimum or more than the maximum then it is
// capped to the limits for the purpose of the height calculation.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// vmin = Minimum signal value
// vmax = Maximum signal value
// wmin = Minimum width value
// wmax = Maximum width value
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setHeightFromTop(signal,vmin,vmax,hmin,hmax,el)
{
	var signalValue = signals[signal];
	if(signalValue<vmin){signalValue=vmin;}
	if(signalValue>vmax){signalValue=vmax;}
	el.style.height = (((hmax-hmin)*((signalValue-vmin)/(vmax-vmin)))+hmin)+"px";
}

// -----------------------------------------------------------------------------------------------
// Function for setting width of a dynamic element based on a min and max values range and a min
// and max width range. If the signal is less than the minimum or more than the maximum then it is
// capped to the limits for the purpose of the height calculation.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// vmin = Minimum signal value
// vmax = Maximum signal value
// wmin = Minimum width value
// wmax = Maximum width value
// ay = Vertical anchor point
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setHeight(signal,vmin,vmax,hmin,hmax,ay,el)
{
	var signalValue = signals[signal];
	if(signalValue<vmin){signalValue=vmin;}
	if(signalValue>vmax){signalValue=vmax;}
	el.style.height = (((hmax-hmin)*((signalValue-vmin)/(vmax-vmin)))+hmin)+"px";
	el.style.top = (ay-parseInt(el.style.height)+hmin)+"px";
}

// -----------------------------------------------------------------------------------------------
// Function for setting scale of a dynamic element based on a min and max values range and a min
// and max width range. If the signal is less than the minimum or more than the maximum then it is
// capped to the limits for the purpose of the height calculation.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// vmin = Minimum signal value
// vmax = Maximum signal value
// smin = Minimum scale factor value
// smax = Maximum scale factor value
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setScale(signal,vmin,vmax,hmin,hmax,el)
{
	var signalValue = signals[signal];
	if(signalValue<vmin){signalValue=vmin;}
	if(signalValue>vmax){signalValue=vmax;}
	var sf = (((hmax-hmin)*((signalValue-vmin)/(vmax-vmin)))+hmin);
	el.style.transform = "scale("+sf+","+sf+")";
}

// -----------------------------------------------------------------------------------------------
// Function for setting position of a dynamic element based on a min and max value range and a two
// points. If the signal is less than the minimum or more than the maximum then it is
// is capped to the limits for the purpose of the position calculation.
// -----------------------------------------------------------------------------------------------
// signal = Name of the signal whose value is to be displayed
// vmin = Minimum signal value
// vmax = Maximum signal value
// x1 = X coordinate of first point
// y1 = Y coordinate of first point
// x2 = X coordinate of second point
// y2 = Y coordinate of second point
// el = Element containing the dynamic. Filled in automatically by the core framework
// -----------------------------------------------------------------------------------------------
function setPos(signal,vmin,vmax,x1,y1,x2,y2,el)
{
	var signalValue = signals[signal];
	if(signalValue<vmin){signalValue=vmin;}
	if(signalValue>vmax){signalValue=vmax;}
	el.style.position = "absolute";
	el.style.left = (((x2-x1)*((signalValue-vmin)/(vmax-vmin)))+x1)+"px";
	el.style.top = (((y2-y1)*((signalValue-vmin)/(vmax-vmin)))+y1)+"px";
}
