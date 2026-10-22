import assert from 'node:assert/strict';
import E from '../src/engine.js';
let count=0;function test(name,fn){fn();count++;console.log('✓ '+name);}
const at=(x,y)=>y*9+x;
function setup(items){const b=Array(90).fill(null);for(const [x,y,t,s] of items)b[at(x,y)]={t,s};return b;}
test('Initial position has 32 pieces and 44 legal red moves',()=>{const b=E.initial();assert.equal(b.filter(Boolean).length,32);assert.equal(E.moves(b,'r').length,44);});
test('Horse leg blocks movement',()=>{const b=E.initial();assert(E.legal(b,at(1,9),at(2,7)));b[at(1,8)]={t:'p',s:'r'};assert(!E.legal(b,at(1,9),at(2,7)));});
test('Elephant cannot cross river or move through blocked eye',()=>{let b=setup([[4,5,'e','r']]);assert(!E.pseudo(b,at(4,5),at(2,3)));b=E.initial();assert(E.pseudo(b,at(2,9),at(4,7)));b[at(3,8)]={t:'p',s:'r'};assert(!E.pseudo(b,at(2,9),at(4,7)));});
test('Cannon needs exactly one screen to capture',()=>{const b=setup([[1,7,'c','r'],[1,0,'h','b']]);assert(!E.pseudo(b,at(1,7),at(1,0)));b[at(1,4)]={t:'p',s:'r'};assert(E.pseudo(b,at(1,7),at(1,0)));b[at(1,3)]={t:'p',s:'b'};assert(!E.pseudo(b,at(1,7),at(1,0)));});
test('Pawns gain sideways movement only after crossing and cannot retreat',()=>{let b=setup([[4,6,'p','r']]);assert(!E.pseudo(b,at(4,6),at(5,6)));assert(!E.pseudo(b,at(4,6),at(4,7)));b=setup([[4,4,'p','r']]);assert(E.pseudo(b,at(4,4),at(5,4)));assert(E.pseudo(b,at(4,4),at(4,3)));});
test('Generals must stay in palace',()=>{const b=setup([[3,9,'k','r']]);assert(!E.pseudo(b,at(3,9),at(2,9)));assert(E.pseudo(b,at(3,9),at(3,8)));});
test('Cannot expose facing generals',()=>{const b=setup([[4,0,'k','b'],[4,9,'k','r'],[4,5,'r','r']]);assert(!E.legal(b,at(4,5),at(3,5)));assert(E.legal(b,at(4,5),at(4,4)));});
test('In check only moves resolving check are legal',()=>{const b=setup([[3,0,'k','b'],[4,9,'k','r'],[4,5,'r','b'],[0,9,'r','r']]);assert(E.check(b,'r'));assert(!E.legal(b,at(0,9),at(0,8)));assert(E.legal(b,at(4,9),at(5,9)));});
test('Checkmate gives no legal moves',()=>{const b=setup([[4,0,'k','b'],[3,9,'k','r'],[3,2,'r','r'],[4,2,'r','r'],[5,2,'r','r']]);assert(E.check(b,'b'));assert.equal(E.moves(b,'b').length,0);});
test('AI returns legal move without mutating position',()=>{const b=E.initial(),copy=JSON.stringify(b);b[at(4,5)]=b[at(4,6)];b[at(4,6)]=null;const before=JSON.stringify(b);for(const depth of [1,2]){const m=E.ai(b,depth);assert(m);assert(E.legal(b,m.f,m.t));assert.equal(JSON.stringify(b),before);}});
test('A simulated game preserves generals and legal positions',()=>{let b=E.initial(),s='r';for(let n=0;n<80;n++){const list=E.moves(b,s);if(!list.length)break;const m=list[(n*17+7)%list.length];b[m.t]=b[m.f];b[m.f]=null;assert(!E.check(b,s));assert.equal(b.filter(p=>p?.t==='k').length,2);s=s==='r'?'b':'r';}});
console.log(`${count} engine tests passed.`);
