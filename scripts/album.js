// how can I invoke this object so that it can be displayed as HTML
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

    if (currentlyPlayingSongNumber !== null) {
      // Revert to song number for currently playing song because user started playing new song.
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    if (currentlyPlayingSongNumber !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing.
      var $volumeFill =$('.volume .fill');
      var $volumeThumb =$('.volume .thumb');
      $volumeFill.width(currentVolume +'%');
      $volumeThumb.css({left:currentVolume +'%'})
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play()
      updatePlayerBarSong()
    } else if (currentlyPlayingSong === songNumber) {
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
      }else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }
  };
  // #2 method
  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
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
  $('.currentlyPlaying .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title+" - "+currentAlbum.artist)
  $('.main-controls .play-pause').html(playerBarPauseButton)
}
var index = 1;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class ="album-song-button"><span class ="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class ="ion-pause"></span>'
var currentAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var currentSoundFile = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentVolume = 80;
var seek = function(time){
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}
var setupSeekBar = function(){
  var $seekBars = $('.player-bar .seek-bar');
  $seekBars.click(function(event){
    // #3
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    // #4
    var seekBarFillRatio = offsetX / barWidth;
    if($(this).parent().attr('class')== 'seek-control'){
      seek(seekBarFillRatio*currentSoundFile.getDuration());
    } else{
      setVolume(seekBarFillRatio * 100)
    }
    // #5
    updateSeekPercentage($(this),seekBarFillRatio);
  });
  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();
    $(document).bind('mousemove.thumb',function(event){
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;
      updateSeekPercentage($seekBar , seekBarFillRatio);
      var updateSeekBarWhileSongPlays = function(){
        if ($seekBar.parent().attr('class')== 'seek-control') {
          seek(seekBarFillRatio*currentSoundFile.getDuration());
        }else {
          setVolume(seekBarFillRatio);
        }
        updateSeekPercentage($seekBar , seekBarFillRatio);
        if (currentSoundFile) {
          currentSoundFile.bind('timeupdate',function(event){
            var $seekBar = $('.seek-control .seek-bar');

          });
        };
      };
    });
    // #10
    $(document).bind('mouseup.thumb',function(){
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};
var updateSeekPercentage = function($seekBar, seekBarFillRatio){
  var offsetXPercent = seekBarFillRatio * 100;
  // #1
  offsetXPercent = Math.max(0,offsetXPercent); // making sure that the percentage is not less than zero
  offsetXPercent = Math.min(100, offsetXPercent); // making sure that the percentage doesn't exceed zero
  // #2
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left:percentageString});
};
var getSongNumberCell = function(number){
return $('.song-item-number[data-song-number"]'+number+'"]')
}
var setSong = function(songNumber){
  if (currentSoundFile) {
    currentSoundFile.stop()
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber-1];
  // #1
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl,{
    format:['mp3'],
    preload:true
  });
  setVolume(currentVolume);
};
var setVolume = function(volume){
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
}
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
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
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
  setSong(currentSongIndex +1 )
  currentSoundFile.play();
  // Incrementing the song
  currentSongIndex++;
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }
  // Save the last song number before changing it;
    var lastSongNumber = currentlyPlayingSongNumber
  // Set a new current Song
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  // update the player Bar information
  updatePlayerBarSong();
  var $nextSongNumberCell = $('.song-item-number[data-song-number="'+ currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="]' + lastSongNumber + '"]');
  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};
$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBar();
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
