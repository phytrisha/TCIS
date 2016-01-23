function closeMenu (type, side) {
	$("." + type + "Menu" + side).css("opacity", 0.0);
	if (type == "multimedia") {
		menuPlaybackOpen=false;
	}
	switch(side) {
		case "L":
			menuLeftOpen=false;
			$("#leftTemperatureZone").css("opacity", 1.0);
			if (leftKlimaZone) {
				$("#rightTemperatureZone").css("opacity", 0.5);
			} else {
				$("#rightTemperatureZone").css("opacity", 1.0);
			}
			break;
		case "R":
			menuRightOpen=false;
			$("#rightTemperatureZone").css("opacity", 1.0);
			if (rightKlimaZone) {
				$("#leftTemperatureZone").css("opacity", 0.5);
			} else {
				$("#leftTemperatureZone").css("opacity", 1.0);
			}
			break;
		default:
			menuLeftOpen=false;
			menuRightOpen=false;
	}
}

function openMenu (side) {
	menuActivePoint = 0;
	switch(side) {
		case "L":
			menuLeftOpen=true;
			closeMenu("temperature", "R");
			$("#leftTemperatureZone").css("opacity", 0.0);
			$("#rightTemperatureZone").css("opacity", 0.5);
			break;
		case "R":
			menuRightOpen=true;
			closeMenu("temperature", "L");
			$("#rightTemperatureZone").css("opacity", 0.0);
			$("#leftTemperatureZone").css("opacity", 0.5);
			break;
		case "Playback":
			menuPlaybackOpen=true;
			break;
	}
}

function fadeMenuPoints (side, active) {
	for (var i = -1; i < 2; i++) {
		if (i == active) {
			$("#" + side + "Point" + ((i*-1)+2)).css("opacity", 1.0);
		} else if (i == active+2 || i == active-2) {
			$("#" + side + "Point" + ((i*-1)+2)).css("opacity", 0.0);
		} else {
			$("#" + side + "Point" + ((i*-1)+2)).css("opacity", 0.5);
		}
	}
}

function tangibleMenuHandler (type, angle, side, center, step) {
	if (angle == (menuStep * menuActivePoint)) {
		menuActivePoint++;
	} else if (angle == (-menuStep + menuStep * (menuActivePoint-1))) {
		menuActivePoint--;
	}
	menuActivePoint = Math.min(Math.max(parseInt(menuActivePoint), -1), 1);
	fadeMenuPoints(side, menuActivePoint);
	switch(menuActivePoint) {
		case -1:
			$("." + type + "Menu" + side).css("left", (center-step) + "px");
			break;
		case 0:
			$("." + type + "Menu" + side).css("left", center + "px");
			break;
		case 1:
			$("." + type + "Menu" + side).css("left", (center+step) + "px");
			break;
	}
	console.log(menuActivePoint);
}

function openMenuElement (elem) {
	console.log("open " + elem);
	elem = Math.sqrt(elem);
	switch(elem) {
		case 1:
			$(".albumOverview").addClass("active");
			$(".albumPlaybackView").removeClass("active");
			albumOverview=true;
			break;
		case 2:
			$(".artistOverview").addClass("active");
			$(".albumPlaybackView").removeClass("active");
			artistOverview=true;
			break;
	}
	closeMenu();
}

















