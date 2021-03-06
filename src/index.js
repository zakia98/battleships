import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import Player from './Player.js';
import * as manageDOM from './manageDOM.js';
import Grid from './Grid.js';
import css from './style.css';
import GameOverScreen from './gameOver.js'
import ShipContainer from './ship-container.js'
let turn = 1;

const content = document.querySelector('.content');
let shipContainer = new ShipContainer();
document.querySelector('body').appendChild(shipContainer.element);


let playerGrid = new Grid('player', 'player', takeFire);
let computerGrid = new Grid('computer', 'computer', takeFire);
computerGrid.children.forEach((child) => child.addEventListener('click', (event) => { takeFire(event); }));
manageDOM.handleDrag(playerGrid)


content.appendChild(playerGrid.element);
content.appendChild(computerGrid.element);
playerGrid.loadShips();
computerGrid.generateAIShips();
const resetButton = document.querySelector('#reset');
resetButton.addEventListener('click', restart)

function takeFire(event) {
  if (event.target.dataset.valid === 'true' && playerGrid.checkIfAllShipsPlaced()) {
    turn += 1;
    event.target.dataset.valid = 'false';
    let coordinates = event.target.dataset.coordinates
    computerGrid.player.receiveAttack(coordinates);
    computerGrid.updateDisplay(coordinates);
    checkIfGameOver(computerGrid)
    takeComputerTurn();
  }
}

function takeComputerTurn() {
  const firedAttacks = playerGrid.player.firedAttacks
  if (firedAttacks[0] == undefined || firedAttacks[firedAttacks.length - 1].hit == false) {
    const coordinates = playerGrid.player.receiveRandomAttack();
    playerGrid.updateDisplay(coordinates);
    checkIfGameOver(playerGrid);
  } else {
    const coordinates = playerGrid.player.targetedAttack()
    playerGrid.updateDisplay(coordinates);
    checkIfGameOver(playerGrid);
  }
}

function checkIfGameOver(player) {
  let allShipsSunk = player.player.gameboard.allShipsSunk;
  if (allShipsSunk) {
    gameOver();
  }
}

function gameOver() {
  const modal = document.querySelector('.modal')
  modal.style.display = 'block';
}

function restart() {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
  playerGrid.element.remove();
  computerGrid.element.remove();
  shipContainer.element.remove();
  shipContainer = new ShipContainer();
  document.querySelector('body').appendChild(shipContainer.element);
  playerGrid = new Grid('player', 'player', takeFire);
  computerGrid = new Grid('computer', 'computer', takeFire);
  computerGrid.children.forEach((child) => child.addEventListener('click', (event) => { takeFire(event); }));
  manageDOM.handleDrag(playerGrid);

  content.appendChild(playerGrid.element);
  content.appendChild(computerGrid.element);
  playerGrid.loadShips();
  computerGrid.generateAIShips();
}