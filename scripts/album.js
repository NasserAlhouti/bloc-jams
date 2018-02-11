var setSong = function(songNumber){
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber-1];
  //assign a new buzz object
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl,{
    //passed in a setting object that has two properties defined format and properties
    formats:['mp3'],
    preload:true
  });
  setVolume(currentVolume);
};
var setVolume = function(volume){
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume)
  }
}
var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]')
}
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' + //output table row class "album-view-song-item "
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + //each song has a different number
    '  <td class="song-item-title">' + songName + '</td>' + //depends on the song
    '  <td class="song-item-duration">' + songLength + '</td>' + //each song has a different duratoin
    '</tr>';

    var clickHandler = function(){ // function bracket
      var songNumber = parseInt($(this).attr('data-song-number'));

	if (currentlyPlayingSongNumber !== null) { //condition bracket
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	} // end of condition
	if (currentlyPlayingSongNumber !== songNumber) { // condition function
		// Switch from Play -> Pause button to indicate new song is playing.
		setSong(songNumber);
    currentSoundFile.play()
    updateSeekBarWhileSongPlays()
    $(this).html(pauseButtonTemplate);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    updatePlayerBarSong();
	} // condition end
  else if (currentlyPlayingSongNumber === songNumber) { // else condition
		// Switch from Pause -> Play button to pause currently playing song.
    if(currentSoundFile.isPaused()){
		$(this).html(pauseButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    currentSoundFile.play();

  } // end of the if condition
  else{
    $(this).html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentSoundFile.pause();
  }//end of else
	}// end of else condition
}; // function end
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt( songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

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
// global variables

var albums = [albumPicasso, albumMarconi, albumNasser];
var index = 1;
var pauseButtonTemplate = '<a class="album-song-button"><span class ="ion-pause"></span></a>';
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var playerBarPlayButton = '<span class ="ion-play"></span>';
var playerBarPauseButton ='<span class ="ion-pause"></span>'
var currentAlbum = null;
var currentlyPlayingSongNumber =null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var setupSeekBars = function(){
  var $seekBars = $('.player-bar .seek-bar');
  $seekBars.click(function(event){
    // set a new property on the event object called pageX
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
// we divide offSetX by the width of the entire bar to calculate seekBarFillRatio
var seekBarFillRatio = offsetX / barWidth;
// we pass this as the seek bar argument and seekBarFillRatio
updateSeekPercentage($(this),seekBarFillRatio);
  })
  // we find elemnts with a class of thumb in our seekbar and event listener for the mouse down
  $seekBars.find('.thumb').mousedown(function(event) {
    // taking the context of the event and rapping it in jQuery this will be equal to .thumb node that was clicked
    var $seekBar = $(this).parent();
    // introduce a new way to track events bind() behaves similary to addEventListener in that it takes a string of an event instead of wrapping
    $(document).bind('mousemove.thumb', function(event){// makes it go back to where it was
      var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
      updateSeekPercentage($seekBar, seekBarFillRatio);
    }) ;
    $(document).bind('mouseup.thumb',function(){
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
}
var $playSideBar = $('.main-controls .play-pause')
var updateSeekBarWhileSongPlays = function(){
  if (currentSoundFile) {
    // we bind the time update event to currentSoundFile time upadate is a custom Buzz event that fires repeatedly while time elapses during song PlayBack
    currentSoundFile.bind('timeupdate',function(event){
    // we use a new method for calculating the seekBarFillRatio we use buzz getTime() method to get the current time of the song and the getDuration() method for getting the total length of the song both Values return in units in seconds
    var seekBarFillRatio = this.getTime() / this.getDuration();
    var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar,seekBarFillRatio);
  });
  }
}
var updateSeekPercentage = function($seekBar , seekBarFillRatio){
  var offsetXPercent = seekBarFillRatio*100;
  // we use the built in javascript function Math.max() to make sure our percentage isn't less than zero
offsetXPercent = Math.max(0,offsetXPercent);
offsetXPercent = Math.min(100,offsetXPercent);
//we convert our percentage to a string and add the % when we set the width of the .fill class and left value of the .thumb
var percentageString = offsetXPercent +'%'
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left:percentageString})
}
var nextSong = function(){
  var currentSongIndex = trackIndex(currentAlbum,currentSongFromAlbum);
  currentSongIndex++;
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  } // save last song before changing it
  var lastSongNumber = currentlyPlayingSongNumber;
  //set a new current song
   setSong( currentSongIndex +1);
   currentSoundFile.play();
   updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  updatePlayerBarSong();
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
  $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
}
var previousSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
      // Note that we're _decrementing_ the index here
      currentSongIndex--;

      if (currentSongIndex < 0) {
          currentSongIndex = currentAlbum.songs.length - 1;
      }
      // Save the last song number before changing it
      var lastSongNumber = currentlyPlayingSongNumber;

      // Set a new current song
      setSong(currentSongIndex + 1);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

      // Update the Player Bar information
      updatePlayerBarSong();


      $('.main-controls .play-pause').html(playerBarPauseButton);

      var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

      $previousSongNumberCell.html(pauseButtonTemplate);
      $lastSongNumberCell.html(lastSongNumber);
};
var trackIndex = function(album,song){
  return album.songs.indexOf(song);
}
var updatePlayerBarSong = function(){
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
$('.main-controls .play-pause').html(playerBarPauseButton);
};
$(document).ready( function() {
  setCurrentAlbum(albumPicasso); //when the page loads album picasso loads
  setupSeekBars()
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  albumImage.addEventListener("click", function(event) { // event bracket
    setCurrentAlbum(albums[index]);
    index++;

    if (index == albums.length) {
      index = 0;
    } // end of if condition
  }); // end of event bracket
}); //end of second function
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
