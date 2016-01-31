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
	$(".currentAlbumPlayback").attr("id", "blur" + album);
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
}

