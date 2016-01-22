function populateAlbums (source, amount) {
	for (var i = 1; i <= amount; i++) {
		$(source).append("<div class='singleAlbum' id='album" + i + "'></div>");
	};
}

var counter=0;

setInterval(function() {
	if (counter>100) {
		counter=0;
	}
	counter++;
	$(".progressBarCurrent").css("width", counter + "%");
	$(".progressIndicatorCurrent").css("left", counter + "%");
},500);

setInterval(function(){
	lastRotationAngle=currentRotationAngle;
},250);

setInterval(function() {
	if (klimaArea==false && multimediaArea==false) {
		$(".currentAreaIndicator").toggleClass("standardFaded");
	}
},1500);

setInterval(function() {
	if (albumOverview) {
		scrollHandler(".albumOverview", multimediaScrollYPos, -4000, 100);
	} else if (albumDetail) {
		scrollHandler(".albumDetailTitleList", albumDetailScrollYPos, scrollHeight, 0);
	}
},10);

setInterval(function() {
	lastScrollYPos=currentScrollYPos;
},25);