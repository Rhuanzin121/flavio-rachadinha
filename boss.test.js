import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBossState,updateBoss,bossCollision,bossBlocks,attacks,BOSS_DURATION,BOSS_EXIT} from './src/boss.js';
const position={x:0,row:28};
for(let i=0;i<5;i++)test(`${attacks[i].name}: aviso, dano e rota de escape`,()=>{
 const b=createBossState();updateBoss(b,i*5.2+.1,position);assert.equal(b.index,i);assert.equal(b.warning,true);assert.equal(b.hot,false);
 const target=b.cells[0];assert.ok(target);assert.equal(bossCollision(b,target.x,target.row),false);
 updateBoss(b,i===4?.8:1.8,position);assert.equal(b.hot,true);assert.equal(bossCollision(b,b.cells[0].x,b.cells[0].row),true);
 const safe=[];for(let row=28;row<=34;row++)for(let x=-4;x<=4;x++)if(!bossCollision(b,x,row))safe.push({x,row});assert.ok(safe.length>=30);
 assert.equal(bossBlocks(b,b.cells[0].x,b.cells[0].row),[0,3,4].includes(i));
});
test('resistência termina mas vitória exige alcançar a saída',()=>{const b=createBossState();updateBoss(b,BOSS_DURATION,position);assert.equal(b.resistance,0);assert.equal(b.active,true);assert.equal(b.cells.length,0);updateBoss(b,.1,{x:0,row:BOSS_EXIT});assert.equal(b.defeated,true);assert.equal(b.active,false);});
test('intimação fica na posição marcada e decisão monocrática muda com aviso',()=>{const b=createBossState();updateBoss(b,10.5,{x:-2,row:31});assert.deepEqual(b.cells,[{x:-2,row:31}]);updateBoss(b,.5,{x:3,row:34});assert.deepEqual(b.cells,[{x:-2,row:31}]);const m=createBossState();updateBoss(m,20.9,position);const before=JSON.stringify(m.cells);updateBoss(m,1.3,position);assert.notEqual(JSON.stringify(m.cells),before);assert.equal(m.warning,true);});
