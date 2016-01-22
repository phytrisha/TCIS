function adjustTemperature (zone) {
	if (currentRotationAngle>lastRotationAngle) {
		window[zone + "TemperatureZoneOutput"]+=rotationStep;
	} else if (currentRotationAngle<lastRotationAngle) {
		window[zone + "TemperatureZoneOutput"]-=rotationStep;
	}
	window[zone + "TemperatureZoneVariable"] = (Math.round(window[zone + "TemperatureZoneOutput"] * 2) / 2).toFixed(1);
	switch(zone) {
		case "Left":
			$("#rightTemperatureZone").css("opacity", 0.5);
			$("#leftTemperatureZone").css("opacity", 1.0);
			break;
		case "Right":
			$("#rightTemperatureZone").css("opacity", 1.0);
			$("#leftTemperatureZone").css("opacity", 0.5);
			break;
	}
}

function applyTemperature (zone) {
	$("#" + zone + "TemperatureZone").html("<h1>"+ window[zone + "TemperatureZoneVariable"]);
	if (window[zone + "TemperatureZoneOutput"]<standardTemp) {
		window[zone + "ColdMeter"]=Math.sqrt(Math.pow((window[zone + "TemperatureZoneOutput"]-standardTemp)/10,2));
		$("#" + zone + "TemperatureCold").css("opacity", window[zone + "ColdMeter"]);
		window[zone + "Border[0]"] = (255 - parseFloat(window[zone + "ColdMeter"]) * 400).toFixed(0);
		window[zone + "Border[1]"] = (255 - parseFloat(window[zone + "ColdMeter"]) * 150).toFixed(0);
		window[zone + "Border[2]"] = 255;
		$("#" + zone + "TempIndicator").css("border-color", "rgb(" + window[zone + "Border[0]"] + "," + window[zone + "Border[1]"] + "," + window[zone + "Border[2]"] + ")".toString());
	} else if (window[zone + "TemperatureZoneOutput"]>standardTemp) {
		window[zone + "HotMeter"]=Math.sqrt(Math.pow((window[zone + "TemperatureZoneOutput"]-standardTemp)/10,2));
		$("#" + zone + "TemperatureHot").css("opacity", window[zone + "HotMeter"]);
		window[zone + "Border[0]"] = 255;
		window[zone + "Border[1]"] = (255 - parseFloat(window[zone + "HotMeter"]) * 350).toFixed(0);
		window[zone + "Border[2]"] = (255 - parseFloat(window[zone + "HotMeter"]) * 500).toFixed(0);;
		$("#" + zone + "TempIndicator").css("border-color", "rgb(" + window[zone + "Border[0]"] + "," + window[zone + "Border[1]"] + "," + window[zone + "Border[2]"] + ")".toString());
	}
}

function activateZone (zone) {
	var inactiveZone;
	if (zone == "left") {
		inactiveZone = "right";
	} else if (zone == "right") {
		inactiveZone = "left";
	}
	window[zone + "KlimaZone"] = true;
	window[inactiveZone + "KlimaZone"] = false;
	switch(zone) {
		case "left":
		case "right":
			$("#" + zone + "TempIndicator").addClass("temperatureIndicatorActive");
			$("#" + inactiveZone + "TempIndicator").removeClass("temperatureIndicatorActive");
			$("." + zone + "ConnectingLine").addClass(zone + "C"+ zone + "NodeActive");
			$("." + zone + "ConnectingLine").removeClass(zone + "CCenterNodeActive");
			$("." + inactiveZone + "ConnectingLine").removeClass(inactiveZone + "C" + inactiveZone + "NodeActive");
			$("." + inactiveZone + "ConnectingLine").removeClass(inactiveZone + "CCenterNodeActive");
			$(".downConnectingLine").removeClass("downConnectingLineActive");
			$(".upConnectingLine").removeClass("upConnectingLineActive");
			$("#centerTempIndicator").removeClass("temperatureIndicatorActive");
			break;
		case "center":
			leftKlimaZone = false;
			rightKlimaZone = false;
			$("#leftTempIndicator").removeClass("temperatureIndicatorActive");
			$("#rightTempIndicator").removeClass("temperatureIndicatorActive");
			$("#centerTempIndicator").addClass("temperatureIndicatorActive");
			$(".leftConnectingLine").removeClass("leftCleftNodeActive");
			$(".leftConnectingLine").addClass("leftCCenterNodeActive");
			$(".rightConnectingLine").removeClass("rightCrightNodeActive");
			$(".rightConnectingLine").addClass("rightCCenterNodeActive");
			$(".downConnectingLine").addClass("downConnectingLineActive");
			$(".upConnectingLine").addClass("upConnectingLineActive");
			closeMenu("temperature", "L");
			closeMenu("temperature", "R");
			break;
	}
}
