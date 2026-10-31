// Low-poly geometry guided by the user's PS1 character reference sheet.
// The existing face controls are retained for the game's animation rig.
export function sculptFlavio(T,head){
 const skin=new T.MeshStandardMaterial({color:'#d9b299',roughness:.95,flatShading:true,vertexColors:true});
 const colors=new Map();const mat=c=>{if(!colors.has(c))colors.set(c,new T.MeshStandardMaterial({color:c,roughness:.95,flatShading:true}));return colors.get(c);};
 function mesh(geo,m,parent=head){const o=new T.Mesh(geo,typeof m==='string'?mat(m):m);o.castShadow=true;o.receiveShadow=true;o.userData.ownedMaterial=true;parent.add(o);return o;}
 function ell(c,x,y,z,sx,sy,sz,parent=head){const o=mesh(new T.IcosahedronGeometry(1,0),c,parent);o.position.set(x,y,z);o.scale.set(sx,sy,sz);return o;}
 function patch(c,points,parent=head){const v=[],ids=[];points.forEach(p=>v.push(...p));for(let i=1;i<points.length-1;i++)ids.push(0,i,i+1);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ids);g.computeVertexNormals();const o=mesh(g,c,parent);o.material.side=T.DoubleSide;return o;}
 function loft(sections,radial=12,facial=false){const v=[],ids=[];sections.forEach(([y,rx,rz,cz=0],j)=>{for(let i=0;i<=radial;i++){const a=i/radial*Math.PI*2,cos=Math.cos(a),sin=Math.sin(a);const x=rx*Math.sign(cos)*Math.pow(Math.abs(cos),.8);let z=rz*sin+cz;if(facial&&sin>0)z+=.018*Math.exp(-Math.pow((y+.14)/.19,2));v.push(x,y,z);if(j<sections.length-1&&i<radial){const k=j*(radial+1)+i;ids.push(k,k+radial+1,k+1,k+1,k+radial+1,k+radial+2);}}});let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ids);g=g.toNonIndexed();const tones=[];for(let i=0;i<g.attributes.position.count;i+=3){const t=1-(Math.floor(i/3)%5)*.009;for(let k=0;k<3;k++)tones.push(t,t,t);}g.setAttribute('color',new T.Float32BufferAttribute(tones,3));g.computeVertexNormals();return g;}
 const face=mesh(loft([[-.57,.30,.22,.035],[-.51,.38,.27,.015],[-.34,.41,.31,0],[-.12,.445,.335,0],[.1,.44,.34,-.005],[.32,.425,.335,-.02],[.48,.375,.30,-.025],[.59,.25,.21,-.035],[.64,.015,.015,-.04]],12,true),skin);face.name='Flavio_Face_LowPoly';
 for(const side of [-1,1]){ell('#c99f86',side*.445,-.015,-.015,.065,.14,.07);patch('#b68c76',[[side*.47,.065,.035],[side*.47,-.07,.045],[side*.45,-.03,.065]]);}
 const nose=mesh(loft([[-.17,.045,.025,.375],[-.125,.075,.05,.402],[-.065,.06,.06,.41],[.065,.035,.03,.36],[.115,.025,.018,.337]],8),new T.MeshStandardMaterial({color:'#d5aa90',roughness:.95,flatShading:true,vertexColors:true}));nose.name='Flavio_Compact_Nose';
 for(const side of [-1,1])patch('#926e5d',[[side*.035,-.17,.42],[side*.065,-.165,.411],[side*.055,-.185,.401]]);
 const pupils=[],brows=[];
 for(const side of [-1,1]){
  const x=side*.185;
  patch('#e4ded0',[[x-.098,.11,.35],[x-.065,.145,.357],[x+.06,.145,.357],[x+.098,.11,.35],[x+.065,.075,.357],[x-.065,.075,.357]]);
  const iris=mesh(new T.CircleGeometry(1,8),'#39382e');iris.position.set(x,.108,.364);iris.scale.set(.027,.024,1);pupils.push(iris);
  patch('#9e7d68',[[x-.10,.112,.352],[x-.065,.154,.36],[x+.065,.154,.36],[x+.10,.112,.352],[x+.065,.13,.362],[x-.065,.13,.362]]);
  const brow=new T.Group();brow.position.set(x,.24,0);head.add(brow);patch('#292823',[[-.12,-.035,.351],[-.08,.035,.353],[.11,.018,.35],[.12,-.034,.352]],brow);brows.push(brow);
 }
 const mouth=new T.Group();head.add(mouth);
 patch('#8f6b5c',[[-.185,-.34,.324],[-.07,-.324,.342],[0,-.332,.35],[.075,-.326,.342],[.185,-.342,.324],[.07,-.343,.343],[0,-.343,.35],[-.07,-.34,.343]],mouth);
 patch('#d2a78f',[[-.14,-.351,.326],[0,-.366,.344],[.14,-.351,.326],[.06,-.382,.33],[-.06,-.382,.33]],mouth);
 const hv=[],hi=[],rings=4,segments=12;
 for(let j=0;j<=rings;j++)for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,t=j/rings,r=Math.sin(t*Math.PI/2),front=Math.max(0,Math.sin(a)),side=Math.cos(a),hairline=.02+.405*front+.035*front*Math.abs(side);hv.push(Math.sign(side)*Math.pow(Math.abs(side),.8)*.52*r,.735-(.735-hairline)*(1-Math.cos(t*Math.PI/2))+.02*side*Math.sin(t*Math.PI),Math.sin(a)*.42*r-.045);if(j<rings&&i<segments){const k=j*(segments+1)+i;hi.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}}
 const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(hv,3));hg.setIndex(hi);hg.computeVertexNormals();const hair=mesh(hg,'#292a27');hair.name='Flavio_SidePart_LowPoly';
 const part=mesh(new T.TubeGeometry(new T.CatmullRomCurve3([[.16,.432,.361],[.15,.547,.335],[.12,.65,.244],[.07,.723,.11]].map(p=>new T.Vector3(...p))),6,.005,3,false),'#64594b');part.name='Flavio_Hair_Part';
 const sweat=ell('#8ad9e0',.425,.025,.2,.022,.07,.02);sweat.visible=false;
 return {pupils,brows,mouth,sweat,face,skin,hair};
}
