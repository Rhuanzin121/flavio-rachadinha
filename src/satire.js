// One message at a time. Chatter never queues behind danger warnings.
export class NoticeGate {
 constructor(){this.reset();}
 reset(){this.current=null;this.seen=new Set();this.lastChatter=-100;this.lastCritical=-100;}
 push(text,name,priority,now){
  this.tick(now);const key=name+':'+text;
  if(priority<3&&(this.seen.has(key)||this.current&&this.current.priority>=priority))return false;
  if(priority<2&&now-this.lastChatter<18)return false;
  if(priority===3&&now-this.lastCritical<.4)return false;
  this.current={text,name,priority,expires:now+(priority===3?3:3.5)};
  if(priority<3)this.seen.add(key);if(priority<2)this.lastChatter=now;else if(priority===3)this.lastCritical=now;
  return true;
 }
 tick(now){if(this.current&&now>=this.current.expires)this.current=null;return this.current;}
}
export const satireEvents=[
 {id:'centrao',name:'CENTRÃO',kind:'parliament',line:'O apoio é amplo. A passagem, nem tanto.',sign:'CENTRÃO\nAPOIO SOB CONSULTA'},
 {id:'eleicoes',name:'ELEIÇÕES',kind:'opposition',line:'Segundo turno da fila: ninguém passou de 50% do caminho.',sign:'ELEIÇÕES\nVOTE NA FAIXA LIVRE'},
 {id:'pt',name:'COMITÊ DO CAFEZINHO',kind:'pt',line:'Nunca antes na história desta calçada houve tanta pauta.',sign:'PT · ASSEMBLEIA\nA PAUTA VIROU FAIXA'}
];
export function chooseSatireEvent(seen,random=Math.random()){
 const available=satireEvents.filter(e=>!seen.includes(e.id));
 return available.length?available[Math.min(available.length-1,Math.max(0,Math.floor(random*available.length)))]:null;
}
export const eventProgress=t=>t<.9?Math.max(0,t/.9):t<=4.5?1:Math.max(0,1-(t-4.5)/.9);
export function secretAvailable(run){return !!(run.secretUnlocked||run.levels?.president||run.farthest>=12&&run.collected>=3);}
