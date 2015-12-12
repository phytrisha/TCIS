var minLim = 0;
var maxLim = 300;

var tangible = false;

var centerX;
var centerY;

var initAngle = true;
var initPos = true;

var gestureSuccess = false;

var posStart = [2];
var menuActivePoint;
var menuStep = 25;
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

var putItDown = true;

var tempMax = 28;
var tempMin = 15;
var standardTemp=(tempMin+tempMax)/2;

var temperatureLeftZoneOutput = standardTemp;
var temperatureLeftZoneVariable = standardTemp;

var temperatureRightZoneOutput = standardTemp;
var temperatureRightZoneVariable = standardTemp;

var multimediaScrollYPos;
var multimediaScrollYReferencePos;

// to do!!
var multmediaScrollYSpeed;

var updateScroll=false;

var currentScrollYPos;
var referenceScrollYPos;

var captureStartScroll=true;

var lastScrollYPos;
var lastScrollYSpeed;

var addToSpeed;

var scrollingEvent = false;
var touchEvent = false;

var rotationStep = 0.02;

var leftBorder = [2];
var rightBorder = [2];

var readyForTouch = false;

var menuLeftOpen = false;
var menuRightOpen = false;



// crazy json shit, don't touch this
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function scrollHandler () {
   if (updateScroll!=true) {
        lastScrollYSpeed*=0.95;
        multimediaScrollYPos+=(lastScrollYSpeed);
    }
    if (multimediaScrollYPos>100) {
    	multimediaScrollYPos=100;
    } else if (multimediaScrollYPos<-1750) {
    	multimediaScrollYPos=-1750;
    }
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
            console.log(gestureSuccess);
            return gestureSuccess;
        }
    }
}
/*
function temperatureMenuHandler (angle) {
    if (angle >= 20) {
        menuActivePoint++;
        angle = 0;
    } else if (angle <= -20) {
        menuActivePoint--;
        angle = 0;
    }
}
*/

// initialize area for jquery.touch
$("#test-area").touchInit();

var timeout_id = null;
var last_original_event = null;

// touch handler function
var handler = function (e) {

	// collect data of touch points
    $("#last-event-name").text(e.type);
    var showData =
            {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                screenX: e.screenX,
                screenY: e.screenY,
                touches: e.touches
            };

    // define tracking points
    var x = [];
    var y = [];
    // define distanes of tracking points
    var xDist = [];
    var yDist = [];

    $("#last-event-detail").html(syntaxHighlight(JSON.stringify(showData, undefined, 2)));

    // write from gathered touchpoints to tracking points
    for (var i = showData.touches.length - 1; i >= 0; i--) {
        x[i] = showData.touches[i].screenX;
        y[i] = showData.touches[i].screenY;
    };

    

    /*
    
    --- this part is only relevant, if tangible item and scrolling
    --- interaction should be available at the same time
    --- this will be the case, when the tangible item is working better

    else if (showData.touches.length==5) {
        if (captureStartScroll) {
            referenceScrollYPos="";
            multimediaScrollYReferencePos="";
            multimediaScrollYReferencePos=$(".albumOverview").css('top');
            multimediaScrollYReferencePos=parseFloat(multimediaScrollYReferencePos);
            referenceScrollYPos=showData.touches[4].screenY;
            captureStartScroll=false;
        }
        if (scrollingEvent) {
            currentScrollYPos=showData.touches[4].screenY;
            resultingScroll=currentScrollYPos-referenceScrollYPos;
            multimediaScrollYPos=multimediaScrollYReferencePos+resultingScroll;
            updateScroll=true;
            console.log("scrolling!");
        }
    }else */ if (showData.touches.length==0) {
        // cancel extreme speeds and limit fast speeds
        lastScrollYSpeed=currentScrollYPos-lastScrollYPos;
        if (lastScrollYSpeed<-50) {
            lastScrollYSpeed=-50;
        } else if (lastScrollYSpeed>50) {
            lastScrollYSpeed=50;
        }
        updateScroll=false;
    } else if (showData.touches.length > 3) {

    	// calculate distances of points, referencing first point
        for (var i = 0; i < showData.touches.length; i++) {
            xDist[i] = Math.sqrt(Math.pow(x[0]-x[i],2));
            yDist[i] = Math.sqrt(Math.pow(y[0]-y[i],2));
        };

        // compare distances to limits and enable tangible item if distances are low enough
        if (xDist[1]<maxLim && xDist[2]<maxLim && xDist[3]<maxLim && yDist[1]<maxLim && yDist[2]<maxLim && yDist[3]<maxLim && xDist[1]>minLim && xDist[2]>minLim && xDist[3]>minLim && yDist[1]>minLim && yDist[2]>minLim && yDist[3]>minLim) {
            tangible=true;
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

            // determine center x and y position of tangible item
            centerX = (x[0]+x[1]+x[2]+x[3])/4;
            centerY = (y[0]+y[1]+y[2]+y[3])/4;

            if (initPos) {
                posStart = [centerX, centerY];
                //console.log(posStart);
                initPos = false;
            }

 
            // calculate & round resulting rotation angle
            currentRotationAngle = Math.round(angleDeg - angleStart);

            if (klimaArea) {
                if (klimaLeftZone) {
                    if (menuLeftOpen!=true) {
                        if (currentRotationAngle>lastRotationAngle) {
                            temperatureLeftZoneOutput+=rotationStep;
                        } else if (currentRotationAngle<lastRotationAngle) {
                            temperatureLeftZoneOutput-=rotationStep;
                        }
                        temperatureLeftZoneVariable = (Math.round(temperatureLeftZoneOutput * 2) / 2).toFixed(1);
                    } else if (menuLeftOpen) {
                        //console.log(currentRotationAngle)
                        if (currentRotationAngle == (menuStep * rotationMultiplier)) {
                            rotationMultiplier+=1;
                            menuActivePoint+=1;
                        } else if (currentRotationAngle == (-menuStep + menuStep * (rotationMultiplier-1))) {
                            rotationMultiplier-=1;
                            menuActivePoint-=1;
                        }
                        //console.log(menuActivePoint);
                        //console.log(-menuStep + menuStep * (rotationMultiplier-1));
                        //console.log("climate change not available due to open menu");
                        if (tangibleGestureHandler(centerY, posStart[1], 50) == true) {
                            menuLeftOpen = false;
                            $(".temperatureMenu").css("opacity", 0.0);
                        }
                        if (menuActivePoint>1) {
                            menuActivePoint=1;
                        } else if (menuActivePoint<-1) {
                            menuActivePoint=-1;
                        }
                        if (menuActivePoint==0) {
                            $(".temperatureMenu").css("left", "-128px");
                            $("#point1").css("opacity", 0.5);
                            $("#point2").css("opacity", 1);
                            $("#point3").css("opacity", 0.5);
                        } else if (menuActivePoint==1) {
                            $(".temperatureMenu").css("left", "64px");
                            $("#point1").css("opacity", 1);
                            $("#point2").css("opacity", 0.5);
                            $("#point3").css("opacity", 0);
                        } else if (menuActivePoint==-1) {
                            $(".temperatureMenu").css("left", "-320px");
                            $("#point1").css("opacity", 0.5);
                            $("#point2").css("opacity", 0.5);
                            $("#point3").css("opacity", 1);
                        }
                    } 
                } else if (klimaRightZone) {
                    if (menuRightOpen!=true) {
                       if (currentRotationAngle>lastRotationAngle) {
                            temperatureRightZoneOutput+=rotationStep;
                        } else if (currentRotationAngle<lastRotationAngle) {
                            temperatureRightZoneOutput-=rotationStep;
                        }
                        temperatureRightZoneVariable = (Math.round(temperatureRightZoneOutput*2) / 2).toFixed(1); 
                    } else {
                        //console.log("climate change not available due to open menu");
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


            //tangibleGestureHandler(centerY, posStart[1], 50);

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
            }

            // trigger areas based on y coordinates of tangible item
            if (centerY>700) {
                $(".body-area").addClass("area1");
                $(".body-area").removeClass("area2");
                $(".body-area").removeClass("area3");
                klimaArea=false;
                multimediaArea=true;
                navigationArea=false;
            } else if (centerY<700 && centerY>300) {
                $(".body-area").addClass("area2");
                $(".body-area").removeClass("area1");
                $(".body-area").removeClass("area3");
                klimaArea=true;
                multimediaArea=false;
                navigationArea=false;
            } else if (centerY<300) {
                $(".body-area").addClass("area3");
                $(".body-area").removeClass("area1");
                $(".body-area").removeClass("area2");
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
        //if (klimaLeftZone) {
            //$("#leftTemperatureZone").replaceWith("<div class='showTemperature showTemperatureVisible' id='leftTemperatureZone'><h1>"+temperatureLeftZoneVariable+"</h1></div>");
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
        //} else if (klimaRightZone) {
            //$("#rightTemperatureZone").replaceWith("<div class='showTemperature showTemperatureVisible' id='rightTemperatureZone'><h1>"+temperatureRightZoneVariable+"</h1></div>");
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
        //}
        if (menuLeftOpen!=true) {
            if (klimaLeftZone) {
                $("#leftTemperatureZone").css("opacity", 1.0);
                $("#rightTemperatureZone").css("opacity", 0.5);
            } else if (klimaRightZone) {
                $("#leftTemperatureZone").css("opacity", 0.5);
                $("#rightTemperatureZone").css("opacity", 1.0);
            } else {
                $("#leftTemperatureZone").css("opacity", 0.5);
                $("#rightTemperatureZone").css("opacity", 0.5);
            }
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
            console.log(clickedAlbum);
            /*if (klimaLeftZone) {
                if (menuLeftOpen != true) {
                    console.log("open menu left!");
                    menuLeftOpen = true;
                    menuActivePoint = 0;
                    $(".temperatureMenu").css("opacity", 1.0);
                }
            } else if (klimaRightZone) {
                if (menuRightOpen != true) {
                    console.log("open menu right!");
                    menuRightOpen = true;
                }
            }*/
        }

    } 

    if (showData.touches.length==5) {
        if (klimaLeftZone) {
            if (menuLeftOpen != true) {
                console.log("open menu left!");
                menuLeftOpen = true;
                menuActivePoint = 0;
                $(".temperatureMenu").css("opacity", 1.0);
                $("#leftTemperatureZone").css("opacity", 0.0);
            }
        } else if (klimaRightZone) {
            if (menuRightOpen != true) {
                console.log("open menu right!");
                menuRightOpen = true;
            }
        }
    }

    // event reseting, don't touch this
    if (last_original_event != e.originalType) {
        last_original_event = e.originalType;
        $("#original-event").html(e.originalType + "<br/>" + $("#original-event").html());
        if (timeout_id !== null) window.clearTimeout(timeout_id);
        timeout_id = window.setTimeout(
            function () {
                $("#original-event").html("");
            },
        5000);
    }
};

// execute functions
$("#test-area").on("touch_start", function(event) {
    handler(event);
    gestureSuccess = false;
    rotationMultiplier = 1;
});

$("#test-area").on("touch_move", function(event){
    scrollingEvent=true;
    touchEvent=false;
    handler(event);
});

$("#test-area").on("touch_end", function(event) {
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
        if (putItDown) {
            $(".currentAreaIndicator").addClass("standardFaded");
            $(".currentAreaIndicator").removeClass("standardVisible");
            putItDown=false;
        } else {
            $(".currentAreaIndicator").addClass("standardVisible");
            $(".currentAreaIndicator").removeClass("standardFaded");
            putItDown=true;
        }
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













