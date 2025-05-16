'use strict';

const espoo = document.getElementById('Espoo');
const pääkaupunkiseutu = document.getElementById('Pääkaupunkiseutu');
const lohja = document.getElementById('Lohja');
const hyvinkää = document.getElementById('Hyvinkää');
const reisjärvi = document.getElementById('Reisjärvi');
const button = document.getElementById('start-button');
let mapChoice = 'Espoo';

espoo.addEventListener('click', () => {
  mapChoice = 'Espoo';
  espoo.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  lohja.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  hyvinkää.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  reisjärvi.style.backgroundColor = 'rgba(0, 0, 0, 0)';
});
pääkaupunkiseutu.addEventListener('click', () => {
  mapChoice = 'Pääkaupunkiseutu';
  espoo.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  pääkaupunkiseutu.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  lohja.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  hyvinkää.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  reisjärvi.style.backgroundColor = 'rgba(0, 0, 0, 0)';
});
lohja.addEventListener('click', () => {
  mapChoice = 'Lohja';
  espoo.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  pääkaupunkiseutu.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  lohja.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  hyvinkää.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  reisjärvi.style.backgroundColor = 'rgba(0, 0, 0, 0)';
});
hyvinkää.addEventListener('click', () => {
  mapChoice = 'Hyvinkää';
  espoo.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  pääkaupunkiseutu.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  lohja.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  hyvinkää.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  reisjärvi.style.backgroundColor = 'rgba(0, 0, 0, 0)';
});
reisjärvi.addEventListener('click', () => {
  mapChoice = 'Reisjärvi';
  espoo.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  pääkaupunkiseutu.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  lohja.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  hyvinkää.style.backgroundColor = 'rgba(0, 0, 0, 0)';
  reisjärvi.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
});
button.addEventListener('click', () => {
  sessionStorage.setItem('mapChoice', mapChoice);
  window.open('game.html', '_self');
});
