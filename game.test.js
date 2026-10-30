import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as Three from 'three';
import * as rules from './src/rules.js';
import * as bossRules from './src/boss.js';
import {ArcadeAudio} from './src/audio.js';
import {upgradeIcon} from './src/icons.js';

// Runs the actual game code with real Three.js geometry and a headless renderer.
// Rendering/input are verified separately in the browser.
function boot(){
 const storage=new Map(),nodes=new Map();
 const node=()=>({hidden:false,innerHTML:'',textContent:'',className:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){}});
 const document={querySelector(s){if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);},querySelectorAll(){return [];},addEventListener(){},body:node(),createElement(){return {width:0,height:0,getContext(){return {fillRect(){},fillText(){}};}};}};
 class Renderer{constructor(){this.shadowMap={};this.info={render:{}};}setPixelRatio(){}setSize(){}setClearColor(){}render(){}}
 // Art uses the injected document in its module scope, just like the browser.
 const artSource=readFileSync(new URL('./src/art.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'').replace('export function createArt','function createArt');
 const c=vm.createContext({...rules,...bossRules,ArcadeAudio,upgradeIcon,T:{...Three,WebGLRenderer:Renderer},document,window:{addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},innerWidth:1280,innerHeight:720,devicePixelRatio:1,matchMedia:()=>({matches:false}),performance:{now:()=>0},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},console});
 vm.runInContext(readFileSync(new URL('./src/sculpt.js',import.meta.url),'utf8').replace('export function sculptFlavio','function sculptFlavio'),c);
 vm.runInContext(artSource,c);
 const source=readFileSync(new URL('./src/main.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
 vm.runInContext(source,c);let time=0;
 return {get:s=>vm.runInContext(s,c),tick(n=8){for(let i=0;i<n;i++){time+=40;vm.runInContext(`animate(${time})`,c);}}};
}
test('HP, proteção de uma carga, pausa e reinício',()=>{const g=boot();g.get('start(); inv=0; damage("teste",false,140)');assert.equal(g.get('mode'),'over');g.get('start(); run.shields=1; inv=0; damage("teste")');assert.equal(g.get('run.shields'),0);assert.equal(g.get('run.hp'),100);g.get('pause()');const elapsed=g.get('run.elapsed');g.tick(20);assert.equal(g.get('run.elapsed'),elapsed);g.get('resume(); inv=0; damage("teste",false,140)');assert.equal(g.get('mode'),'over');g.get('start()');assert.equal(g.get('run.farthest'),0);assert.equal(g.get('run.hp'),100);});
test('colisão espacial real e moeda coletada somente uma vez',()=>{const g=boot();g.get('start(); inv=0; run.row=1; player.position.set(lanes[1].items[0].g.position.x,0,-1.55)');g.tick(1);assert.equal(g.get('run.hp'),52);assert.equal(g.get('mode'),'play');g.get('start(); inv=1000; run.x=3; player.position.x=3*1.45; move(0,1)');g.tick();assert.equal(g.get('run.collected'),1);assert.equal(g.get('run.money'),12);g.get('move(0,-1)');g.tick();g.get('move(0,1)');g.tick();assert.equal(g.get('run.money'),12);});
test('influência aplica duração e recarga; barreira alterna previsivelmente',()=>{const g=boot();g.get('start(); run.equipped="influence"; ability()');assert.equal(g.get('slow'),4);assert.equal(g.get('cooldown'),16);g.get('ability()');assert.equal(g.get('run.used'),1);g.tick(110);assert.equal(g.get('slow'),0);assert.ok(g.get('cooldown')>11);g.get('clock=-lanes[5].phase');assert.equal(g.get('gateOpen(lanes[5])'),false);g.get('clock+=3');assert.equal(g.get('gateOpen(lanes[5])'),true);});
test('cinco etapas, loja, habilidades, checkpoint e embarque',()=>{const g=boot();g.get('start(); inv=1000');
 for(let stage=0;stage<5;stage++){
  for(let row=stage*12;row<(stage+1)*12;row++){g.get('inv=1000; move(0,1)');g.tick();if(g.get('mode')==='bossIntro'){g.get('resume(); inv=10000');for(let i=0;i<1800&&g.get('bossState.hp')>0;i++){g.tick(1);if(g.get('bossState.vulnerable&&!bossState.counterUsed'))g.get('run.x=bossState.counterCell.x;run.row=bossState.counterCell.row;player.position.set(run.x*1.45,0,-run.row*1.55);hop=null;counterAttack()');}assert.equal(g.get('bossState.hp'),0);g.tick(130);assert.equal(g.get('mode'),'bossVictory');g.get('run.row=28;run.x=0;player.position.set(0,0,-28*1.55);resume();inv=1000');}}
  if(stage<4){assert.equal(g.get('mode'),'shop');assert.equal(g.get('run.row'),(stage+1)*12);
   if(stage===0){assert.ok(g.get('run.money')>=90);assert.equal(g.get('purchase(run,"driver")'),true);assert.equal(g.get('run.equipped'),'driver');}
   g.get('stage++; resume(); inv=1000');
  }
 }
 assert.equal(g.get('mode'),'boarding');g.tick(210);assert.equal(g.get('mode'),'win');assert.equal(g.get('saved.wins'),1);assert.equal(g.get('saved.best'),60);assert.ok(g.get('run.earned')>=600);
 g.get('start(); run.levels.driver=1; run.equipped="driver"; run.row=11; run.farthest=11; player.position.z=-11*1.55; inv=1000; ability()');g.tick();assert.equal(g.get('run.row'),12);assert.equal(g.get('mode'),'shop');assert.ok(g.get('cooldown')>0);
});
test('arena limita movimento, pausa congela ataques e recompensa é única',()=>{const g=boot();g.get('start(); stage=2; run.row=28; run.farthest=28; run.x=5; player.position.set(7.25,0,-28*1.55); beginBoss()');assert.equal(g.get('mode'),'bossIntro');assert.equal(g.get('run.x'),4);g.get('resume(); inv=1000; move(0,-1)');assert.equal(g.get('hop'),null);g.get('pause()');g.tick(80);assert.equal(g.get('bossState.elapsed'),0);g.get('resume(); inv=1000');g.tick(20);assert.ok(g.get('bossState.elapsed')>0);g.get('bossState.active=false; bossState.defeated=true; bossWon()');assert.equal(g.get('run.money'),180);g.get('bossWon()');assert.equal(g.get('run.money'),180);});
test('treino não concede verba, recorde ou progresso persistente',()=>{const g=boot();g.get('practiceBoss()');assert.equal(g.get('mode'),'bossIntro');g.get('resume(); bossState.active=false; bossState.defeated=true; bossWon()');assert.equal(g.get('mode'),'bossVictory');assert.equal(g.get('run.money'),0);assert.equal(g.get('saved.best'),0);assert.equal(g.get('saved.wins'),0);g.get('showEpilogue()');g.tick(210);assert.equal(g.get('mode'),'win');assert.equal(g.get('saved.wins'),0);g.get('practiceBoss(); resume(); inv=0; damage("treino",false,140)');assert.equal(g.get('saved.best'),0);});
test('perseguição PF termina e respeita limite de distância da faixa',()=>{const g=boot();g.get('start(); inv=1000; run.row=8; player.position.set(-6,0,-8*1.55)');g.tick(1);assert.ok(g.get('lanes[8].items[0].chase')>2);g.get('player.position.z-=6');g.tick(60);assert.equal(g.get('lanes[8].items[0].chase'),0);assert.equal(g.get('lanes[8].items[0].chaseUsed'),true);assert.ok(g.get('Math.abs(lanes[8].items[0].g.position.z-lanes[8].items[0].homeZ)')<=2.4);});
