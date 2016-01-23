var start = 135 * (Math.PI/180);
var end = 405 * (Math.PI/180);

var c=document.getElementById("volume");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.arc(384,384,360,start,end);
ctx.lineWidth=4;
ctx.strokeStyle="rgba(255,255,255,0.5)";
ctx.stroke();

function drawCurrent (current) {
	var draw = current * (Math.PI/180);
	var ctf=c.getContext("2d");
	ctf.beginPath();
	ctf.arc(384,384,370,start,draw);
	ctf.lineWidth=24;
	ctf.strokeStyle="rgba(255,255,255,1)";
	ctf.stroke();
}
