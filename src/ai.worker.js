import E from './engine.js';
import { searchBestMove } from './search.js';

self.onmessage = ({ data: { board, level } }) => {
  const result = level === 3 ? searchBestMove(board) : { move: E.ai(board, level) };
  self.postMessage(result);
};
