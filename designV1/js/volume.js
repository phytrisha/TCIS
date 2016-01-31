var start = 135 * (Math.PI/180);
var end = 405 * (Math.PI/180);

var c=document.getElementById("volumeConst");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.arc(384,384,360,start,end);
ctx.lineWidth=4;
ctx.strokeStyle="rgba(255,255,255,0.5)";
ctx.stroke();

function drawCurrent (current) {
	var c=document.getElementById("volume");
	var ctf=c.getContext("2d");

	if (current > 405) {
		current = 405;
	} else if (current < 135) {
		current = 135;
	}
	//console.log("drawing with " + current);
	var draw = current * (Math.PI/180);
	ctf.clearRect(0, 0, c.width, c.height);
	ctf.beginPath();
	ctf.arc(384,384,370,start,draw);
	ctf.lineWidth=14;
	ctf.strokeStyle="rgba(255,255,255,1)";
	ctf.stroke();
}
