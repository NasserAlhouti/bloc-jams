// how can I invoke this object so that it can be displayed as HTML
var setSong = function(songNumber){
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1]
};
var getSongNumberCell = function(number){
return $('.song-item-number[data-song-number"]'+number+'"]')
}
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + songLength + '</td>' +
    '</tr>';

  var $row = $(template) // since no value is being returned the template won't show on your screen
// #1 method
  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (setSong() !== null) {
      // Revert to song number for currently playing song because user started playing new song.
       var currentlyPlayingCell = $('.song-item-number[data-song-number="' + setSong() + '"]');
      currentlyPlayingCell.html(setSong());
    }
    if (setSong() !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing.
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      updatePlayerBarSong();
    } else if (currentlyPlayingSong === songNumber) {
      // Switch from Pause -> Play button to pause currently playing song.
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton)
      currentlyPlayingSongNumber = null;
      currentSongFromAlbum = null;
    }
  };
  // #2 method
  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));
    if (songNumber !== setSong()) {
      songNumberCell.html(playButtonTemplate);

    }
  }
  // #3 method
  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
    }
  };
  /* #1 */
  $row.find('song-item-number').click(clickHandler)
  /* #2 */
  $row.hover(onHover, offHover);
  return $row;

}; // by creating '' are we adding HTML if so how are we invoking it or making it display on screen
var setCurrentAlbum = function(album) {
    // #1 setting up the variables
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    // #2 using the node for the varibles
    //
  $albumTitle.text(album.title); // .firstChild.nodeValue inserts text in the created? why are we setting that equal to album.title?
  $albumArtist.text(album.artist); // is firstChild.nodeValue similar to createTextNode ? how is it diffrent?
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl); //what does setAttribute do

  // #3
  $albumSongList.empty();

  // #4
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow)
  }
};
var trackIndex = function(album , song){
  return album.songs.indexOf(song);
}
var updatePlayerBarSong = function(){
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
      $('.currently-playing .artist-name').text(currentAlbum.artist);
      $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
}
var index = 1;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class ="album-song-button"><span class ="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';
 var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var currentSongFromAlbum = null;
var previousSong = function(){
  var currentSongIndex = trackIndex(currentAlbum , currentSongFromAlbum);
  // Note that we're decrementing the index here;
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }
  // Save the last song number before changing it
  var lastSongNumber = currentlyPlayingSongNumber;
  // set a new current song
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  // update the player bar information
  updatePlayerBarSong();
  $('.main-controls .play-pause').html(playerBarPauseButton);
  var $previousSongNumberCell = $('.song-item-number[data-song-number="'+currentlyPlayingSongNumber+'"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="'+lastSongNumber+'"]');
  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};
var nextSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Incrementing the song
  currentSongIndex++;
  if (currentSongIndex >= currentAlbum.songs.length) {
       currentSongIndex = 0;
   }
  // Save the last song number before changing it;

    var lastSongNumber = currentlyPlayingSongNumber;
  // Set a new current Song
   currentlyPlayingSongNumber = currentSongIndex + 1;
   currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  // update the player Bar information
  updatePlayerBarSong();
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
   $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
       $nextButton.click(nextSong);
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  albumImage.addEventListener("click", function(event) {
    setCurrentAlbum(albums[index]);
    index++;

    if (index == albums.length) {
      index = 0;
    }
  });
});
