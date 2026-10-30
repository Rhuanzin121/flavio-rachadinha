import {test} from 'node:test';
import assert from 'node:assert/strict';
import {awardProgress,purchase,stageReward,upgrades,cost} from './src/rules.js';
test('recuar e repetir faixas não geram verba',()=>{const r={farthest:0,money:0,earned:0};awardProgress(r,4);awardProgress(r,2);awardProgress(r,4);assert.equal(r.money,8);awardProgress(r,5);assert.equal(r.money,10);});
test('compras respeitam saldo, níveis e efeito real',()=>{const r={money:10000,levels:{},shields:0};for(const u of upgrades){for(let n=0;n<u.max;n++){const before=r.money;assert.equal(purchase(r,u.id),true);assert.equal(r.money,before-cost(u,n));}assert.equal(purchase(r,u.id),false);}assert.equal(r.shields,2);assert.equal(r.equipped,'influence');assert.equal(purchase({money:0,levels:{}},'shoes'),false);});
test('contato aumenta apenas recompensa de etapa em 15% por nível',()=>{assert.equal(stageReward(0,0),70);assert.equal(stageReward(0,2),91);assert.equal(stageReward(4,3),218);});
