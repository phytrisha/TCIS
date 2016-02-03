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
	var sendLength;
	var seconds = parseInt(songLengths[currentAlbum-1][songCounter].charAt(2) + songLengths[currentAlbum-1][songCounter].charAt(3));
	sendLength = songLengths[currentAlbum-1][songCounter].charAt(0)*60 + seconds;

	if (counter>sendLength) {
		counter=0;
		songCounter++;
		$(".currentTitleLabel.song").html(songs[currentAlbum-1][songCounter]);
		sendToMacbook[1] = songs[currentAlbum-1][songCounter];
	}

	
	//sendToMacbook[5] = sendLength;
	sendToMacbook[3] = counter / sendLength;

	$(".progressBarCurrent").css("width", 100 * sendToMacbook[3] + "%");
	//$(".progressIndicatorCurrent").css("left", sendToMacbook[3] + "%");
	console.log(sendToMacbook[3]);
	var sendVolume = (currentVolume - 135) / 270;
	sendToMacbook[4] = sendVolume;
	
	// socket.io emission
	socket.emit('title', { title: sendToMacbook});
},100);

setInterval(function() {
	counter++;
}, 1000);

setInterval(function(){
	lastRotationAngle=currentRotationAngle;
},250);

setInterval(function() {
	if (klimaArea == false && multimediaArea == false) {
		$(".currentAreaIndicator").toggleClass("standardFaded");
	}
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