export const stages=['Brasília · Três Poderes','Centro · a pauta é a rua','STF · o julgamento final','BR-040 · o pedágio da fuga','Aeroporto · portão 171'];
export const upgrades=[
 {id:'shoes',name:'Tênis de fuga',category:'Mobilidade',icon:'shoe',tag:'PASSIVO',desc:'A comissão aprovou a sola. A explicação continua pendente.',price:42,max:5},
 {id:'passport',name:'Passaporte premium',category:'Mobilidade',icon:'passport',tag:'CARGAS',desc:'O carimbo que conhece a porta lateral do protocolo.',price:60,max:5},
 {id:'driver',name:'Motorista particular',category:'Mobilidade',icon:'car',tag:'ATIVA + PASSIVA',desc:'Avance três casas. Às vezes, o motorista ainda desvia da pergunta.',price:80,max:5},
 {id:'dodge',name:'Desvio estratégico',category:'Mobilidade',icon:'arrow',tag:'ATIVA',desc:'Encaminhe seu corpo para outra comissão: salto de duas casas.',price:48,max:5},
 {id:'shield',name:'Blindagem jurídica',category:'Proteção',icon:'shield',tag:'REDUÇÃO + CARGAS',desc:'Embargos acolchoados: até duas proteções, depois redução de dano.',price:58,max:5},
 {id:'foro',name:'Foro privilegiado',category:'Proteção',icon:'scales',tag:'ESQUIVA PASSIVA',desc:'Uma pequena chance de o ataque descobrir que era outro gabinete.',price:54,max:5},
 {id:'habeas',name:'Habeas corpus',category:'Proteção',icon:'heart',tag:'SEGUNDA CHANCE',desc:'O último recurso chega antes da tela de derrota. Precisa recarregar.',price:90,max:5},
 {id:'contact',name:'Contato privilegiado',category:'Recursos',icon:'coin',tag:'BÔNUS DE VERBA',desc:'O amigo do amigo agora também conhece o cofre das moedas.',price:46,max:5},
 {id:'influence',name:'Influência política',category:'Recursos',icon:'seal',tag:'DESCONTO + ATIVA',desc:'Uma ligação reduz os preços; uma CPI desacelera a rua.',price:68,max:5},
 {id:'caixa',name:'Caixa dois',category:'Recursos',icon:'case',tag:'RISCO / RECOMPENSA',desc:'Rende mais verba. A PF achou o extrato e mandou uma equipe extra.',price:50,max:5}
];
export const curve=(level,first,decay=.7)=>{let sum=0;for(let i=0;i<Math.max(0,Math.min(5,level||0));i++)sum+=first*decay**i;return sum;};
export function stats(levels={}){const l=id=>Math.max(0,Math.min(5,Number(levels[id])||0));return {
 speed:1+curve(l('shoes'),.14),mitigation:curve(l('shield'),.12),shieldCharges:Math.min(2,l('shield')),
 passportCharges:l('passport')?1+Math.floor((l('passport')-1)/2):0,
 driverChance:curve(l('driver'),.08),foroChance:curve(l('foro'),.075),
 driverCooldown:14-curve(Math.max(0,l('driver')-1),1.3),dodgeCooldown:8-curve(Math.max(0,l('dodge')-1),.7),
 dodgeInv:.6+curve(Math.max(0,l('dodge')-1),.08),
 habeasCooldown:l('habeas')?70-curve(l('habeas')-1,12):0,habeasHp:l('habeas')?30+curve(l('habeas')-1,6):0,
 coinBonus:curve(l('contact'),.15),rewardBonus:curve(l('contact'),.15),discount:curve(l('influence'),.09),
 slowDuration:4+curve(Math.max(0,l('influence')-1),.4),caixaBonus:curve(l('caixa'),.18),risk:l('caixa')
};}
export const cost=(u,level,levels={})=>Math.max(1,Math.round(u.price*1.55**level*(1-stats(levels).discount)));
export const stageReward=(stage,contact=0,caixa=0)=>Math.round((90+stage*25)*(1+curve(contact,.15)+curve(caixa,.18)));
export const coinReward=levels=>Math.round(10*(1+stats(levels).coinBonus+stats(levels).caixaBonus));
export function upgradeSummary(id,level){const s=stats({[id]:level}),pct=n=>Math.round(n*100)+'%';if(!level)return 'Sem melhoria';return {
 shoes:`+${pct(s.speed-1)} velocidade`,passport:`${s.passportCharges} barreira(s) por partida`,
 driver:`3 casas / ${s.driverCooldown.toFixed(1)} s · ${pct(s.driverChance)} esquiva`,dodge:`2 casas / ${s.dodgeCooldown.toFixed(1)} s · ${s.dodgeInv.toFixed(2)} s proteção`,
 shield:`${s.shieldCharges} cargas · −${pct(s.mitigation)} dano`,foro:`${pct(s.foroChance)} de evitar dano`,
 habeas:`Volta com ${Math.round(s.habeasHp)} HP / ${Math.round(s.habeasCooldown)} s`,
 contact:`+${pct(s.coinBonus)} moedas e etapas`,influence:`−${pct(s.discount)} preços · lentidão ${s.slowDuration.toFixed(1)} s`,
 caixa:`+${pct(s.caixaBonus)} verbas · fiscalização extra ${level}/5`
 }[id];}
export function awardProgress(run,row){if(row<=run.farthest)return 0;const d=row-run.farthest;run.farthest=row;run.money+=d*2;run.earned+=d*2;return d*2;}
export function purchase(run,id){const u=upgrades.find(x=>x.id===id);if(!u)return false;const level=run.levels[id]||0,p=cost(u,level,run.levels);if(level>=u.max||run.money<p)return false;run.money-=p;run.levels[id]=level+1;if(id==='shield')run.shields=Math.min(2,(run.shields||0)+1);if(id==='passport'){run.passports=(run.passports||0)+1;run.passport=true;}if(['dodge','driver','influence'].includes(id))run.equipped=id;return true;}
export function applyDamage(run,amount,roll=Math.random()){
 const s=stats(run.levels);run.hp??=100;run.habeasCd??=0;
 if(roll<s.foroChance)return {type:'foro',damage:0};
 if(roll< s.foroChance+(1-s.foroChance)*s.driverChance)return {type:'driver',damage:0};
 if(run.shields>0){run.shields--;return {type:'shield',damage:0};}
 const damage=Math.max(1,Math.round(amount*(1-s.mitigation)));run.hp=Math.max(0,run.hp-damage);
 if(run.hp===0&&run.levels.habeas&&run.habeasCd<=0){run.hp=Math.round(s.habeasHp);run.habeasCd=s.habeasCooldown;return {type:'habeas',damage};}
 return {type:run.hp<=0?'fatal':'hit',damage};
}
export function migrateSave(raw={}){const out={...raw,schema:3,levels:{}};for(const u of upgrades)out.levels[u.id]=Math.max(0,Math.min(u.max,Math.floor(Number(raw.levels?.[u.id])||0)));out.musicVolume=Math.max(0,Math.min(1,Number.isFinite(raw.musicVolume)?raw.musicVolume:.28));out.effectsVolume=Math.max(0,Math.min(1,Number.isFinite(raw.effectsVolume)?raw.effectsVolume:.6));out.sound=raw.sound!==false;return out;}
