import {sculptFlavio} from './sculpt.js';
// All characters, symbols and architecture are original procedural geometry.
export function createArt(T){
 const palette=new Map();
 function material(c){if(!palette.has(c))palette.set(c,new T.MeshStandardMaterial({color:c,roughness:.78,flatShading:true}));return palette.get(c);}
 function mesh(geo,c,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,material(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const cub=(p,c,x,y,z,w,h,d)=>mesh(new T.BoxGeometry(w,h,d),c,p,x,y,z);
 function ell(p,c,x,y,z,sx,sy,sz){const m=mesh(new T.SphereGeometry(1,12,10),c,p,x,y,z);m.scale.set(sx,sy,sz);return m;}
 function cyl(p,c,x,y,z,rt,rb,h,n=12){return mesh(new T.CylinderGeometry(rt,rb,h,n),c,p,x,y,z);}
 function stroke(p,c,points,r=.018){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),12,r,5,false),c,p);}
 function text(parent,words,x,y,z,w=3,h=.7,bg='#184738',fg='#fff6df'){
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,1024,256);ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';const lines=words.split('\n');ctx.font=`900 ${Math.min(100,Math.floor(1500/Math.max(...lines.map(l=>l.length))))}px Arial`;lines.forEach((l,i)=>ctx.fillText(l,512,128+(i-(lines.length-1)/2)*100,980));const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));m.position.set(x,y,z);m.userData.ownedMaterial=true;parent.add(m);return m;
 }
 function star(parent,x,y,z,size=.2,color='#ffffff'){
  const shape=new T.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?size*.42:size;const xx=Math.cos(a)*r,yy=Math.sin(a)*r;i?shape.lineTo(xx,yy):shape.moveTo(xx,yy);}shape.closePath();return mesh(new T.ShapeGeometry(shape),color,parent,x,y,z);
 }
 function hammerSickle(parent,x,y,z,size=.35){
  const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(size);parent.add(g);
  const pts=[];for(let i=0;i<=16;i++){const a=-.4+i/16*Math.PI*1.48;pts.push([Math.cos(a)*.8,Math.sin(a)*.8,0]);}stroke(g,'#ffe46a',pts,.13);const a=cub(g,'#ffe46a',0,-.1,.03,.17,1.65,.08);a.rotation.z=-.72;const b=cub(g,'#ffe46a',-.45,.5,.03,.85,.28,.09);b.rotation.z=-.72;
 }
 function flag(parent,kind='pt',variant=0){const g=new T.Group();parent.add(g);cyl(g,'#d3c7a1',0,1.1,0,.025,.035,2.2,6);const f=new T.Group();f.position.set(.03,1.8,0);g.add(f);const cloth=cub(f,kind==='opposition'?'#e5bb40':'#b91c2e',.46,0,0,.94,.65,.035);if(kind==='pt'){star(f,.36,.02,.025,.22);text(f,'PT',.7,-.13,.03,.28,.2,'#b91c2e');}else if(kind==='communist')hammerSickle(f,.46,0,.04,.29);else text(f,'CADÊ\nA PAUTA?',.46,0,.025,.88,.56,'#e5bb40','#163d35');g.userData.fabric=f;g.userData.phase=variant;return g;}
 function character(kind='flavio',variant=0){
  const root=new T.Group(),rig=new T.Group();root.add(rig);
  const skin=kind==='flavio'?'#dca482':kind==='xandao'?'#c99579':kind==='lula'?'#d5a281':['#e1b18e','#ad7655','#724c3b','#c19173'][variant%4];
  const suit=['flavio','xandao','lula','parliament'].includes(kind);
  const colors={renan:'#252a32',flavio:'#20354d',xandao:'#1b1d29',lula:'#324456',pt:['#c82f3e','#e54c45'][variant%2],communist:['#9e2235','#b83b38','#764f3e'][variant%3],pf:'#253d36',press:'#c19b67',opposition:'#c9b14c',parliament:['#52637d','#78655d','#3e5d58'][variant%3]};
  const color=colors[kind]||'#386c67';
  const body=cyl(rig,color,0,1.03,0,.3,.4,.82,10);body.scale.z=.66;
  ell(rig,color,0,1.35,0,.4,.16,.25);
  if(suit){const shirt=cub(rig,'#eee9dc',0,1.25,.21,.28,.36,.07);const tie=cub(rig,kind==='flavio'?'#86b5ce':kind==='lula'?'#c65963':'#555b74',0,1.18,.27,.09,.35,.05);tie.rotation.z=.08;for(const s of [-1,1]){const lapel=cub(rig,kind==='flavio'?'#3a5069':color,s*.15,1.22,.25,.13,.4,.06);lapel.rotation.z=s*-.3;}cub(rig,'#d5b55a',-.24,1.35,.27,.045,.035,.025);}
  else if(kind==='pt')star(rig,0,1.14,.225,.13);
  else if(kind==='communist')hammerSickle(rig,0,1.13,.245,.15);
  else if(kind==='pf'){text(rig,'POLÍCIA\nFEDERAL',0,1.12,.24,.47,.32,'#253d36','#f5cf67');cub(rig,'#1b2826',0,.8,.22,.6,.1,.12);}
  else if(kind==='press')text(rig,'AO VIVO',0,1.12,.24,.45,.2,'#b02d38');
  const legs=[],arms=[];
  for(const side of [-1,1]){
   const leg=new T.Group();leg.position.set(side*.17,.68,0);rig.add(leg);cyl(leg,suit?'#202d40':'#3f4950',0,-.24,0,.105,.09,.48,8);ell(leg,'#19282c',0,-.55,.07,.13,.1,.24);legs.push(leg);
   const arm=new T.Group();arm.position.set(side*.38,1.36,0);rig.add(arm);cyl(arm,color,0,-.22,0,.105,.075,.46,8);const fore=new T.Group();fore.position.set(0,-.43,0);arm.add(fore);fore.rotation.x=-.3;cyl(fore,color,0,-.12,0,.075,.07,.24,8);ell(fore,skin,0,-.29,0,.09,.12,.09);arms.push(arm);
  }
  cyl(rig,skin,0,1.54,0,.13,.14,.22);
  const head=new T.Group();head.position.y=1.98;rig.add(head);
  let pupils=[],brows=[],mouth;const worried=kind==='flavio';
  if(worried){const sculpt=sculptFlavio(T,head);pupils=sculpt.pupils;brows=sculpt.brows;mouth=sculpt.mouth;root.userData.sweat=sculpt.sweat;root.userData.sculpted=true;}else{
  ell(head,skin,0,.02,0,kind==='flavio'?.43:.4,kind==='xandao'?.59:.51,.36);
  ell(head,skin,0,-.22,.16,kind==='flavio'?.33:.3,.26,.25);
  ell(head,skin,-.42,0,0,.085,.14,.09);ell(head,skin,.42,0,0,.085,.14,.09);
  ell(head,'#cd9272',0,-.06,.37,.12,.15,.16);ell(head,skin,0,-.005,.38,.09,.18,.11);
  pupils=[];brows=[];
  for(const side of [-1,1]){
   const eye=ell(head,'#fff9e9',side*.18,.09,.305,.115,.09,.055);
   const pupil=ell(head,'#323c32',side*.18,.09,.36,.045,.055,.022);pupils.push(pupil);
   ell(pupil,'#171e23',0,0,.8,.55,.67,.6);
   ell(pupil,'#ffffff',.2,.35,.8,.16,.15,.3);
   const brow=cub(head,kind==='lula'?'#d8d5c8':'#3a2d28',side*.18,.24,.32,.24,.045,.06);brow.rotation.z=side*(kind==='xandao'?.22:kind==='flavio'?-.23:.04);brows.push(brow);
   stroke(head,'#bd856a',[[side*.09,.025,.35],[side*.18,-.015,.36],[side*.26,.025,.32]],.009);
  }
  mouth=stroke(head,kind==='lula'?'#704536':'#854e44',[[-.16,-.27,.35],[0,worried?-.23:kind==='xandao'?-.27:-.3,.405],[.16,-.27,.35]],.02);
  if(kind!=='xandao'){
   const hair=kind==='lula'?'#e0ddd0':variant%3===2&&kind!=='flavio'?'#433128':'#372923';
   const cap=mesh(new T.SphereGeometry(1,12,8,0,Math.PI*2,0,Math.PI*.5),hair,head,0,.23,-.035);cap.scale.set(.45,.34,.36);
   for(const side of [-1,1])ell(head,hair,side*.37,.14,-.07,.09,.25,.25);
   if(kind==='lula'){ell(head,'#d9d6cb',0,-.25,.24,.35,.24,.2);ell(head,'#e6e0d4',0,-.15,.365,.23,.065,.07);ell(head,skin,0,-.23,.435,.14,.045,.035);const sash=cub(rig,'#318459',.04,1.1,.29,.13,.69,.045);sash.rotation.z=-.66;const border=cub(rig,'#eed160',.11,1.1,.31,.035,.69,.025);border.rotation.z=-.66;}
  }else{
   const robe=cyl(rig,'#161924',0,.93,-.08,.4,.63,1.35,14);robe.scale.z=.72;robe.material=robe.material.clone();robe.userData.ownedMaterial=true;root.userData.robe=robe;
   for(const s of [-1,1]){const trim=cub(rig,'#69343d',s*.17,1.18,.29,.035,.66,.04);trim.rotation.z=s*-.12;}
   ell(head,'#d3a486',0,.41,.06,.24,.09,.19);brows.forEach((b,i)=>b.rotation.z=i?.3:-.3);for(const side of [-1,1])ell(head,skin,side*.18,.16,.34,.13,.04,.045);
   const hammer=new T.Group();hammer.position.set(.12,-.44,.12);hammer.rotation.z=-.55;hammer.scale.setScalar(1.6);arms[1].add(hammer);cyl(hammer,'#977044',0,.2,0,.06,.07,.75,8);const h=cyl(hammer,'#c59a54',0,.6,0,.17,.17,.65,10);h.rotation.z=Math.PI/2;for(const s of [-1,1]){const rim=cyl(hammer,'#f4d077',s*.3,.6,0,.19,.19,.05,10);rim.rotation.z=Math.PI/2;}root.userData.hammer=hammer;
  }
  if(['pt','communist','opposition'].includes(kind)){
   const f=flag(arms[1],kind,variant);f.position.set(0,-.45,0);f.scale.setScalar(.8);root.userData.flag=f;
   if(variant%3===1){const sign=new T.Group();arms[0].add(sign);cyl(sign,'#a7885d',0,-.1,0,.025,.025,1.6,6);text(sign,kind==='communist'?'SOCIALIZAR\nA FILA':'CADÊ A\nTRANSPARÊNCIA?',0,.8,.04,1.25,.65,kind==='communist'?'#b42b35':'#fff0d3',kind==='communist'?'#ffe89d':'#a82032');}
   if(variant%4===2){const beret=ell(head,kind==='communist'?'#303d34':'#af1f30',0,.48,0,.45,.1,.34);beret.rotation.z=.14;}
  }
  if(kind==='renan'){text(rig,'RENAN',0,1.16,.245,.45,.18,'#252a32','#e9e4cc');for(const side of [-1,1])stroke(head,'#41332b',[[side*.34,-.12,.2],[side*.26,-.32,.3],[side*.08,-.39,.31]],.032);}
  if(kind==='pf'){const cap=ell(head,'#203b32',0,.46,0,.44,.14,.34);cub(head,'#1a3029',0,.38,.31,.46,.04,.3);text(head,'PF',0,.47,.315,.25,.17,'#203b32','#f6d773');}
  if(kind==='press'){const cam=cub(arms[1],'#273c43',0,-.43,.25,.32,.25,.4);const lens=cyl(arms[1],'#648f9a',0,-.43,.5,.1,.12,.16);lens.rotation.x=Math.PI/2;const mic=cyl(arms[0],'#20292f',0,-.42,.2,.035,.035,.4);mic.rotation.x=-.8;ell(arms[0],'#3e5360',0,-.3,.34,.1,.1,.11);}
  }
  root.userData={...root.userData,kind,rig,head,legs,arms,pupils,brows,mouth,phase:variant*1.7};return root;
 }
 function animateCharacter(g,time,moving=false,look=0,alarm=0,action='idle'){const d=g.userData;if(!d.rig)return;const phase=time*(d.kind==='flavio'?17:10)+d.phase;d.legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(phase+i*Math.PI)*.65:0);d.arms.forEach((a,i)=>{a.rotation.x=moving?Math.sin(phase+i*Math.PI+Math.PI)*.8:-.06;a.rotation.z=(i?-.12:.12)*(1+alarm*2);});d.rig.position.y=moving?Math.abs(Math.sin(phase))*.055:Math.sin(time*2+d.phase)*.018;d.rig.rotation.x=moving&&d.kind==='flavio'?.12:0;d.head.rotation.y=T.MathUtils.lerp(d.head.rotation.y,look*.25,.15);d.head.rotation.z=Math.sin(time*5)*alarm*.09;d.pupils.forEach((p,i)=>{p.position.x=(i?1:-1)*(d.sculpted?.185:.18)+look*(d.sculpted?.012:.025);p.scale.y=(d.sculpted?.029:.055)*(1+alarm*.22);});if(d.sweat)d.sweat.visible=alarm>.1;d.brows.forEach((b,i)=>b.position.y=.24+alarm*.045);if(d.flag)d.flag.userData.fabric.rotation.y=Math.sin(time*4+d.phase)*.2;
  if(d.action!==action){d.action=action;d.actionSince=time;}const t=Math.max(0,time-d.actionSince);
  if(d.sculpted){d.rig.rotation.z=0;d.rig.rotation.x=moving?.24:0;d.head.rotation.x=moving?-.08:0;
   if(action==='hit'){d.rig.rotation.z=Math.sin(t*45)*.16;d.head.rotation.x=-.16;}
   if(action==='celebrate'){d.arms.forEach((a,i)=>{a.rotation.x=-2.5;a.rotation.z=(i?-.5:.5);});d.rig.position.y=Math.abs(Math.sin(t*8))*.2;d.head.rotation.z=Math.sin(t*5)*.08;}
   if(action==='defeat'){const f=Math.min(1,t/1.1);d.rig.rotation.z=-f*1.35;d.rig.position.y=-f*.3;d.arms[0].rotation.x=-1.3;d.head.rotation.z=-f*.25;}
  }
 }

 function tent(parent,x,z,kind){const g=new T.Group();g.position.set(x,0,z);parent.add(g);for(const a of [-1,1])for(const b of [-1,1])cyl(g,'#d8ceaf',a*.8,.9,b*.65,.025,.025,1.8,6);const roof=mesh(new T.ConeGeometry(1.55,.65,4),kind==='communist'?'#a82736':'#cb3442',g,0,2,0);roof.rotation.y=Math.PI/4;text(g,kind==='communist'?'COMITÊ DO\nCAFÉ COLETIVO':'PT · BARRACA\nDA MOBILIZAÇÃO',0,1.65,.74,1.8,.5,'#ad2335');if(kind==='communist')hammerSickle(g,0,2.12,.7,.22);else star(g,0,2.13,.7,.23);}
 function scenery(parent){
  // Esplanada: repeated slabs, pilotis, reflecting pool and the two Congress bowls.
  const congress=new T.Group();congress.position.set(-12,0,-9);parent.add(congress);cub(congress,'#e8dfc4',0,.15,0,9,.4,5);for(const x of [-.6,.6]){cub(congress,'#d2ded7',x,3.8,-1, .85,7,1.1);for(let y=1;y<7;y+=.45)cub(congress,'#6e9c9d',x,y,-.43,.62,.17,.02);}for(const side of [-1,1]){const bowl=mesh(new T.SphereGeometry(1,24,10,0,Math.PI*2,0,Math.PI/2),'#efe8d5',congress,side*2.6,.65,1);bowl.scale.set(1.7,.8,1.7);if(side===1)bowl.rotation.x=Math.PI;}text(congress,'CONGRESSO NACIONAL',0,.6,2.55,7,.6,'#174738');cub(parent,'#64a6ab',-10,-.03,-3,4,.07,2.5);
  for(let r=0;r<12;r+=3)for(const side of [-1,1]){const z=-r*1.55,x=side*11;const b=new T.Group();parent.add(b);b.position.set(x,0,z-13);cub(b,'#d3d7bf',0,1.8,0,2.5,3.2,1.4);for(let col=-1;col<=1;col++)cub(b,'#7f9f9d',col*.65,1.9,.72,.4,2.6,.025);for(let col=-1;col<=1;col++)cyl(b,'#e9e5ca',col, .4,.85,.05,.05,1.1,8);}
  text(parent,'BRASÍLIA · PRAÇA\nDOS TRÊS PODERES',8,1.6,-3,4.3,1,'#206154');
  const parliament=[];for(let i=0;i<4;i++){const n=character('parliament',i);n.position.set(-8.7+i*.6,0,-13-i*.25);n.userData.baseX=n.position.x;n.userData.neutral=true;n.scale.setScalar(.62);n.rotation.y=.5;parent.add(n);parliament.push(n);}
  for(let i=0;i<5;i++){tent(parent,i%2?-9:9,-22-i*2.2,i%2?'communist':'pt');const f=flag(parent,i%2?'communist':'pt',i);f.position.set(i%2?-7.8:7.8,0,-21-i*2.2);f.scale.setScalar(1.3);}
  text(parent,'CENTRAL DOS\nCARIMBOS REVOLUCIONÁRIOS',-9,3,-29,4,1,'#b02d38');text(parent,'PT · A PAUTA É\nNÃO DEIXAR PASSAR',9,3,-24,4,1,'#b02d38');
  // Lula is a neutral cameo on a podium, outside the collision lanes.
  const lula=character('lula');lula.position.set(9, .65,-28);lula.scale.setScalar(1.3);parent.add(lula);cub(parent,'#235648',9,.3,-28,2.8,.6,2.2);text(parent,'LULA · PALANQUE\nINAUGURAÇÃO DA FILA',9,.8,-26.8,3.1,.7,'#a92b35');lula.userData.neutral=true;
  // Institutional hall and STF's slender white columns.
  for(const x of [-10,10]){cub(parent,'#c9d4cf',x,.1,-47,4,.3,15);cub(parent,'#e8dfcb',x,4.5,-47,4,.3,15);for(let z=-40;z>=-54;z-=2.4){const c=cyl(parent,'#efe5d0',x+(x<0?1.6:-1.6),2.2,z,.12,.2,4.4);c.rotation.z=x<0?-.12:.12;}cub(parent,'#658c8e',x-1,2.3,-54.5,2,3.8,.14);}
  text(parent,'SUPREMO TRIBUNAL\nFEDERAL',-10,4.8,-52.8,4,1,'#182c3b');text(parent,'PROTOCOLO:\nA PACIÊNCIA É OBRIGATÓRIA',-9,2,-39,3.8,1,'#263e4d');
  // Road: toll gate, orange cones, kilometre plates and a parked semi-trailer.
  const toll=new T.Group();toll.position.z=-61;parent.add(toll);for(const x of [-8.1,8.1])cub(toll,'#b1b8a5',x,2.3,0,.45,4.6,.6);cub(toll,'#276955',0,4.6,0,17,.65,1.6);text(toll,'PEDÁGIO · ACEITAMOS RECURSOS',0,4.6,.82,12,.6,'#1e5a47');for(const x of [-6,0,6]){cub(toll,'#d7c79e',x,.7,-1,.8,1.4,.8);text(toll,'LIVRE',x,3.7,.2,1.3,.4,'#2b7951');}
  for(let i=0;i<9;i++){const cone=mesh(new T.ConeGeometry(.18,.55,8),'#e48a3d',parent,(i%2?-1:1)*8.1,.23,-57-i*2.8);cyl(parent,'#f5e5c5',cone.position.x,.22,cone.position.z,.12,.15,.1,8);}
  cub(parent,'#d8d5b9',11,1.2,-65,2,2.2,6);cub(parent,'#b8523c',11,.8,-61.6,2,1.6,1.4);text(parent,'BR-040\nAEROPORTO →',-9,2.2,-66,3.3,1,'#1e6149');
  // Terminal includes a full scanner and animated baggage belts, all procedural.
  cub(parent,'#c4d4d2',-10,2.2,-85,4,4.4,15);for(let z=-78;z>-91;z-=2)cub(parent,'#6b9caa',-7.95,2.5,z,.05,2.7,1.3);text(parent,'TERMINAL INTERNACIONAL',0,4.8,-84,13,.9,'#263b54');
  for(const x of [-9,9]){cub(parent,'#d5dad3',x-1,1.25,-84,.22,2.5,1);cub(parent,'#d5dad3',x+1,1.25,-84,.22,2.5,1);cub(parent,'#d5dad3',x,2.5,-84,2.2,.25,1);text(parent,'RAIO-X',x,2.5,-83.45,1.7,.3,'#22475a');cub(parent,'#284044',x,.6,-84,1.6,.18,4);for(let i=0;i<3;i++){const bag=cub(parent,['#caa44e','#a75f47','#537f87'][i],x,.95,-82.8-i, .6,.6,.45);bag.userData.baggage=true;bag.userData.startZ=bag.position.z;}}
  text(parent,'PORTÃO 171\nÚLTIMA CHAMADA',7,2,-91,4,1,'#223a51');text(parent,'RETIRE OS SAPATOS.\nAS EXPLICAÇÕES TAMBÉM.',-9,2,-89,3.4,1,'#263b54');
  text(parent,'CENTRÃO · APOIO\nSOB CONSULTA',9,2.1,-17,3.3,.8,'#785e3e');
  text(parent,'ELEIÇÕES · SEGUNDO\nTURNO DA FILA',-9,2.4,-24,3.1,.8,'#275751');
  const urna=new T.Group();urna.position.set(9,.05,-20);parent.add(urna);cub(urna,'#e6e0ca',0,.65,0,1.4,1.1,.75);text(urna,'JUSTIÇA\nELEITORAL',-.3,.85,.39,.65,.45,'#3d665e');for(let i=0;i<9;i++)cub(urna,'#394340',.34+(i%3)*.13,.85-Math.floor(i/3)*.16,.4,.09,.1,.04);text(parent,'URNA DO CAFEZINHO\nVOTO SECRETO. FILA PÚBLICA.',9,1.85,-20,3.1,.7,'#275751');
  return {lula,parliament};
 }
 function boss(parent){
 const arena=new T.Group();parent.add(arena);arena.position.z=-31*1.55;cub(arena,'#7f8390',0,-.02,0,16,.15,12);
 for(let x=-4;x<=4;x++)for(let r=28;r<=34;r++)cub(arena,(x+r)%2?'#a6acaa':'#bcc0b5',x*1.45,.07,-r*1.55-arena.position.z,1.4,.035,1.5);
 const g=character('xandao');g.position.set(0,.1,-35.3*1.55);g.scale.setScalar(3.3);parent.add(g);text(parent,'O JULGAMENTO FINAL',0,7.9,-36.7*1.55,13,1,'#4c2434');
 const markers=new T.Group();parent.add(markers);const tiles=[];for(let i=0;i<63;i++){const m=cub(markers,'#e7bc4f',0,.12,0,1.36,.07,1.44);m.visible=false;tiles.push(m);}
 const wave=mesh(new T.TorusGeometry(1,.065,6,48),'#dc7682',parent,0,.25,-31*1.55);wave.rotation.x=Math.PI/2;wave.visible=false;
 const counter=mesh(new T.TorusGeometry(1.85,.07,8,48),'#76d2ec',parent);counter.rotation.x=Math.PI/2;counter.visible=false;
 const counterText=text(parent,'F · RECURSO',0,.7,0,1.9,.4,'#235b70');counterText.visible=false;
 const projectiles=[];for(let i=0;i<4;i++){const q=new T.Group();parent.add(q);cub(q,'#f7eed7',0,0,0,.48,.07,.65);text(q,'STF',0,.11,.02,.35,.25,'#e8ddbf','#a22d3b').rotation.x=-Math.PI/2;q.visible=false;projectiles.push(q);}
 g.visible=false;arena.visible=false;return {g,arena,tiles,markers,wave,counter,counterText,projectiles,parent,hammerDropped:false,hammerStart:null};
}
 function bossVisual(v,b,time){
 v.g.visible=!!b;v.arena.visible=!!b;
 v.tiles.forEach((tile,i)=>{const cell=b?.active&&b.cells[i];tile.visible=!!cell;if(cell){const wall=cell.hot&&[1,4].includes(b.index);tile.position.set(cell.x*1.45,wall?.5:.13,-cell.row*1.55);tile.material=material(cell.hot?'#d95966':'#efbc53');tile.scale.y=wall?12:cell.hot?2:1+Math.sin(time*8)*.25;}});
 v.projectiles.forEach((g,i)=>{const q=b?.active&&b.projectiles[i];g.visible=!!q;if(q){g.position.set(q.x*1.45,.7,-q.row*1.55);g.rotation.y=-q.angle+Math.PI/2;g.rotation.z=Math.sin(time*12+i)*.14;}});
 v.counter.visible=!!b?.vulnerable&&!b.counterUsed;v.counterText.visible=v.counter.visible;
 if(v.counter.visible){v.counter.position.set(b.counterCell.x*1.45,.22,-b.counterCell.row*1.55);v.counter.scale.setScalar(1+Math.sin(time*8)*.045);v.counterText.position.set(v.counter.position.x,.85,v.counter.position.z);}
 v.wave.visible=!!b?.hot&&b.index===0;
 if(v.wave.visible){v.wave.position.set(b.anchor.x*1.45,.26,-b.anchor.row*1.55);v.wave.scale.setScalar(1+Math.sin(Math.min(1,b.cycleTime/3)*Math.PI/2)*2);}
 if(!b)return;const d=v.g.userData;
 if(!b.dying&&!b.defeated){v.g.position.set(b.x*1.45,.1,-b.row*1.55);v.g.rotation.set(0,(b.previous?Math.atan2(b.previous.x-b.x,b.row-b.previous.row):0)*.25,0);animateCharacter(v.g,time,b.warning,0,0);d.rig.rotation.z=b.hitFlash>0?Math.sin(time*60)*.09:0;d.head.rotation.x=b.hitFlash>0?-.15:b.vulnerable?.12:0;d.arms[1].rotation.x=b.warning?-1.6:b.hot?.8:-.25;d.rig.position.y=b.vulnerable?-.08:0;d.robe.material.emissive.set(b.hitFlash>0?'#f4847c':b.vulnerable?'#2b7184':'#000000');d.robe.material.emissiveIntensity=b.hitFlash>0?.5:b.vulnerable?.35:0;return;}
 // Surprise → release hammer → stagger → fall → comic slide out of court.
 const t=b.defeatTime;d.head.rotation.x=t<.65?-.22:.15;d.brows.forEach(o=>o.position.y=t<.8?.34:.24);d.pupils.forEach(o=>o.scale.y=t<.7?.085:.055);d.mouth.scale.y=t<.7?2.8:1;
 if(t>.45&&!v.hammerDropped){v.g.updateMatrixWorld(true);v.parent.attach(d.hammer);v.hammerStart=d.hammer.position.clone();v.hammerDropped=true;}
 if(v.hammerDropped){const fall=Math.min(1,Math.max(0,(t-.45)/1.0));d.hammer.position.copy(v.hammerStart);d.hammer.position.y=Math.max(.22,v.hammerStart.y-8*fall*fall);d.hammer.position.x+=fall*2.2;d.hammer.rotation.z+=.07;d.hammer.rotation.x+=.04;}
 const f=T.MathUtils.smoothstep(t,1.55,2.65),slide=T.MathUtils.smoothstep(t,3.2,4.8);
 v.g.rotation.z=-f*1.35;v.g.position.x=b.x*1.45+slide*19;v.g.position.y=.1-f*.4;d.rig.rotation.z=t<1.6?Math.sin(t*18)*.09:0;d.arms[0].rotation.x=-.9;d.arms[1].rotation.x=-.4;
 d.robe.rotation.z=Math.sin(t*17)*.08*(1-slide);d.robe.scale.x=1+Math.sin(t*14)*.045;d.robe.material.emissiveIntensity=Math.max(0,.2-t*.1);
}
 function presidential(g,enabled,dt){const d=g.userData;if(!d.rig)return;if(enabled&&!d.sash){const sash=new T.Group();sash.position.set(0,1.12,.34);d.rig.add(sash);const ribbon=cub(sash,'#2f8a54',0,0,0,.17,.84,.035);ribbon.rotation.z=-.65;for(const side of [-1,1]){const edge=cub(sash,'#edc858',side*.075,0,.024,.025,.84,.02);edge.rotation.z=-.65;}const seal=cyl(sash,'#e7bb51',.17,-.23,.035,.085,.085,.035,16);seal.rotation.x=Math.PI/2;sash.scale.setScalar(.001);d.sash=sash;d.sashAmount=0;}if(d.sash){d.sashAmount=T.MathUtils.damp(d.sashAmount,enabled?1:0,8,dt);d.sash.visible=d.sashAmount>.01;d.sash.scale.setScalar(Math.max(.001,d.sashAmount));}}
 return {character,animateCharacter,flag,text,scenery,boss,bossVisual,material,presidential};
}
