var minLim = 0;
var maxLim = 300;

var tangible = false;

var centerX;
var centerY;

var initAngle = true;

var temperatureOutput = 20;
var temperatureVariable;

var currentRotationAngle;
var lastRotationAngle;


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
            if (currentRotationAngle>lastRotationAngle) {
                temperatureOutput+=0.01;
            } else if (currentRotationAngle<lastRotationAngle) {
                temperatureOutput-=0.01;
            }

            temperatureVariable = Math.round(temperatureOutput*10) / 10;


            //lastRotationAngle = currentRotationAngle;
            // determine center x and y position of tangible item
            centerX = (x[0]+x[1]+x[2]+x[3])/4;
            centerY = (y[0]+y[1]+y[2]+y[3])/4;

            // trigger panels based on x coordinates of tangible item
            if (centerX>500) {
                $(".rightPanel").addClass("panelVisible");
            } else {
                $(".rightPanel").removeClass("panelVisible");
            }

            // trigger areas based on y coordinates of tangible item
            if (centerY>700) {
                $(".body-area").addClass("area1");
                $(".body-area").removeClass("area2");
                $(".body-area").removeClass("area3");
                document.getElementById("currentAreaTitle").innerHTML="";
                document.getElementById("currentAreaTitle").innerHTML="<h1>Multimedia</h1>";
                $(".showTemperature").removeClass("showTemperatureVisible");
            } else if (centerY<700 && centerY>500) {
                $(".body-area").addClass("area2");
                $(".body-area").removeClass("area1");
                $(".body-area").removeClass("area3");
                document.getElementById("currentAreaTitle").innerHTML="";
                document.getElementById("currentAreaTitle").innerHTML="<h1>Klima</h1>";
                $(".showTemperature").addClass("showTemperatureVisible");
                $(".showTemperature").replaceWith("<div class='showTemperature showTemperatureVisible'><h1>"+temperatureVariable+"°C</h1></div>");
            } else if (centerY<500) {
                $(".body-area").addClass("area3");
                $(".body-area").removeClass("area1");
                $(".body-area").removeClass("area2");
                document.getElementById("currentAreaTitle").innerHTML="";
                document.getElementById("currentAreaTitle").innerHTML="<h1>Navigation</h1>";
                $(".showTemperature").removeClass("showTemperatureVisible");
            }
        }

    } else {
    	// reset tangible item recognition if not enough points are available
        tangible=false;
        initAngle = true;
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

setInterval(function(){
    lastRotationAngle=currentRotationAngle;
},250);




















