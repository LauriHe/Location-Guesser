'use strict';

const score = sessionStorage.getItem('gameScore');
function moveScoreBar(score) {
  const scoreBar = document.getElementById('score-bar');
  const scoreText = document.getElementById('score-text');
  if (isNaN(score)) {
    score = 0;
  }

  if (score == 0) {
    scoreBar.style.display = 'none';
  }
  score /= 50;
  let width = 0;
  const id = setInterval(frame, 10);
  function frame() {
    if (width >= score) {
      clearInterval(id);
    } else {
      width++;
      scoreBar.style.width = width + '%';
      scoreText.textContent = 'Score: ' + width * 50;
    }
  }
}
moveScoreBar(score);

const button = document.getElementById('button');
button.addEventListener('click', () => {
  window.open('game.html', '_self');
});

function initMap() {
  const correctAnswers = JSON.parse(sessionStorage.getItem('correctAnswers'));
  const answers = JSON.parse(sessionStorage.getItem('answers'));
  const mapCenter = JSON.parse(sessionStorage.getItem('mapCenter'));
  console.log(answers);

  const svgMarker = {
    path: 'M19.5 11H22.5V8H19.5ZM25.5 11V8H28.5V11ZM19.5 23V20H22.5V23ZM31.5 17V14H34.5V17ZM31.5 23V20H34.5V23ZM25.5 23V20H28.5V23ZM31.5 11V8H34.5V11ZM22.5 14V11H25.5V14ZM13.5 40V8H16.5V11H19.5V14H16.5V17H19.5V20H16.5V40ZM28.5 20V17H31.5V20ZM22.5 20V17H25.5V20ZM19.5 17V14H22.5V17ZM25.5 17V14H28.5V17ZM28.5 14V11H31.5V14Z',
    fillColor: 'black',
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 1,
    anchor: new google.maps.Point(15, 30),
  };

  const map = new google.maps.Map(document.getElementById('map'), {
    disableDefaultUI: true,
    zoom: 10,
    center: mapCenter,
  });

  /*for (let i = 0; i < answers.length; i++) {
    const marker = new google.maps.Marker({
      position: answers[i],
      map: map
    });
  }*/

  for (let i = 0; i < correctAnswers.length; i++) {
    const marker = new google.maps.Marker({
      position: answers[i],
      label: i + 1,
      map: map,
    });
    const flagMarker = new google.maps.Marker({
      position: correctAnswers[i],
      icon: svgMarker,
      map: map,
    });

    let lineCoordinates = [];
    lineCoordinates.push(answers[i], correctAnswers[i]);

    const line = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    line.setMap(map);
  }
}

window.initMap = initMap;
