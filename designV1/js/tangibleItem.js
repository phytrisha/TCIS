var minLim = 95;
var maxLim = 105;

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
var navigationArea=false;

var klimaLeftZone = false;
var klimaRightZone = false;

var tempMax = 28;
var tempMin = 15;
var standardTemp=(tempMin+tempMax)/2;

var temperatureLeftZoneOutput = standardTemp;
var temperatureLeftZoneVariable = standardTemp;

var temperatureRightZoneOutput = standardTemp;
var temperatureRightZoneVariable = standardTemp;

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

var menuLeftOpen = false;
var menuRightOpen = false;

function scrollHandler () {
   if (updateScroll!=true) {
        lastScrollYSpeed*=0.95;
        multimediaScrollYPos+=(lastScrollYSpeed);
    }
    multimediaScrollYPos = Math.min(Math.max(parseInt(multimediaScrollYPos), -1750), 100);
    $(".albumOverview").css("top", multimediaScrollYPos);
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

function closeMenu (side) {
    $(".temperatureMenu" + side).css("opacity", 0.0);
    switch(side) {
        case "L":
            menuLeftOpen=false;
            $("#leftTemperatureZone").css("opacity", 1.0);
            if (klimaLeftZone) {
                $("#rightTemperatureZone").css("opacity", 0.5);
            } else {
                $("#rightTemperatureZone").css("opacity", 1.0);
            }
            break;
        case "R":
            menuRightOpen=false;
            $("#rightTemperatureZone").css("opacity", 1.0);
            if (klimaRightZone) {
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
            closeMenu("R");
            $("#leftTemperatureZone").css("opacity", 0.0);
            $("#rightTemperatureZone").css("opacity", 0.5);
            break;
        case "R":
            menuRightOpen=true;
            closeMenu("L");
            $("#rightTemperatureZone").css("opacity", 0.0);
            $("#leftTemperatureZone").css("opacity", 0.5);
            break;
    }
}

function adjustTemperature (zone) {
    if (currentRotationAngle>lastRotationAngle) {
        window["temperature" + zone + "ZoneOutput"]+=rotationStep;
    } else if (currentRotationAngle<lastRotationAngle) {
        window["temperature" + zone + "ZoneOutput"]-=rotationStep;
    }
    window["temperature" + zone + "ZoneVariable"] = (Math.round(window["temperature" + zone + "ZoneOutput"] * 2) / 2).toFixed(1);
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

function tangibleMenuHandler (angle, side, center, step) {
    if (angle == (menuStep * menuActivePoint)) {
        menuActivePoint++;
    } else if (angle == (-menuStep + menuStep * (menuActivePoint-1))) {
        menuActivePoint--;
    }
    menuActivePoint = Math.min(Math.max(parseInt(menuActivePoint), -1), 1);
    fadeMenuPoints(side, menuActivePoint);
    switch(menuActivePoint) {
        case -1:
            $(".temperatureMenu" + side).css("left", (center-step) + "px");
            break;
        case 0:
            $(".temperatureMenu" + side).css("left", center + "px");
            break;
        case 1:
            $(".temperatureMenu" + side).css("left", (center+step) + "px");
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

            readyForTouch = false;

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

            if (klimaArea) {
                if (klimaLeftZone) {
                    if (menuRightOpen) {
                        closeMenu("R");
                    }
                    if (menuLeftOpen!=true) {
                        adjustTemperature("Left");
                    } else if (menuLeftOpen) {
                        $(".temperatureMenuL").css("opacity", 1.0);
                        tangibleMenuHandler(currentRotationAngle, "L", -128, 192);
                        if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
                            closeMenu("L");
                        }
                    }
                } else if (klimaRightZone) {
                    if (menuLeftOpen) {
                        closeMenu("L");
                    }
                    if (menuRightOpen!=true) {
                        adjustTemperature("Right");
                    } else if (menuRightOpen) {
                        $(".temperatureMenuR").css("opacity", 1.0);
                        tangibleMenuHandler(currentRotationAngle, "R", 320, 192);
                        if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
                            closeMenu("R");
                        }
                    }
                }
                if (temperatureLeftZoneOutput > tempMax) {
                    temperatureLeftZoneOutput = tempMax;
                } else if (temperatureLeftZoneOutput < tempMin) {
                    temperatureLeftZoneOutput = tempMin;
                }
                if (temperatureRightZoneOutput > tempMax) {
                    temperatureRightZoneOutput = tempMax;
                } else if (temperatureRightZoneOutput < tempMin) {
                    temperatureRightZoneOutput = tempMin;
                }
            }

            // trigger panels based on x coordinates of tangible item
            if (centerX<256) {
                klimaLeftZone=true;
                klimaRightZone=false;

                $("#leftTempIndicator").addClass("temperatureIndicatorActive");
                $("#rightTempIndicator").removeClass("temperatureIndicatorActive");
                $("#centerTempIndicator").removeClass("temperatureIndicatorActive");

                $(".leftConnectingLine").addClass("leftCLeftNodeActive");
                $(".leftConnectingLine").removeClass("leftCCenterNodeActive");

                $(".rightConnectingLine").removeClass("rightCRightNodeActive");
                $(".rightConnectingLine").removeClass("rightCCenterNodeActive");

                $(".downConnectingLine").removeClass("downConnectingLineActive");
                $(".upConnectingLine").removeClass("upConnectingLineActive");
            } else if (centerX>512) {
                klimaLeftZone=false;
                klimaRightZone=true;

                $("#leftTempIndicator").removeClass("temperatureIndicatorActive");
                $("#rightTempIndicator").addClass("temperatureIndicatorActive");
                $("#centerTempIndicator").removeClass("temperatureIndicatorActive");

                $(".leftConnectingLine").removeClass("leftCLeftNodeActive");
                $(".leftConnectingLine").removeClass("leftCCenterNodeActive");

                $(".rightConnectingLine").addClass("rightCRightNodeActive");
                $(".rightConnectingLine").removeClass("rightCCenterNodeActive");

                $(".downConnectingLine").removeClass("downConnectingLineActive");
                $(".upConnectingLine").removeClass("upConnectingLineActive");
            } else {
                klimaLeftZone=false;
                klimaRightZone=false;

                $("#leftTempIndicator").removeClass("temperatureIndicatorActive");
                $("#rightTempIndicator").removeClass("temperatureIndicatorActive");
                $("#centerTempIndicator").addClass("temperatureIndicatorActive");

                $(".leftConnectingLine").removeClass("leftCLeftNodeActive");
                $(".leftConnectingLine").addClass("leftCCenterNodeActive");

                $(".rightConnectingLine").removeClass("rightCRightNodeActive");
                $(".rightConnectingLine").addClass("rightCCenterNodeActive");

                $(".downConnectingLine").addClass("downConnectingLineActive");
                $(".upConnectingLine").addClass("upConnectingLineActive");

                closeMenu("L");
                closeMenu("R");
            }

            // trigger areas based on y coordinates of tangible item
            if (centerY>700) {
                klimaArea=false;
                multimediaArea=true;
                navigationArea=false;
            } else if (centerY<700 && centerY>300) {
                klimaArea=true;
                multimediaArea=false;
                navigationArea=false;
            } else if (centerY<300) {
                klimaArea=false;
                multimediaArea=false;
                navigationArea=true;
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
        }, 250);
    }

    $("#currentAreaTitle").css("opacity", 1.0);
    if (klimaArea) {
        $("#currentAreaTitle").html("");
        $("#leftTemperatureZone").html("<h1>"+temperatureLeftZoneVariable+"</h1>");
        if (temperatureLeftZoneOutput<standardTemp) {
            leftColdMeter=Math.sqrt(Math.pow((temperatureLeftZoneOutput-standardTemp)/10,2));
            $("#leftTemperatureCold").css("opacity", leftColdMeter);
            leftBorder[0] = (255 - leftColdMeter * 400).toFixed(0);
            leftBorder[1] = (255 - leftColdMeter * 150).toFixed(0);
            leftBorder[2] = 255;
            $("#leftTempIndicator").css("border-color", "rgb(" + leftBorder[0] + "," + leftBorder[1] + "," + leftBorder[2] + ")".toString());
        } else if (temperatureLeftZoneOutput>standardTemp) {
            leftHotMeter=Math.sqrt(Math.pow((temperatureLeftZoneOutput-standardTemp)/10,2));
            $("#leftTemperatureHot").css("opacity", leftHotMeter);
            leftBorder[0] = 255;
            leftBorder[1] = (255 - leftHotMeter * 350).toFixed(0);
            leftBorder[2] = (255 - leftHotMeter * 500).toFixed(0);
            $("#leftTempIndicator").css("border-color", "rgb(" + leftBorder[0] + "," + leftBorder[1] + "," + leftBorder[2] + ")");
        }
        $("#rightTemperatureZone").html("<h1>"+temperatureRightZoneVariable+"</h1>");
        if (temperatureRightZoneOutput<standardTemp) {
            rightColdMeter=Math.sqrt(Math.pow((temperatureRightZoneOutput-standardTemp)/10,2));
            $("#rightTemperatureCold").css("opacity", rightColdMeter);
            rightBorder[0] = (255 - rightColdMeter * 400).toFixed(0);
            rightBorder[1] = (255 - rightColdMeter * 150).toFixed(0);
            rightBorder[2] = 255;
            $("#rightTempIndicator").css("border-color", "rgb(" + rightBorder[0] + "," + rightBorder[1] + "," + rightBorder[2] + ")".toString());
        } else if (temperatureRightZoneOutput>standardTemp) {
            rightHotMeter=Math.sqrt(Math.pow((temperatureRightZoneOutput-standardTemp)/10,2));
            $("#rightTemperatureHot").css("opacity", rightHotMeter);
            rightBorder[0] = 255;
            rightBorder[1] = (255 - rightHotMeter * 350).toFixed(0);
            rightBorder[2] = (255 - rightHotMeter * 500).toFixed(0);
            $("#rightTempIndicator").css("border-color", "rgb(" + rightBorder[0] + "," + rightBorder[1] + "," + rightBorder[2] + ")".toString());
        }

        $(".temperatureView").addClass("visible");
        $(".albumOverview").removeClass("albumOverviewActive");
        $(".albumOverviewContainer").removeClass("albumOverviewContainerVisible");
        $("#albumScroll").css("opacity", 0.0);
        $("#albumFade").css("opacity", 0.0);

    } else if (multimediaArea) {
        $("#currentAreaTitle").html("<h1></h1>")
        $(".showTemperature").removeClass("showTemperatureVisible");
        $("#rightTemperatureCold").css("opacity", 0.0);
        $("#rightTemperatureHot").css("opacity", 0.0);
        $("#leftTemperatureCold").css("opacity", 0.0);
        $("#leftTemperatureHot").css("opacity", 0.0);
        $("#albumScroll").css("opacity", 1.0);
        $("#albumFade").css("opacity", 1.0);
        $(".albumOverview").addClass("albumOverviewActive");
        $(".albumOverviewContainer").addClass("albumOverviewContainerVisible");
        $(".albumOverview").css("top", multimediaScrollYPos);
        $(".temperatureView").removeClass("visible");

    } else if (navigationArea) {
        $("#currentAreaTitle").html("<h1>Navigation</h1>");
        $(".showTemperature").removeClass("showTemperatureVisible");
        $("#rightTemperatureCold").css("opacity", 0.0);
        $("#rightTemperatureHot").css("opacity", 0.0);
        $("#leftTemperatureCold").css("opacity", 0.0);
        $("#leftTemperatureHot").css("opacity", 0.0);
        $(".albumOverview").removeClass("albumOverviewActive");
        $("#albumScroll").css("opacity", 0.0);
        $("#albumFade").css("opacity", 0.0);
        $(".albumOverviewContainer").removeClass("albumOverviewContainerVisible");
        $(".temperatureView").removeClass("visible");
    }

    if (showData.touches.length==1) {
        if (captureStartScroll) {
            referenceScrollYPos="";
            multimediaScrollYReferencePos="";
            multimediaScrollYReferencePos=$(".albumOverview").css('top');
            multimediaScrollYReferencePos=parseFloat(multimediaScrollYReferencePos);
            referenceScrollYPos=showData.touches[0].screenY;
            captureStartScroll=false;
        }
        if (scrollingEvent) {
            currentScrollYPos=showData.touches[0].screenY;
            resultingScroll=currentScrollYPos-referenceScrollYPos;
            multimediaScrollYPos=multimediaScrollYReferencePos+resultingScroll;
            updateScroll=true;
        }
        if (touchEvent) {
            var clickedAlbum = checkElementForTouch("#album", ".albumOverview", 48, x[0], y[0]);
        }

    } 

    if (showData.touches.length==5) {
        if (klimaLeftZone) {
            openMenu("L");
        } else if (klimaRightZone) {
            openMenu("R");
        }
    }
};

// execute functions
$("#touch-area").on("touch_start", function(event) {
    handler(event);
    gestureSuccess = false;
});

$("#touch-area").on("touch_move", function(event){
    scrollingEvent=true;
    touchEvent=false;
    handler(event);
});

$("#touch-area").on("touch_end", function(event) {
    captureStartScroll=true;
    if (scrollingEvent) {
        scrollingEvent=false;
    } else {
        touchEvent=true;
    }
    handler(event);
})


setInterval(function(){
    lastRotationAngle=currentRotationAngle;
},250);

setInterval(function() {
    if (klimaArea==false && multimediaArea==false && navigationArea==false) {
        $(".currentAreaIndicator").toggleClass("standardFaded");
    }
},1500);

setInterval(function() {
    if (multimediaArea) {
        scrollHandler();
    }
},10);

setInterval(function() {
    lastScrollYPos=currentScrollYPos;
},25);