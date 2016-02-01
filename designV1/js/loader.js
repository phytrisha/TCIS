function populateAlbums (source) {
	for (var i = 1; i <= albumName.length; i++) {
		$(source).append("<div class='singleAlbum' id='album" + i + "'></div>");
	};
}

function populateArtists (source) {
	for (var i = 1; i <= artists.length; i++) {
		$(source).append("<div class='artistCell' id='artist_blur" + i + "'></div>");
		$("#artist_blur" + i).append("<div class='artistTitle'><h1>" + artists[i-1] + "</h1></div>");
	};
}


var counter=0;

setInterval(function() {
	if (counter>99) {
		counter=0;
		songCounter++;
		$(".currentTitleLabel.song").html(songs[currentAlbum-1][songCounter]);
		sendToMacbook[1] = songs[currentAlbum-1][songCounter];
	}
	counter++;
	$(".progressBarCurrent").css("width", counter + "%");
	$(".progressIndicatorCurrent").css("left", counter + "%");
	sendToMacbook[3] = counter;
	// socket.io emission
	socket.emit('title', { title: sendToMacbook});
},500);

setInterval(function(){
	lastRotationAngle=currentRotationAngle;
},250);

setInterval(function() {
	if (klimaArea == false && multimediaArea == false) {
		$(".currentAreaIndicator").toggleClass("standardFaded");
	}
	//console.log(menuRotation);
	//console.log("------------------------- NEW");
	//console.log("menuPlaybackOpen " + menuPlaybackOpen);

},1500);

setInterval(function() {
	if (albumOverview) {
		scrollHandler(".albumOverview", multimediaScrollYPos, -4000, 25);
	} else if (albumDetail) {
		scrollHandler(".albumDetailTitleList", albumDetailScrollYPos, scrollHeight, 0);
	} else if (artistOverview) {
		scrollHandler(".artistOverview", artistOverviewScrollYPos, -400, 0);
	}
},10);

setInterval(function() {
	lastScrollYPos=currentScrollYPos;
},25);

setInterval(function() {
	if (currentVolume < 135) {
		currentVolume = 135;
	} else if (currentVolume > 405) {
		currentVolume = 405;
	}
	if (!menuPlaybackOpen) {
		drawCurrent(currentVolume);
		$('#volume').css('opacity', 1.0);
		$('#volumeConst').css('opacity', 1.0);
	}
	if (menuPlaybackOpen) {
		$('#volume').css('opacity', 0);
		$('#volumeConst').css('opacity', 0);
	}
}, 25);