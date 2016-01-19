var minLim = 60;
var maxLim = 180;

var tangible = false;

var centerX;
var centerY;

var initAngle = true;
var initPos = true;

var gestureSuccess = false;

var posStart = [2];
var menuActivePoint;
var menuStep = 20;
var rotationMultiplier;

var leftColdMeter;
var leftHotMeter;

var rightColdMeter;
var rightHotMeter;

var currentRotationAngle;
var lastRotationAngle;

var klimaArea=false;
var multimediaArea=false;

var leftKlimaZone = false;
var rightKlimaZone = false;

var tempMax = 28;
var tempMin = 15;
var standardTemp=(tempMin+tempMax)/2;

var leftTemperatureZoneOutput = standardTemp;
var leftTemperatureZoneVariable = standardTemp;

var rightTemperatureZoneOutput = standardTemp;
var rightTemperatureZoneVariable = standardTemp;

var multimediaScrollYPos;
var multimediaScrollYReferencePos;

var updateScroll=false;

var currentScrollYPos;
var referenceScrollYPos;

var captureStartScroll=true;

var lastScrollYPos;
var lastScrollYSpeed;

var scrollingEvent = false;
var touchEvent = false;

var rotationStep = 0.02;

var leftBorder = [2];
var rightBorder = [2];

var readyForTouch = false;

var readyForAlbumDetail = false;

var endTouch;

var menuLeftOpen = false;
var menuRightOpen = false;

var menuPlaybackOpen = false;

var albumName = [];
var albumArtist = [];
var songs = [];
var songLengths = [];

var currentY;
var startY;
var getTouch;

function getAlbums (data) {
	for (var i = 0; i < data.length; i++) {
		albumName[i] = data[i].name;
		albumArtist[i] = data[i].artist;
		songs[i] = new Array(data[i].song.length);
		songLengths[i] = new Array(data[i].length.length);
		for (var j = 0; j < data[i].song.length; j++) {
			songs[i][j] = data[i].song[j];
			songLengths[i][j] = data[i].length[j];
		};
	};
}

function scrollHandler (elem, scrollVar) {
   if (updateScroll!=true) {
		lastScrollYSpeed*=0.95;
		scrollVar+=(-lastScrollYSpeed);
	}
	scrollVar = Math.min(Math.max(parseInt(scrollVar), -1750), 100);
	$(elem).css("top", scrollVar + "px");
}

function checkElementForTouch (elem, parent, count, x, y) {
	var offset = parseFloat($(parent).css("top"));
	for (var i = 1; i < count+1; i++) {
		var pos = $(elem + i.toString()).position();
		var posYMin = pos.top + offset;
		var posXMin = pos.left;
		var posYMax = pos.top + parseFloat($(elem + i.toString()).css("height")) + offset;
		var posXMax = pos.left + parseFloat($(elem + i.toString()).css("width"));
		if (x>posXMin && y>posYMin && x<posXMax && y<posYMax) {
			return i;
		}
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
			rightKlimaZone =false;
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

function tangibleGestureHandler (currentY, startY, distance) {
	if (gestureSuccess != true) {
		if (currentY > startY + distance) {
			gestureSuccess = true;
			return gestureSuccess;
		}
	}
}

function displayAlbum (album) {
	var elemOffset = $("#album" + album).offset();
	$(".albumDetailArtist").html("");
	$(".albumDetailTitle").html("");
	$(".albumViewContainer").append($("#album" + album));
	$("#album" + album).css("position", "fixed");
	$("#album" + album).css("left", elemOffset.left);
	$("#album" + album).css("top", elemOffset.top);
	$(".albumOverview").removeClass("active");
	$("#album" + album).animate({
		left: "20",
		top: "20"
	}, 300, "swing");
	$(".albumDetailArtist").html("<h2 class='albumDetailArtistTypo'>"+albumArtist[album-1]+"</h2>");
	$(".albumDetailTitle").html("<h1>"+albumName[album-1]+"</h1>");
	$(".albumDetail").css("opacity", 1.0);
	for (var i = 0; i < songs[album-1].length; i++) {
		if (i==0) {
			$(".albumDetailTitles").append("<div class='albumDetailTitleContent first' id=albumContentTitle"+(i+1)+"></div");
		} else {
			$(".albumDetailTitles").append("<div class='albumDetailTitleContent' id=albumContentTitle"+(i+1)+"></div");
		}
		$("#albumContentTitle" + (i+1)).append("<h2 class='albumDetailLabel'>"+ (i+1) + "</h2>");
		$("#albumContentTitle" + (i+1)).append("<h2 class='albumDetailLabel title'>"+ songs[album-1][i] + "</h2>");
		$("#albumContentTitle" + (i+1)).append("<h2 class='albumDetailLabel length'>"+ songLengths[album-1][i] + "</h2>");
	};
	$(".albumPlaybackBackgroundFrame").html("<div class='currentAlbumPlayback' id='blur"+album+"'></div>");
	$(".albumPlaybackBackgroundFrame").addClass("active");
}

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
}

function openMenuElement (elem) {
	console.log(elem)
	switch(elem) {
		case 1:
			$(".albumOverview").addClass("active");
			$(".albumPlaybackView").removeClass("active");
			break;
	}
}

// initialize area for jquery.touch
$("#touch-area").touchInit();

// touch handler function
var handler = function (e) {

	// collect data of touch points
	var showData =
	{
		touches: e.touches
	};

	// define tracking points
	var x = [];
	var y = [];
	
	// define distanes of tracking points
	var dist = [];

	// write from gathered touchpoints to tracking points
	for (var i = showData.touches.length - 1; i >= 0; i--) {
		x[i] = showData.touches[i].screenX;
		y[i] = showData.touches[i].screenY;
	};

	if (showData.touches.length==0) {
		// cancel extreme speeds and limit fast speeds
		lastScrollYSpeed=currentScrollYPos-lastScrollYPos;
		lastScrollYSpeed = Math.min(Math.max(parseInt(lastScrollYSpeed), -50), 50);
		updateScroll=false;

	} else if (showData.touches.length == 4) {

		centerX = (x[0]+x[1]+x[2]+x[3])/showData.touches.length;
		centerY = (y[0]+y[1]+y[2]+y[3])/showData.touches.length;

		for (var i = 0; i < showData.touches.length; i++) {
			if (i < showData.touches.length) {
				dist[i] = Math.sqrt(Math.pow(x[i]-centerX,2)+Math.pow(y[i]-centerY,2));
				if (dist[i] < maxLim && dist[i] > minLim) {
					tangible = true;
				} else {
					tangible = false;
				}
			}
		}

		if (tangible) {

			touchEvent = false;
			scrollingEvent = false;
			readyForTouch=false;

			// determine two points for rotation calculation
			var p1 = {
				x: x[0],
				y: y[0]
			}
			var p2 = {
				x: x[1],
				y: y[1]
			}

			// calculate rotation between two points
			var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

			// initialize reference angle
			if (initAngle) {
				angleStart = angleDeg;
				initAngle = false;
			}

			if (initPos) {
				posStart = [centerX, centerY];
				initPos = false;
			}
 
			// calculate & round resulting rotation angle
			currentRotationAngle = Math.round(angleDeg - angleStart);

			if (multimediaArea) {
				if (menuPlaybackOpen) {
					$(".multimediaMenu").css("opacity", 1.0);
					tangibleMenuHandler("multimedia", currentRotationAngle, "", 96, 192);
					if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
						closeMenu("multimedia", "");
						$(".currentTitleLabel").removeClass("inactive");
						menuPlaybackOpen=false;
					}
				}
			}

			if (klimaArea) {
				if (leftKlimaZone) {
					if (menuRightOpen) {
						closeMenu("temperature", "R");
					}
					if (menuLeftOpen!=true) {
						adjustTemperature("left");
					} else if (menuLeftOpen) {
						$(".temperatureMenuL").css("opacity", 1.0);
						tangibleMenuHandler("temperature", currentRotationAngle, "L", -128, 192);
						if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
							closeMenu("temperature", "L");
						}
					}
				} else if (rightKlimaZone) {
					if (menuLeftOpen) {
						closeMenu("temperature", "L");
					}
					if (menuRightOpen!=true) {
						adjustTemperature("right");
					} else if (menuRightOpen) {
						$(".temperatureMenuR").css("opacity", 1.0);
						tangibleMenuHandler("temperature", currentRotationAngle, "R", 320, 192);
						if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
							closeMenu("temperature", "R");
						}
					}
				}
				if (leftTemperatureZoneOutput > tempMax) {
					leftTemperatureZoneOutput = tempMax;
				} else if (leftTemperatureZoneOutput < tempMin) {
					leftTemperatureZoneOutput = tempMin;
				}
				if (rightTemperatureZoneOutput > tempMax) {
					rightTemperatureZoneOutput = tempMax;
				} else if (rightTemperatureZoneOutput < tempMin) {
					rightTemperatureZoneOutput = tempMin;
				}
			}

			// trigger panels based on x coordinates of tangible item
			if (centerX<256) {
				activateZone("left");
			} else if (centerX>512) {
				activateZone("right");
			} else {
				activateZone("center");
			}

			// trigger areas based on y coordinates of tangible item
			if (centerY>700) {
				klimaArea=false;
				multimediaArea=true;
			} else if (centerY<700) {
				klimaArea=true;
				multimediaArea=false;
			}
		}
	} else {
		// reset tangible item recognition if not enough points are available
		tangible=false;
		initAngle = true;
		initPos = true;
		window.setTimeout(
			function() {
				readyForTouch = true;
		}, 1000);
	}

	$("#currentAreaTitle").css("opacity", 1.0);
	if (klimaArea) {
		$("#currentAreaTitle").html("");
		applyTemperature("left");
		applyTemperature("right");

		$(".temperatureView").addClass("visible");
		$(".albumOverview").removeClass("albumOverviewActive");
		$(".albumVContainer").removeClass("albumOverviewContainerVisible");
		$("#albumScroll").css("opacity", 0.0);
		$("#albumFade").css("opacity", 0.0);
		$(".currentAlbumPlayback").removeClass("active");
		$(".albumFadeOutOverlay").removeClass("visible");
	} else if (multimediaArea) {
		$("#currentAreaTitle").html("<h1></h1>")
		$(".showTemperature").removeClass("showTemperatureVisible");
		$("#albumScroll").css("opacity", 1.0);
		$("#albumFade").css("opacity", 1.0);
		$(".albumPlayback").addClass("active");
		$(".albumViewContainer").addClass("albumOverviewContainerVisible");
		$(".temperatureView").removeClass("visible");
		$(".currentAlbumPlayback").addClass("active");
		$(".albumFadeOutOverlay").addClass("visible");
	}

	if (showData.touches.length==1) {
		if (getTouch) {
			startY = y[0];
			getTouch=false;
		}
		currentY = y[0];
		
		if (captureStartScroll) {
			multimediaScrollYReferencePos=parseInt($(".albumOverview").css('top'));
			referenceScrollYPos=showData.touches[0].screenY;
			captureStartScroll=false;
		}	
		if (scrollingEvent) {
			currentScrollYPos=showData.touches[0].screenY;
			resultingScroll=currentScrollYPos-referenceScrollYPos;
			multimediaScrollYPos=multimediaScrollYReferencePos+resultingScroll;
			updateScroll=true;
		} else if (touchEvent) {
			var clickedAlbum = checkElementForTouch("#album", ".albumOverview", 48, x[0], y[0]);
			displayAlbum(clickedAlbum);
		}
	} 

	if (showData.touches.length==5) {
		if (leftKlimaZone) {
			openMenu("L");
		} else if (rightKlimaZone) {
			openMenu("R");
		} else if (multimediaArea) {
			if (menuPlaybackOpen != true) {
				openMenu("Playback");
				$(".currentTitleLabel").addClass("inactive");
			} else if (menuPlaybackOpen) {
				openMenuElement(menuActivePoint);
				closeMenu("multimedia", "");
				$(".currentTitleLabel").removeClass("inactive");
				menuPlaybackOpen=false;
			}
		}
	}		
};
// execute functions
$("#touch-area").on("touch_start", function(event) {
	gestureSuccess = false;
	getTouch=true;
	window.setTimeout(function() {
		if (currentY == startY) {
			touchEvent = true;
			scrollingEvent = false;
			console.log("TOUCH " + touchEvent);
		}
		handler(event);
	},100);
	
});

$("#touch-area").on("touch_move", function(event){
	touchEvent = false;
	scrollingEvent = true;
	console.log("SCROLLING" + scrollingEvent);
	handler(event);
});

$("#touch-area").on("touch_end", function(event) {
	captureStartScroll=true;
	touchEvent=false;
	handler(event);
	touchEvent=true;
	scrollingEvent=false;
})


setInterval(function(){
	lastRotationAngle=currentRotationAngle;
},250);

setInterval(function() {
	if (klimaArea==false && multimediaArea==false) {
		$(".currentAreaIndicator").toggleClass("standardFaded");
	}
},1500);

setInterval(function() {
	if (multimediaArea) {
		scrollHandler(".albumOverview", multimediaScrollYPos);
	}
},10);

setInterval(function() {
	lastScrollYPos=currentScrollYPos;
},25);