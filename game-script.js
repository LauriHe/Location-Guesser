'use strict';

function initialize() {
  const scoreBar = document.getElementById('score-bar');
  const container = document.getElementById('container');
  const mapElement = document.getElementById('map');
  const showMapButton = document.getElementById('show-map-button');
  const showMapSpan = document.getElementById('show-map-span');
  const guessButton = document.getElementById('guess-button');
  const backToStartButton = document.getElementById('back-to-start-button');
  const continueButton = document.getElementById('continue-button');
  const background = document.getElementById('bg');
  const distanceContainer = document.getElementById('distance-container');
  const distanceText = document.getElementById('distance-text');

  let line;
  let round = 1;
  let gameScore = 0;
  let answers = [];
  let correctAnswers = [];
  let markerPlaced = false;
  const mapChoice = sessionStorage.getItem('mapChoice');

  //Location coordinates
  const espooCenter = { lat: 60.197303, lng: 24.680686 };
  const pääkaupunkiseutuCenter = { lat: 60.244962, lng: 24.909126 };
  const hyvinkääCenter = { lat: 60.630097, lng: 24.859651 };
  const lohjaCenter = { lat: 60.251009, lng: 24.067349 };
  const reisjärviCenter = { lat: 63.605216, lng: 24.938874 };

  //Bounding box for coordinates
  const espooMinMax = [
    { lat: 60.122604, lng: 24.57844 },
    { lat: 60.251338, lng: 24.830877 },
  ];
  const pääkaupunkiseutuMinMax = [
    { lat: 60.114627, lng: 25.228265 },
    { lat: 60.337993, lng: 24.539206 },
  ];
  const hyvinkääMinMax = [
    { lat: 60.592714, lng: 24.79725 },
    { lat: 60.66046, lng: 24.912418 },
  ];
  const lohjaMinMax = [
    { lat: 60.212653, lng: 24.003699 },
    { lat: 60.270975, lng: 24.110149 },
  ];
  const reisjärviMinMax = [
    { lat: 63.531776, lng: 24.754691 },
    { lat: 63.704909, lng: 25.213061 },
  ];

  let mapCenter;
  let locationMinMax;

  if (mapChoice == 'Hyvinkää') {
    mapCenter = hyvinkääCenter;
    locationMinMax = hyvinkääMinMax;
  } else if (mapChoice == 'Lohja') {
    mapCenter = lohjaCenter;
    locationMinMax = lohjaMinMax;
  } else if (mapChoice == 'Reisjärvi') {
    mapCenter = reisjärviCenter;
    locationMinMax = reisjärviMinMax;
  } else if (mapChoice == 'Pääkaupunkiseutu') {
    mapCenter = pääkaupunkiseutuCenter;
    locationMinMax = pääkaupunkiseutuMinMax;
  } else {
    mapCenter = espooCenter;
    locationMinMax = espooMinMax;
  }

  //Initialize map
  const map = new google.maps.Map(document.getElementById('map'), {
    disableDefaultUI: true,
    center: mapCenter,
    zoom: 10,
  });

  //Calculate random location
  let location = randomLocation(locationMinMax);

  let panoramaTries = 0;
  initializePanorama(location);
  function initializePanorama(panormamaLocation) {
    const streetViewService = new google.maps.StreetViewService();
    const streetViewDistance = 50;

    //Check if panorama is available
    streetViewService.getPanoramaByLocation(panormamaLocation, streetViewDistance, function (streetViewPanoramaData, status) {
      if (status === google.maps.StreetViewStatus.OK) {
        //Initialize street view
        const panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
          position: panormamaLocation,
          disableDefaultUI: true,
          showRoadLabels: false,
          pov: {
            heading: 0,
            pitch: 0,
          },
        });
        const correctLocation = { lat: streetViewPanoramaData.location.latLng.lat(), lng: streetViewPanoramaData.location.latLng.lng() };
        correctAnswers.push(correctLocation);
        location = correctLocation;
        console.log('It took ' + (panoramaTries + 1) + ' tries to find panorama');
      } else {
        panoramaTries++;
        initializePanorama(randomLocation(locationMinMax));
      }
    });
  }

  //Add marker when map is clicked
  let markerControll = true;
  let markers = [];
  let markerCoordinates = { lat: 0, lng: 0 };
  map.addListener('click', (event) => {
    markerPlaced = true;
    guessButton.classList.remove('unavailable');
    guessButton.textContent = 'Guess';

    if (markerControll) {
      setMapOnAll(null);
      markers = [];
      placeMarker(event.latLng);
    }
  });

  //Draw marker
  function placeMarker(latLng) {
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
    markers.push(marker);
    //Update marker coordinates
    markerCoordinates.lat = marker.getPosition().lat();
    markerCoordinates.lng = marker.getPosition().lng();
  }

  //Set map to markers and lines
  function setMapOnAll(map) {
    try {
      line.setMap(null);
    } catch (error) {}

    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  //Marker svg
  const flagMarker = {
    path: 'M19.5 11H22.5V8H19.5ZM25.5 11V8H28.5V11ZM19.5 23V20H22.5V23ZM31.5 17V14H34.5V17ZM31.5 23V20H34.5V23ZM25.5 23V20H28.5V23ZM31.5 11V8H34.5V11ZM22.5 14V11H25.5V14ZM13.5 40V8H16.5V11H19.5V14H16.5V17H19.5V20H16.5V40ZM28.5 20V17H31.5V20ZM22.5 20V17H25.5V20ZM19.5 17V14H22.5V17ZM25.5 17V14H28.5V17ZM28.5 14V11H31.5V14Z',
    fillColor: 'black',
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 1,
    anchor: new google.maps.Point(15, 30),
  };

  //Draws correct answer on the map
  function drawCorrectAnswer(location, score) {
    let lineCoordinates = [];
    lineCoordinates.push(location);
    lineCoordinates.push(markerCoordinates);

    line = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    line.setMap(map);

    const marker = new google.maps.Marker({
      position: location,
      icon: flagMarker,
      map: map,
    });
    markers.push(marker);
  }

  showMapButton.addEventListener('click', () => {
    if (mapElement.classList.contains('active')) {
      mapElement.classList.remove('active');
      mapElement.classList.add('inactive');
      showMapSpan.textContent = 'open_in_full';
      container.style.height = '15%';
      container.classList.add('noMap');
    } else {
      mapElement.classList.remove('inactive');
      mapElement.classList.add('active');
      showMapSpan.textContent = 'close_fullscreen';
      container.style.height = '40%';
      container.classList.remove('noMap');
    }
  });

  guessButton.addEventListener('click', () => {
    if (markerPlaced) {
      markerPlaced = false;
      guessButton.classList.add('unavailable');
      guessButton.textContent = 'Place a marker';
      map.setCenter(location);
      map.setZoom(15);
      container.classList.remove('noMap');
      mapElement.classList.remove('inactive');
      mapElement.classList.add('active');
      container.style.height = '40%';
      showMapSpan.textContent = 'close_fullscreen';
      const distance = calculateDistance(location, markerCoordinates);
      markerControll = false;
      container.style.zIndex = '30';
      container.style.overflow = 'visible';
      showMapButton.classList.remove('active');
      guessButton.classList.remove('active');
      backToStartButton.classList.remove('active');
      showMapButton.classList.add('inactive');
      guessButton.classList.add('inactive');
      backToStartButton.classList.add('inactive');
      background.classList.remove('inactive');
      background.classList.add('active');
      distanceContainer.classList.remove('inactive');
      distanceContainer.classList.add('active');
      mapElement.classList.add('answer-map');
      const score = calculateScore(distance);
      drawCorrectAnswer(location, score);
      if (round < 6) {
        gameScore += score;
        console.log('Game score: ' + gameScore);
      }
      distanceText.textContent = 'Distance to location: ' + distance + ' m';
      moveScoreBar(score);
    }
  });

  backToStartButton.addEventListener('click', () => {
    initializePanorama(location);
  });

  continueButton.addEventListener('click', () => {
    answers.push(markers[markers.length - 1].getPosition());
    console.log('Answers: ' + JSON.stringify(markers));
    if (round < 5) {
      map.setCenter(mapCenter);
      map.setZoom(10);

      mapElement.classList.remove('active');
      mapElement.classList.add('inactive');
      showMapSpan.textContent = 'open_in_full';
      container.style.height = '15%';
      container.classList.add('noMap');

      scoreBar.style.display = 'block';
      markerControll = true;
      container.style.zIndex = '10';
      container.style.overflow = 'hidden';
      showMapButton.classList.remove('inactive');
      guessButton.classList.remove('inactive');
      backToStartButton.classList.remove('inactive');
      showMapButton.classList.add('active');
      guessButton.classList.add('active');
      backToStartButton.classList.add('active');
      const distance = calculateDistance(location, markerCoordinates);
      background.classList.remove('active');
      background.classList.add('inactive');
      distanceContainer.classList.remove('active');
      distanceContainer.classList.add('inactive');
      mapElement.classList.remove('answer-map');
      initializePanorama(randomLocation(locationMinMax));
      setMapOnAll(null);
      markers = [];
      panoramaTries = 0;
      round++;
    } else {
      sessionStorage.setItem('gameScore', gameScore);
      sessionStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
      sessionStorage.setItem('answers', JSON.stringify(answers));
      sessionStorage.setItem('mapCenter', JSON.stringify(mapCenter));
      window.open('summary.html', '_self');
    }
  });
}

window.initialize = initialize;

//Return a random coordinate within a specified bouding box
function randomLocation(locationMinMax) {
  const min = locationMinMax[0];
  const max = locationMinMax[1];
  const lat = Math.random() * (max.lat - min.lat) + min.lat;
  const lng = Math.random() * (max.lng - min.lng) + min.lng;
  const location = { lat, lng };
  return location;
}

//Calculate distance from coordinates
function calculateDistance(mk1, mk2) {
  var R = 6371.071; // Radius of the Earth in kilometers
  var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2))
    );
  return parseInt(d * 1000);
}

function calculateScore(distance) {
  let score = parseInt(((distance - 7000) / (20 - 7000)) * 100);
  if (score > 100) {
    score = 100;
  }
  if (score < 0) {
    score = 0;
  }
  score *= 10;
  return score;
}

function moveScoreBar(score) {
  const scoreBar = document.getElementById('score-bar');
  const scoreText = document.getElementById('score-text');
  score /= 10;
  let width = 0;
  scoreText.textContent = 'Score: 0';
  const id = setInterval(frame, 10);
  function frame() {
    if (score == 0) {
      scoreBar.style.display = 'none';
    }
    if (width >= score) {
      clearInterval(id);
    } else {
      width++;
      scoreBar.style.width = width + '%';
      scoreText.textContent = 'Score: ' + width * 10;
    }
  }
}
