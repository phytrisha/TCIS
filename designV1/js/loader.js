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