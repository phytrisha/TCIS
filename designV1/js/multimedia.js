function getAlbums (data) {
	for (var i = 0; i < data.length; i++) {
		albumName[i] = data[i].name;
		albumArtist[i] = data[i].artist;
		songs[i] = new Array(data[i].song.length);
		songLengths[i] = new Array(data[i].length.length);
		for (var j = 0; j < data[i].song.length; j++) {
			songs[i][j] = data[i].song[j];
			songLengths[i][j] = data[i].length[j];
		};
	};
}

function getArtists (data) {
	for (var i = 0; i < data.length; i++) {
		artists[i] = data[i].artist;
		artistAlbums[i] = data[i].albums;
	};
}

function displayAlbum (album) {
	currentAlbum = album;
	var elemOffset = $("#album" + album).offset();
	$(".albumDetail").css("width", "100%");
	$(".albumDetail").css("height", "100%");
	$(".albumDetailArtist").html("");
	$(".albumDetailTitle").html("");
	$(".albumViewContainer").append($("#album" + album));
	$("#album" + album).css("position", "fixed");
	$("#album" + album).css("left", elemOffset.left);
	$("#album" + album).css("top", elemOffset.top);
	$(".albumOverview").removeClass("active");
	$("#album" + album).animate({
		left: "20",
		top: "20"
	}, 300, "swing");
	$(".albumDetailArtist").html("<h2 class='albumDetailArtistTypo'>"+albumArtist[album-1]+"</h2>");
	$(".albumDetailTitle").html("<h4>"+albumName[album-1]+"</h4>");
	$(".albumDetailTitleList").html("");
	$(".albumDetail").css("opacity", 1.0);
	for (var i = 0; i < songs[album-1].length; i++) {
		$(".albumDetailTitleList").append("<div class='albumDetailTitleContent' id=albumContentTitle"+(i+1)+"></div");
		$("#albumContentTitle" + (i+1)).append("<h2 class='albumDetailLabel'>"+ (i+1) + "</h2>");
		$("#albumContentTitle" + (i+1)).append("<h2 class='albumDetailLabel title'>"+ songs[album-1][i] + "</h2>");
		$("#albumContentTitle" + (i+1)).append("<h2 class='albumDetailLabel length'>"+ songLengths[album-1][i] + "</h2>");
	};
	$(".currentAlbumPlayback.active").attr("id", "blur" + album);
	currentAlbumOffset = elemOffset;
}

function hideAlbum (album) {
	currentAlbum = album;
	$(".albumDetail").css("width", "0%");
	$(".albumDetail").css("height", "0%");
	$("#album" + album).animate({
		left: currentAlbumOffset.left,
		top: currentAlbumOffset.top
	}, 300, "swing");
	$(".albumDetail").css("opacity", 0.0);
	window.setTimeout(function() {
		$("#album" + album).remove();
		$(".noAlbumFilled").attr("id", "album" + album);
		$(".noAlbumFilled").removeClass("noAlbumFilled");
	}, 300);
	if (album > 1) {
		$("#album" + (album-1)).after("<div class='singleAlbum noAlbumFilled'></div>");
	} else {
		$("#album2").before("<div class='singleAlbum noAlbumFilled'></div>");
	}
	$(".albumOverview").addClass("active");
	$(".albumPlaybackBackgroundFrame").removeClass("active");
	$(".albumDetail").removeAttr("id", "blur" + album);
	$(".currentAlbumPlayback").attr("id", "blur" + currentlyPlayingAlbum);
}

function removeAlbum (album) {
	currentAlbum = album;
	$(".albumDetail").css("width", "0%");
	$(".albumDetail").css("height", "0%");
	$(".albumDetail").css("opacity", 0.0);
	
	window.setTimeout(function() {
		$("#album" + album).remove();
		$(".noAlbumFilled").attr("id", "album" + album);
		$(".noAlbumFilled").removeClass("noAlbumFilled");
	},25)
	
	if (album > 1) {
		$("#album" + (album-1)).after("<div class='singleAlbum noAlbumFilled'></div>");
	} else {
		$("#album2").before("<div class='singleAlbum noAlbumFilled'></div>");
	}
	$(".currentAlbumPlayback").attr("id", "blur" + currentlyPlayingAlbum);
}


function displayArtist (artist) {
	currentArtist = artist;
	console.log("Artist: " + artists[artist-1]);
	console.log("Albums: " + artistAlbums[artist-1].length);
	var elemOffset = $("#artist_blur" + artist).offset();
	console.log(elemOffset);
	for (var i = 1; i <= 6; i++) {
		var difference = artist - i;
		if (i < artist) {
			$("#artist_blur" + i).animate({
				top: -128 * difference
			}, 300, "swing")
		} else if (i > artist) {
			$("#artist_blur" + i).animate({
				top: elemOffset.top + 128 * (-difference)
			}, 300, "swing")
		}
	};
	$(".artistOverview").removeClass("active");
	$(".artistDetail").addClass("active");
	$(".artistDetail").html("");
	$(".artistDetail").append("<div class='artistCell' id='artist_blur" + artist + "'></div>");
	$(".artistDetail > #artist_blur" + artist).append("<div class='artistTitle'><h1>" + artists[artist-1] + "</h1></div>");
	$(".artistDetail > #artist_blur" + artist).css("left", "0px");
	$(".artistDetail > #artist_blur" + artist).css("top", elemOffset.top);
	$(".artistDetail > #artist_blur" + artist).animate({
		top: 0
	}, 300, "swing");
	window.setTimeout(function() {
		$(".artistDetail").append("<div class='artistDetailViewContainer'></div>")
		for (var i = 1; i <= artistAlbums[artist-1].length; i++) {
			$(".artistDetailViewContainer").append("<div class='singleAlbum' id='artistAlbum" + artist + "_" + i + "'></div>");
		};
		
	},300);
}

function hideArtist (artist) {
	for (var i = 1; i <= 6; i++) {
		$(".artistOverview > #artist_blur" + i).animate({
			top: 0
		}, 300, "swing")
	};
}


function setPlayingAlbum (album) {
	songCounter = 0;
	sendToMacbook[0] = currentAlbum;
	sendToMacbook[1] = songs[album-1][songCounter];
	sendToMacbook[2] = albumArtist[album-1];
	removeAlbum(currentAlbum);
	albumDetail = false;
	albumOverview = false;
	$(".albumOverview").removeClass("active");
	$(".albumPlaybackView").addClass("active");
	counter = 0;
	closeMenu("multimedia", "");

	$(".currentTitle").attr("id", "queue" + album);
	$(".currentAlbumPlayback").attr("id", "blur" + album);
	$(".currentTitleLabel.song").html(songs[album-1][songCounter]);
	$(".currentTitleLabel.artist").html(albumArtist[album-1]);
}














