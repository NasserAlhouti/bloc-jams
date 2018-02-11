var albumPicasso = { // the names of the albums
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
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' + //output table row class "album-view-song-item "
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + //each song has a different number
    '  <td class="song-item-title">' + songName + '</td>' + //depends on the song
    '  <td class="song-item-duration">' + songLength + '</td>' + //each song has a different duratoin
    '</tr>';
  return template
};
// first function
var setCurrentAlbum = function(album) {
  // #1 setting up the variables
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  // #2 changing the text
  albumTitle.firstChild.nodeValue = album.title; // the text is being set to what excatly we are setting the album to the parameter.title
  albumArtist.firstChild.nodeValue = album.artist; //parameter.artist
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  // #3
  albumSongList.innerHTML = ''; // why are we setting it to an empty string?

  // #4
  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title /* ie blue - green - pink*/ , album.songs[i].duration); //song number can't be equal to 0 so that's why we add one to it
  }
};
var albums = [albumPicasso, albumMarconi, albumNasser];
var index = 1;
var pauseButtonTemplate = '<a class="album-song-button"><span class ="ion-pause"></span></a>';
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var currentlyPlayingSong = null;
window.onload = function() {
  setCurrentAlbum(albumPicasso); //when the page loads album picasso loads
  var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
  var songRows = document.getElementsByClassName('album-view-song-item');
  songListContainer.addEventListener('mouseover', function(event) {
    //#1
    if (event.target.parentElement.className === 'album-view-song-item') {
      event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
      var songItem = getSongItem(event.target);

      if (songItem.getAttribute('data-song-number') == currentlyPlayingSong) {
        songItem.innerHTML = pauseButtonTemplate;
      }
    }

  });
  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
      // #1
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');
      if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }

    });
    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  albumImage.addEventListener("click", function(event) {
    setCurrentAlbum(albums[index]);
    index++;

    if (index == albums.length) {
      index = 0;
    }
  });
}; //end of second function
var findParentsByClassName = function(element, targetClass) {
  if (element) {
    var currentParent = element.parentElement;
        while (currentParent.className !== targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
    }
    if (currentParent.className !== targetClass) {
      console.log('no parent found with that class ')
    } else {
      console.log('No parent found')
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
        case 'song-item-title':
        case 'song-item-duration':
            return findParentsByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
};
var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);

  if (currentlyPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
      }else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }
};
