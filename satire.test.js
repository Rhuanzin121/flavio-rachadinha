import {test} from 'node:test';
import assert from 'node:assert/strict';
import {NoticeGate,chooseSatireEvent,satireEvents,eventProgress,secretAvailable} from './src/satire.js';
import {purchase,upgrades,migrateSave,stats} from './src/rules.js';

test('avisos: canal único, prioridade e nenhuma fala repetida ou atrasada',()=>{
 const gate=new NoticeGate();assert.equal(gate.push('fala','FLÁVIO',0,0),true);
 assert.equal(gate.push('outra fala','FLÁVIO',0,1),false);
 assert.equal(gate.push('saia da área','XANDÃO',3,1),true);
 assert.equal(gate.current.text,'saia da área');
 assert.equal(gate.push('moeda','AVISO',2,2),false);
 assert.equal(gate.tick(5),null); // no stale queue after the warning
 assert.equal(gate.push('fala','FLÁVIO',0,30),false);
 gate.reset();assert.equal(gate.push('fala','FLÁVIO',0,0),true);
});
test('eventos: NPCs distintos, entradas/saídas contínuas',()=>{
 const seen=[];for(let i=0;i<satireEvents.length;i++){const e=chooseSatireEvent(seen,0);assert.ok(e);seen.push(e.id);}
 assert.equal(new Set(seen).size,satireEvents.length);assert.equal(chooseSatireEvent(seen),null);
 assert.ok(satireEvents.every(e=>e.id!=='renan'));
 assert.equal(eventProgress(0),0);assert.equal(eventProgress(.9),1);assert.equal(eventProgress(4.5),1);assert.equal(eventProgress(5.4),0);
 for(let t=0;t<5.4;t+=.04)assert.ok(Math.abs(eventProgress(t+.04)-eventProgress(t))<.05);
});
test('segredo: compra bloqueada antes da descoberta, limite e save compatível',()=>{
 const r={levels:{},money:1000,farthest:0,collected:0};
 assert.equal(purchase(r,'president'),false);assert.equal(r.money,1000);
 r.farthest=12;r.collected=3;assert.equal(secretAvailable(r),true);
 assert.equal(purchase(r,'president'),true);assert.equal(r.presidentPending,true);
 assert.equal(r.money,860);assert.equal(r.levels.president,1);assert.equal(purchase(r,'president'),false);
 const old=migrateSave({best:45,levels:{shoes:2,shield:1},presidentUnlocked:true});
 assert.equal(old.best,45);assert.equal(old.levels.shoes,2);assert.equal(old.levels.president,0);assert.equal(old.presidentUnlocked,true);
 assert.equal(upgrades.find(u=>u.id==='president').max,1);
 assert.equal(stats({president:1}).mitigation,stats({}).mitigation); // no invincibility
});
