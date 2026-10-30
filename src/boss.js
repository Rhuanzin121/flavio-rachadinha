export const BOSS_ROW=28,BOSS_EXIT=34,BOSS_MAX_HP=360;
export const attacks=[
 {name:'MARTELADA',line:'A martelada está marcada. Saia da área de impacto!',kind:'hammer'},
 {name:'BLOQUEIO JUDICIAL',line:'Rota interditada. O corredor livre continua aberto.',kind:'wall'},
 {name:'INTIMAÇÃO',line:'Intimações a caminho. Elas seguem, mas não fazem curvas fechadas.',kind:'summons'},
 {name:'DECISÃO MONOCRÁTICA',line:'Regra temporária: passos 30% mais lentos. Leia o tabuleiro!',kind:'shuffle'},
 {name:'BUSCA E APREENSÃO',line:'Mandados em sequência. Não pare no primeiro quadrado!',kind:'search'}
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const bossPhase=hp=>hp>240?1:hp>120?2:3;
export const phaseTiming=phase=>({warning:[1.5,1.25,1.05][phase-1],attack:[1.65,1.9,2.15][phase-1],recovery:[1.65,1.4,1.2][phase-1]});
export function createBossState(){return {active:true,dying:false,defeated:false,hp:BOSS_MAX_HP,maxHp:BOSS_MAX_HP,phase:1,attackPhase:1,stage:'telegraph',elapsed:0,cycleTime:0,cycle:0,index:-1,cells:[],projectiles:[],warning:true,hot:false,vulnerable:false,counterUsed:false,counterHits:0,counterCell:{x:0,row:32},x:0,row:35.3,anchor:{x:0,row:30},velocity:{x:0,row:0},previous:null,hitFlash:0,rewarded:false,defeatTime:0,announcement:'',rule:'',spawned:0,events:[],sequence:0};}
function plan(b,p){
 b.index=b.cycle%5;b.attackPhase=b.phase;b.counterUsed=false;b.spawned=0;b.projectiles=[];
 b.anchor={x:clamp(Math.round(p.x+b.velocity.x*.28),-3,3),row:clamp(Math.round(p.row+b.velocity.row*.28),28,34)};
 b.announcement=attacks[b.index].line;b.rule='';b.events.push('attack:'+b.index);
 const cells=[];const put=(x,row,delay=0)=>{if(x>=-4&&x<=4&&row>=28&&row<=34)cells.push({x,row,delay,hot:false});};
 if(b.index===0){const radius=b.phase===3?2.15:1.65;for(let dx=-2;dx<=2;dx++)for(let dr=-2;dr<=2;dr++)if(Math.hypot(dx,dr)<=radius)put(b.anchor.x+dx,b.anchor.row+dr);}
 if(b.index===1){const columns=b.cycle%2?[-4,-3,-2,-1]:[1,2,3,4];for(let row=28;row<=34;row++)for(const x of columns)put(x,row);}
 if(b.index===3){for(let row=28;row<=34;row++)for(let x=-4;x<=4;x++)if((x+row+b.cycle+20)%4===0)put(x,row);b.rule='PODE CORRER · PASSOS 30% MAIS LENTOS';}
 if(b.index===4){for(let i=0;i<2+b.phase;i++){const row=clamp(b.anchor.row+(i%3)-1,28,34),x=clamp(b.anchor.x+(i%2?2:-2),-3,3);put(x,row,i*.3);put(x+1,row,i*.3);}}
 b.cells=cells;b.sequence++;
}
export function updateBoss(b,dt,p){
 b.events=[];if(b.defeated)return;
 if(b.dying){b.defeatTime+=dt;if(b.defeatTime>=4.8){b.dying=false;b.defeated=true;b.stage='complete';}return;}
 if(!b.active)return;
 b.elapsed+=dt;b.cycleTime+=dt;b.hitFlash=Math.max(0,b.hitFlash-dt);
 b.phase=bossPhase(b.hp);
 if(b.previous&&dt>0){b.velocity.x=clamp((p.x-b.previous.x)/dt,-4,4);b.velocity.row=clamp((p.row-b.previous.row)/dt,-4,4);}b.previous={...p};
 if(b.index<0)plan(b,p);
 const t=phaseTiming(b.attackPhase),end=t.warning+t.attack+t.recovery;
 if(b.cycleTime>=end){b.cycleTime-=end;b.cycle++;plan(b,p);}
 const timing=phaseTiming(b.attackPhase),local=b.cycleTime;
 b.warning=local<timing.warning;b.hot=local>=timing.warning&&local<timing.warning+timing.attack;b.vulnerable=local>=timing.warning+timing.attack;
 const oldStage=b.stage;b.stage=b.warning?'telegraph':b.hot?'attack':'recovery';
 if(oldStage!==b.stage)b.events.push(b.stage);
 // The boss commits after its warning. It cannot instantly track a dodge.
 if(b.warning){const targetX=clamp(p.x+b.velocity.x*.25,-2.8,2.8),targetRow=clamp(p.row+3,33.3,35.5),speed=.55+b.phase*.18;
  b.x+=clamp(targetX-b.x,-dt*speed,dt*speed);b.row+=clamp(targetRow-b.row,-dt*speed*.6,dt*speed*.6);
 }
 for(const cell of b.cells)cell.hot=b.hot&&(b.index!==4||local>=timing.warning+cell.delay&&local<timing.warning+cell.delay+.85);
 if(b.index===2&&b.hot){const count=b.phase+1,active=local-timing.warning;
  while(b.spawned<count&&active>=b.spawned*.43){const x=b.x+(b.spawned%2?.45:-.45),row=b.row-1,angle=Math.atan2(p.row-row,p.x-x);b.projectiles.push({x,row,px:x,pr:row,angle,life:3.5});b.spawned++;b.events.push('projectile');}
 }
 for(const q of b.projectiles){q.px=q.x;q.pr=q.row;const wanted=Math.atan2(p.row-q.row,p.x-q.x),delta=Math.atan2(Math.sin(wanted-q.angle),Math.cos(wanted-q.angle));q.angle+=clamp(delta,-dt*1.55,dt*1.55);const speed=1.7+b.phase*.22;q.x+=Math.cos(q.angle)*speed*dt;q.row+=Math.sin(q.angle)*speed*dt;q.life-=dt;}
 b.projectiles=b.projectiles.filter(q=>q.life>0&&q.x>-5&&q.x<5&&q.row>27&&q.row<36);
 if(b.vulnerable){b.projectiles=[];b.cells=[];b.counterCell={x:clamp(Math.round(b.x),-3,3),row:clamp(Math.floor(b.row-2),30,33)};}
}
export function counterBoss(b,p){
 if(!b?.active||!b.vulnerable||b.counterUsed||Math.hypot(p.x-b.counterCell.x,p.row-b.counterCell.row)>1.35)return false;
 b.counterUsed=true;b.counterHits++;b.hp=Math.max(0,b.hp-45);b.phase=bossPhase(b.hp);b.hitFlash=.4;
 if(b.hp===0){b.active=false;b.dying=true;b.stage='defeat';b.defeatTime=0;b.cells=[];b.projectiles=[];b.hot=false;b.warning=false;b.vulnerable=false;}
 return true;
}
function segmentDistance(x,y,q){const dx=q.x-q.px,dy=q.row-q.pr,len=dx*dx+dy*dy,t=len?clamp(((x-q.px)*dx+(y-q.pr)*dy)/len,0,1):0;return Math.hypot(x-q.px-t*dx,y-q.pr-t*dy);}
export function bossCollision(b,x,row){if(!b?.active)return false;return b.cells.some(c=>c.hot&&Math.abs(c.x-x)<.57&&Math.abs(c.row-row)<.53)||b.projectiles.some(q=>segmentDistance(x,row,q)<.43);}
export function bossBlocks(b,x,row){return !!(b?.active&&b.hot&&[1,3,4].includes(b.index)&&b.cells.some(c=>c.hot&&c.x===x&&c.row===row));}
