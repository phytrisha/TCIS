function populateAlbums (source, amount) {
	for (var i = 1; i <= amount; i++) {
		$(source).append("<div class='singleAlbum' id='album" + i + "'></div>");
	};
}