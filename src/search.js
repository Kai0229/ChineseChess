import E from './engine.js';

const VALUES = { k: 100000, r: 900, c: 450, h: 410, e: 200, a: 200, p: 100 };
const MATE = 1000000;
const other = side => side === 'b' ? 'r' : 'b';
const apply = (board, move) => {
  const next = board.slice();
  next[move.t] = next[move.f];
  next[move.f] = null;
  return next;
};

function evaluate(board, side) {
  let score = 0;
  for (let i = 0; i < 90; i++) {
    const p = board[i];
    if (!p) continue;
    const advance = p.s === 'b' ? Math.floor(i / 9) : 9 - Math.floor(i / 9);
    const center = 4 - Math.abs(i % 9 - 4);
    let position = 0;
    if (p.t === 'p') position = advance * 9 + (advance >= 5 ? 45 + center * 7 : center * 2);
    if (p.t === 'h') position = center * 8 + Math.min(advance, 6) * 6;
    if (p.t === 'r') position = center * 3 + Math.min(advance, 6) * 4;
    if (p.t === 'c') position = center * 5 + Math.min(advance, 5) * 3;
    score += (p.s === side ? 1 : -1) * (VALUES[p.t] + position);
  }
  return score;
}

// Iterative deepening always keeps the last fully searched result.
export function searchBestMove(position, { timeMs = 4000, maxDepth = 8, onIteration } = {}) {
  const board = position.slice();
  const roots = E.moves(board, 'b');
  if (!roots.length) return { move: null, depth: 0, nodes: 0 };
  const deadline = performance.now() + Math.max(0, timeMs);
  const timeout = Symbol('search deadline');
  const cache = new Map();
  let nodes = 0, completedDepth = 0, bestMove = roots[0], bestScore = -Infinity;
  const checkTime = () => { if (performance.now() >= deadline) throw timeout; };
  const keyOf = (b, side) => side + b.map(p => p ? p.s + p.t : '.').join('');
  const pack = (score, ply) => score > MATE / 2 ? score + ply : score < -MATE / 2 ? score - ply : score;
  const unpack = (score, ply) => score > MATE / 2 ? score - ply : score < -MATE / 2 ? score + ply : score;
  function ordered(b, list, preferred) {
    return list.map(move => ({ move, score: preferred?.f === move.f && preferred?.t === move.t ? 10000000 : b[move.t] ? VALUES[b[move.t].t] * 16 - VALUES[b[move.f].t] : 0 }))
      .sort((a, b) => b.score - a.score).map(item => item.move);
  }
  function visit(b, side, depth, alpha, beta, ply, quietDepth = 0) {
    nodes++;
    if ((nodes & 31) === 0) checkTime();
    const originalAlpha = alpha;
    const key = keyOf(b, side);
    const hit = depth > 0 ? cache.get(key) : null;
    if (hit && hit.depth >= depth) {
      const score = unpack(hit.score, ply);
      if (hit.bound === 'exact' || hit.bound === 'lower' && score >= beta || hit.bound === 'upper' && score <= alpha) return score;
    }
    const legal = E.moves(b, side);
    if (!legal.length) return -MATE + ply; // Xiangqi stalemate also loses.
    const inCheck = E.check(b, side);
    if (depth <= 0) {
      const standing = evaluate(b, side);
      if (quietDepth >= 8) return standing;
      if (!inCheck) {
        if (standing >= beta) return standing;
        alpha = Math.max(alpha, standing);
      }
      const tactical = inCheck ? legal : legal.filter(m => b[m.t]);
      for (const m of ordered(b, tactical)) {
        const score = -visit(apply(b, m), other(side), 0, -beta, -alpha, ply + 1, quietDepth + 1);
        if (score >= beta) return score;
        alpha = Math.max(alpha, score);
      }
      return alpha;
    }
    let best = -Infinity, chosen = null;
    for (const m of ordered(b, legal, hit?.move)) {
      const score = -visit(apply(b, m), other(side), depth - 1, -beta, -alpha, ply + 1);
      if (score > best) { best = score; chosen = m; }
      alpha = Math.max(alpha, score);
      if (alpha >= beta) break;
    }
    if (cache.size > 50000) cache.clear();
    cache.set(key, { depth, score: pack(best, ply), move: chosen, bound: best <= originalAlpha ? 'upper' : best >= beta ? 'lower' : 'exact' });
    return best;
  }
  for (let depth = 1; depth <= maxDepth; depth++) {
    try {
      checkTime();
      let score = -Infinity, chosen = bestMove;
      for (const m of ordered(board, roots, bestMove)) {
        checkTime();
        const result = -visit(apply(board, m), 'r', depth - 1, -Infinity, -score, 1);
        if (result > score) { score = result; chosen = m; }
      }
      bestMove = chosen; bestScore = score; completedDepth = depth;
      onIteration?.({ move: bestMove, depth, nodes, score });
      if (score > MATE / 2) break;
    } catch (error) {
      if (error !== timeout) throw error;
      break;
    }
  }
  return { move: bestMove, depth: completedDepth, nodes, score: Number.isFinite(bestScore) ? bestScore : null };
}
