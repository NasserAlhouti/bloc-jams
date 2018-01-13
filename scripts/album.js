var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [{
      title: 'Blue',
      duration: '4:26'
    },
    {
      title: 'Green',
      duration: '3:14'
    },
    {
      title: 'Red',
      duration: '5:01'
    },
    {
      title: 'Pink',
      duration: '3:21'
    },
    {
      title: 'Magenta',
      duration: '2:15'
    }
  ]
};
//Another album example
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [{
      title: 'Hello, Operator?',
      duration: '1:01'
    },
    {
      title: 'Ring, ring, ring',
      duration: '5:01'
    },
    {
      title: 'Fits in your pocket',
      duration: '3:21'
    },
    {
      title: 'Can you hear me now?',
      duration: '3:14'
    },
    {
      title: 'Wrong phone number',
      duration: '2:15'
    }
  ]
};
var albumNasser = {
  title: "Greatest hits",
  artist: 'Nasser alhouti',
  label: 'studio ghibli',
  year: "2012",
  albumArtUrl: 'assets/images/album_covers/15.png',
  songs: [{
      title: 'Where do you take your bar?',
      duration: '4:01'
    },
    {
      title: 'I left my wallet at your house',
      duration: '2:04'
    },
    {
      title: "Finding nirvana",
      duration: '3:04'
    },
    {
      title: "Train like a ninja",
      duration: '1:30'
    },
    {
      title: "The day is over?",
      duration: '6:02'
    }
  ]
};

// how can I invoke this object so that it can be displayed as HTML
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
    '  <td class="song-item-title">' + songName + '</td>' +
    '  <td class="song-item-duration">' + songLength + '</td>' +
    '</tr>';

  return $(template);
}; // by creating '' are we adding HTML if so how are we invoking it or making it display on screen
var setCurrentAlbum = function(album) {
  // #1 setting up the variables
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
    var $newRow = createSongRow(i+1, album.songs[i].title,album.songs[i].duration);
    $albumSongList.append($newRow)
  }
};
var albums = [albumPicasso, albumMarconi, albumNasser];
var index = 1;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
window.onload = function() {
  setCurrentAlbum(albumPicasso);
  var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
  var songRows = document.getElementsByClassName('album-view-song-item');
  songListContainer.addEventListener('mouseover', function(event) {
    //#1
    if (event.target.parentElement.className === 'album-view-song-item') {
      event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
    }

  });
  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener("mouseleave", function(event) {
      this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
    }) // why are there events in the function
  }
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  albumImage.addEventListener("click", function(event) {
    setCurrentAlbum(albums[index]);
    index++;

    if (index == albums.length) {
      index = 0;
    }
  });
};
var findParentsByClassName = function(element, targetClass) {
  if (element) {
    var currentParent = element.parentElement;
    while (currentParent.className !== targetClass && currentParent.className !== null) {
      currentParent = currentParent.parentElement;
    }
    return currentParent;
  }

};
var getSongItem = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentsByClassName(element, 'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
      break;
    default:

  }
}
