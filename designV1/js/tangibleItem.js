function scrollHandler (elem, scrollVar, max, min) {
   if (updateScroll!=true) {
		lastScrollYSpeed*=0.95;
		scrollVar+=(-lastScrollYSpeed);
	}
	scrollVar = Math.min(Math.max(parseInt(scrollVar), max), min);
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

function tangibleGestureHandler (currentY, startY, distance) {
	if (gestureSuccess != true) {
		if (currentY > startY + distance) {
			gestureSuccess = true;
			return gestureSuccess;
		}
	}
}

var currentAlbumOffset;

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

			if (currentRotationAngle > -90 && currentRotationAngle < 90) {
				currentVolume = startVolume + currentRotationAngle;
			}

			if (multimediaArea) {
				if (menuPlaybackOpen) {
					$(".multimediaMenu").css("opacity", 1.0);
					tangibleMenuHandler("multimedia", currentRotationAngle, "", 96, 192);
					if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
						closeMenu("multimedia", "");
						$(".currentTitleLabel").removeClass("inactive");
						menuPlaybackOpen=false;
					}
				} else if (albumOverview) {
					if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
						console.log("close album overview");
						closeMenu("multimedia", "");
						albumOverview = false;
						$(".albumOverview").removeClass("active");
						$(".albumPlaybackView").addClass("active");
					}
				} else if (albumDetail) {
					if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
						console.log("close album detail");
						hideAlbum(currentAlbum);
						albumDetail = false;
						albumOverview = true;
					}
				} else if (artistOverview) {
					if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
						console.log("close artistOverview");
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
		$(".albumViewContainer").removeClass("albumOverviewContainerVisible");
		$("#albumScroll").css("opacity", 0.0);
		$("#albumFade").css("opacity", 0.0);
		$(".currentAlbumPlayback").removeClass("active");
		$(".albumFadeOutOverlay").removeClass("visible");
	} else if (multimediaArea) {
		$("#currentAreaTitle").html("")
		$(".showTemperature").removeClass("showTemperatureVisible");
		$("#albumScroll").css("opacity", 1.0);
		$("#albumFade").css("opacity", 1.0);
		$(".albumPlayback").addClass("active");
		$(".albumViewContainer").addClass("albumOverviewContainerVisible");
		$(".temperatureView").removeClass("visible");
		$(".currentAlbumPlayback").addClass("active");
		$(".albumFadeOutOverlay").addClass("visible");
	}

	var tangibleClick = false;
	var touchClick = false;
	var touchPoint;

	if (showData.touches.length >= 5) {
		for (var i = 4; i < showData.touches.length; i++) {
			
			var distanceOfFifth = Math.sqrt(Math.pow(x[i]-centerX, 2) + Math.pow(y[i]-centerY, 2));

			if (distanceOfFifth > 250) {
				touchPoint = i;
				touchClick = true;
			} else {
				tangibleClick = true;
			}
		};
	}

	if (showData.touches.length==1 || touchClick) {
		var scopeX, scopeY;
		if (touchClick) {
			scopeX = x[touchPoint];
			scopeY = y[touchPoint];
		} else {
			scopeX = x[0];
			scopeY = y[0];
		}

		if (getTouch) {
			startY = scopeY;
			getTouch=false;
		}

		currentY = scopeY;

		if (klimaArea != true) {
			if (captureStartScroll) {
				multimediaScrollYReferencePos=parseInt($(".albumOverview").css('top'));
				albumDetailScrollYReferencePos=parseInt($(".albumDetailTitleList").css('top'));
				referenceScrollYPos=scopeY;
				captureStartScroll=false;
			}	
			if (scrollingEvent) {
				currentScrollYPos=scopeY;
				resultingScroll=currentScrollYPos-referenceScrollYPos;
				if (albumOverview) {
					multimediaScrollYPos=multimediaScrollYReferencePos+resultingScroll;
				} else if (albumDetail) {
					scrollHeight = (songs[currentAlbum].length * 65) * (-1) + 130;
					albumDetailScrollYPos=albumDetailScrollYReferencePos+resultingScroll;
				}
				updateScroll=true;
			} else if (touchEvent) {
				if (albumOverview) {
					var clickedAlbum = checkElementForTouch("#album", ".albumOverview", 48, scopeX, scopeY);
					displayAlbum(clickedAlbum);
					albumOverview=false;
					albumDetail=true;
				} else if (albumDetail) {
					// not working correctly, due to offset of albumDetailTitleList is relative to Container
					// possible solution to explore: implement y-offset to checkElementForTouch
					// possible solution to explore: adjust css properties, so that album list is independant
					var clickedSong = checkElementForTouch("#albumContentTitle", ".albumDetailTitleList", songs[currentAlbum].length, scopeX, scopeY);
					console.log(clickedSong);
				}
			}
		}
	} 

	if (tangibleClick) {
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

	startVolume = currentVolume;

	gestureSuccess = false;
	getTouch=true;

	window.setTimeout(function() {
		if (currentY == startY) {
			touchEvent = true;
			scrollingEvent = false;
		}
		handler(event);
	},100);
	
});

$("#touch-area").on("touch_move", function(event){
	touchEvent = false;
	scrollingEvent = true;
	handler(event);
});

$("#touch-area").on("touch_end", function(event) {
	captureStartScroll=true;
	touchEvent=false;
	handler(event);
	touchEvent=true;
	scrollingEvent=false;
})
