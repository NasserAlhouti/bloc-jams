
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' + //output table row class "album-view-song-item "
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + //each song has a different number
    '  <td class="song-item-title">' + songName + '</td>' + //depends on the song
    '  <td class="song-item-duration">' + songLength + '</td>' + //each song has a different duratoin
    '</tr>';

    var clickHandler = function(){ // function bracket
      var songNumber = $(this).attr('data-song-number');

	if (currentlyPlayingSongNumber !== null) { //condition bracket
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	} // end of condition
	if (currentlyPlayingSongNumber !== songNumber) { // condition function
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    updatePlayerBarSong()
	} // condition end
  else if (currentlyPlayingSongNumber === songNumber) { // else condition
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton)
		currentlyPlayingSongNumber = null;
    currentSongFromAlbum = null;
	}// end of else condition
}; // function end
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    }
    var $row = $(template);
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover,offHover);
  return $row
};
// first function
var setCurrentAlbum = function(album) {
  // #1 setting up the variables
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  // #2 changing the text
  $albumTitle.text(album.title); // the text is being set to what excatly we are setting the album to the parameter.title
  $albumArtist.text(album.artist); //parameter.artist
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  // #3
  $albumSongList.empty(); // why are we setting it to an empty string?

  // #4
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow); //song number can't be equal to 0 so that's why we add one to it
  }
};
var albums = [albumPicasso, albumMarconi, albumNasser];
var index = 1;
var pauseButtonTemplate = '<a class="album-song-button"><span class ="ion-pause"></span></a>';
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var playerBarPlayButton = '<span class ="ion-pause"></span>';
var playerBarPauseButton ='<span class="ion-play"></span>'
var currentAlbum = null;
var currentlyPlayingSongNumber =null;
var currentSongFromAlbum = null;
var updatePlayerBarSong = function(){
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
 $('.currently-playing .artist-name').text(currentAlbum.artist);
$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
$('.main-controls .play-pause').html(playerBarPauseButton)
};
$(document).ready( function() {
  setCurrentAlbum(albumPicasso); //when the page loads album picasso loads

  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  albumImage.addEventListener("click", function(event) { // event bracket
    setCurrentAlbum(albums[index]);
    index++;

    if (index == albums.length) {
      index = 0;
    } // end of if condition
  }); // end of event bracket
}); //end of second function
