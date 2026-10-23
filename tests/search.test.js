import assert from 'node:assert/strict';
import E from '../src/engine.js';
import { searchBestMove } from '../src/search.js';
const at = (x,y) => y*9+x;
const setup = entries => { const b=Array(90).fill(null);for(const [x,y,t,s] of entries)b[at(x,y)]={t,s};return b; };
let count=0;
function test(name,fn){fn();count++;console.log('✓ '+name);}
const after=(b,m)=>{const n=b.slice();n[m.t]=n[m.f];n[m.f]=null;return n;};
test('Optimized generator matches exhaustive legal moves across a game',()=>{
  let b=E.initial(),side='r';
  for(let n=0;n<40;n++){
    const fast=E.moves(b,side),slow=[];
    for(let f=0;f<90;f++)if(b[f]?.s===side)for(let t=0;t<90;t++)if(E.legal(b,f,t))slow.push({f,t});
    const keys=list=>list.map(m=>m.f+':'+m.t).sort();assert.deepEqual(keys(fast),keys(slow));
    if(!fast.length)break;b=after(b,fast[(n*17+3)%fast.length]);side=side==='r'?'b':'r';
  }
});
test('Expert finds a forced win in one move',()=>{
  const b=setup([[4,0,'k','b'],[4,9,'k','r'],[3,7,'r','b'],[4,7,'r','b'],[5,8,'r','b']]);
  const result=searchBestMove(b,{timeMs:1000,maxDepth:3});assert(result.move);assert.equal(E.moves(after(b,result.move),'r').length,0);assert(result.score>500000);
});
test('Expert rejects a pawn capture that loses a rook',()=>{
  const b=setup([[4,0,'k','b'],[4,9,'k','r'],[4,5,'p','b'],[0,0,'r','b'],[0,3,'p','r'],[1,3,'r','r']]);
  const result=searchBestMove(b,{timeMs:800,maxDepth:3});assert(E.legal(b,result.move.f,result.move.t));assert.notDeepEqual(result.move,{f:at(0,0),t:at(0,3)});
});
test('Expert resolves check with a legal move',()=>{
  const b=setup([[4,0,'k','b'],[3,9,'k','r'],[4,3,'r','r'],[0,0,'r','b']]);
  assert(E.check(b,'b'));const result=searchBestMove(b,{timeMs:500,maxDepth:3});assert(E.legal(b,result.move.f,result.move.t));assert(!E.check(after(b,result.move),'b'));
});
test('An exhausted time budget still returns a legal move without changing the board',()=>{
  const b=E.initial(),before=JSON.stringify(b);const result=searchBestMove(b,{timeMs:0});assert(result.move);assert.equal(result.depth,0);assert(E.legal(b,result.move.f,result.move.t));assert.equal(JSON.stringify(b),before);
});
test('A timed search preserves its input and respects its budget',()=>{
  const b=E.initial(),before=JSON.stringify(b),start=performance.now();const result=searchBestMove(b,{timeMs:100,maxDepth:8});assert(performance.now()-start<1500);assert(E.legal(b,result.move.f,result.move.t));assert.equal(JSON.stringify(b),before);
});
test('No legal moves returns no computer move',()=>{
  const b=setup([[4,0,'k','b'],[3,9,'k','r'],[3,2,'r','r'],[4,2,'r','r'],[5,2,'r','r']]);assert.equal(searchBestMove(b).move,null);
});
console.log(`${count} expert search tests passed.`);
