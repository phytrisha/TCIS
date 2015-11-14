var minLim = 0;
var maxLim = 300;

var tangible = false;

var centerX;
var centerY;

var initAngle = true;

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

var standardTemp=20;

var temperatureLeftZoneOutput = 20;
var temperatureLeftZoneVariable = 20;

var temperatureRightZoneOutput = 20;
var temperatureRightZoneVariable = 20;

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
    $(".albumOverview").css("top", multimediaScrollYPos);
}

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

    if (showData.touches.length<2 && showData.touches.length>0) {
        if (captureStartScroll) {
            referenceScrollYPos="";
            multimediaScrollYReferencePos="";
            multimediaScrollYReferencePos=$(".albumOverview").css('top');
            multimediaScrollYReferencePos=parseFloat(multimediaScrollYReferencePos);
            referenceScrollYPos=showData.touches[0].screenY;
            captureStartScroll=false;
        }
        currentScrollYPos=showData.touches[0].screenY;
        resultingScroll=currentScrollYPos-referenceScrollYPos;
        multimediaScrollYPos=multimediaScrollYReferencePos+resultingScroll;
        updateScroll=true;
    } else if (showData.touches.length<3) {
        //lastScrollYSpeed=lastScrollYPos;
        lastScrollYSpeed=currentScrollYPos-lastScrollYPos;
        if (lastScrollYSpeed<-50) {
            lastScrollYSpeed=-50;
        } else if (lastScrollYSpeed>50) {
            lastScrollYSpeed=50;
        }
        updateScroll=false;
    }

    if (showData.touches.length > 3) {

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

            // calculate & round resulting rotation angle
            currentRotationAngle = Math.round(angleDeg - angleStart);

            if (klimaArea) {
                if (klimaLeftZone) {
                    if (currentRotationAngle>lastRotationAngle) {
                        temperatureLeftZoneOutput+=0.01;
                    } else if (currentRotationAngle<lastRotationAngle) {
                        temperatureLeftZoneOutput-=0.01;
                    }
                    temperatureLeftZoneVariable = (Math.round(temperatureLeftZoneOutput * 10) / 10).toFixed(1);
                } else if (klimaRightZone) {
                    if (currentRotationAngle>lastRotationAngle) {
                        temperatureRightZoneOutput+=0.01;
                    } else if (currentRotationAngle<lastRotationAngle) {
                        temperatureRightZoneOutput-=0.01;
                    }
                    temperatureRightZoneVariable = (Math.round(temperatureRightZoneOutput*10) / 10).toFixed(1);
                }
            }

            // determine center x and y position of tangible item
            centerX = (x[0]+x[1]+x[2]+x[3])/4;
            centerY = (y[0]+y[1]+y[2]+y[3])/4;

            // trigger panels based on x coordinates of tangible item
            if (centerX<384) {
                //$(".rightPanel").addClass("panelVisible");
                klimaLeftZone=true;
                klimaRightZone=false;
            } else if (centerX>384) {
                //$(".rightPanel").removeClass("panelVisible");
                klimaLeftZone=false;
                klimaRightZone=true;
            }

            // trigger areas based on y coordinates of tangible item
            if (centerY>700) {
                $(".body-area").addClass("area1");
                $(".body-area").removeClass("area2");
                $(".body-area").removeClass("area3");
                klimaArea=false;
                multimediaArea=true;
                navigationArea=false;
            } else if (centerY<700 && centerY>500) {
                $(".body-area").addClass("area2");
                $(".body-area").removeClass("area1");
                $(".body-area").removeClass("area3");
                klimaArea=true;
                multimediaArea=false;
                navigationArea=false;
            } else if (centerY<500) {
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
    }
    document.getElementById("currentAreaTitle").style.opacity=1.0;
    if (klimaArea) {
        document.getElementById("currentAreaTitle").innerHTML="";
        document.getElementById("currentAreaTitle").innerHTML="<h1>Klima</h1>";
        $(".showTemperature").addClass("showTemperatureVisible");
        if (klimaLeftZone) {
            $("#leftTemperatureZone").replaceWith("<div class='showTemperature showTemperatureVisible' id='leftTemperatureZone'><h1>"+temperatureLeftZoneVariable+"°C</h1></div>");
            if (temperatureLeftZoneOutput<standardTemp) {
                leftColdMeter=Math.sqrt(Math.pow((temperatureLeftZoneOutput-standardTemp)/4,2));
                document.getElementById("leftTemperatureCold").style.opacity=leftColdMeter.toString();
            } else if (temperatureLeftZoneOutput>standardTemp) {
                leftHotMeter=Math.sqrt(Math.pow((temperatureLeftZoneOutput-standardTemp)/4,2));
                document.getElementById("leftTemperatureHot").style.opacity=leftHotMeter.toString();
            }
        } else if (klimaRightZone) {
            $("#rightTemperatureZone").replaceWith("<div class='showTemperature showTemperatureVisible' id='rightTemperatureZone'><h1>"+temperatureRightZoneVariable+"°C</h1></div>");
            if (temperatureRightZoneOutput<standardTemp) {
                rightColdMeter=Math.sqrt(Math.pow((temperatureRightZoneOutput-standardTemp)/4,2));
                document.getElementById("rightTemperatureCold").style.opacity=rightColdMeter.toString();
            } else if (temperatureRightZoneOutput>standardTemp) {
                rightHotMeter=Math.sqrt(Math.pow((temperatureRightZoneOutput-standardTemp)/4,2));
                document.getElementById("rightTemperatureHot").style.opacity=rightHotMeter.toString();
            }
        }
        $(".albumOverview").removeClass("albumOverviewActive");
        document.getElementById("albumScroll").style.opacity=0.0;
        document.getElementById("albumFade").style.opacity=0.0;
    } else if (multimediaArea) {
        document.getElementById("currentAreaTitle").innerHTML="";
        document.getElementById("currentAreaTitle").innerHTML="<h1></h1>";
        $(".showTemperature").removeClass("showTemperatureVisible");
        document.getElementById("rightTemperatureCold").style.opacity=0.0;
        document.getElementById("rightTemperatureHot").style.opacity=0.0;
        document.getElementById("leftTemperatureCold").style.opacity=0.0;
        document.getElementById("leftTemperatureHot").style.opacity=0.0;
        document.getElementById("albumScroll").style.opacity=1.0;
        document.getElementById("albumFade").style.opacity=1.0;
        document.getElementById("albumScroll").style.top="-500px";
        $(".albumOverview").addClass("albumOverviewActive");
    } else if (navigationArea) {
        document.getElementById("currentAreaTitle").innerHTML="";
        document.getElementById("currentAreaTitle").innerHTML="<h1>Navigation</h1>";
        $(".showTemperature").removeClass("showTemperatureVisible");
        document.getElementById("rightTemperatureCold").style.opacity=0.0;
        document.getElementById("rightTemperatureHot").style.opacity=0.0;
        document.getElementById("leftTemperatureCold").style.opacity=0.0;
        document.getElementById("leftTemperatureHot").style.opacity=0.0;
        $(".albumOverview").removeClass("albumOverviewActive");
        document.getElementById("albumScroll").style.opacity=0.0;
        document.getElementById("albumFade").style.opacity=0.0;
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

// execute functions, don't touch this
$("#test-area").on("touch_start", handler);
$("#test-area").on("touch_move", handler);
$("#test-area").on("touch_end", handler);
$("#test-area").on("touch_end", function() {
    captureStartScroll=true;
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
    console.log(multimediaArea);
},10);

setInterval(function() {
    lastScrollYPos=currentScrollYPos;
},100);



















