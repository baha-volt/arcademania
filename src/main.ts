import './styles/global.css';
import { PinballBoardView } from './views/pinballBoard.view';

document.addEventListener('DOMContentLoaded', () => {
  const board = new PinballBoardView();
  board.init();
});
