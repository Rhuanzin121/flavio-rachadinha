// A bespoke lofted facial mesh, shaped from the user-provided portrait and facial description.
// No photograph is used as a texture; all volumes, hair and features are geometry.
export function sculptFlavio(T,head){
 const gauss=n=>Math.exp(-n*n);
 const skin=new T.MeshStandardMaterial({color:'#e1bca5',roughness:.82,vertexColors:true});
 const plain=c=>new T.MeshStandardMaterial({color:c,roughness:.82});
 const colors=new Map();const mat=c=>{if(!colors.has(c))colors.set(c,plain(c));return colors.get(c);};
 function mesh(geo,m,parent=head){const o=new T.Mesh(geo,typeof m==='string'?mat(m):m);o.castShadow=true;o.receiveShadow=true;o.userData.ownedMaterial=true;parent.add(o);return o;}
 function ell(c,x,y,z,sx,sy,sz,parent=head){const o=mesh(new T.SphereGeometry(1,20,14),c,parent);o.position.set(x,y,z);o.scale.set(sx,sy,sz);return o;}
 function line(c,pts,r=.009,parent=head){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v))),24,r,6,false),c,parent);}
 function loft(sections,radial=64,facial=false){const v=[],indices=[],tones=[];
  sections.forEach(([y,rx,rz,cz=0],j)=>{for(let i=0;i<=radial;i++){const a=i/radial*Math.PI*2,front=Math.max(0,Math.sin(a)),x=rx*Math.cos(a);let z=rz*Math.sin(a)+cz;
   if(facial){const cheek=gauss((y+.08)/.21)*gauss((Math.abs(x)-.27)/.14);z+=front*(.045*cheek+.018*gauss((y+.42)/.1));z-=front*.025*gauss((y-.11)/.07)*gauss((Math.abs(x)-.18)/.1);}
   v.push(x,y,z);const shade=facial?1-.075*front*gauss((y+.18)/.3)*Math.abs(Math.cos(a)):.98;tones.push(shade,shade,shade);
   if(j<sections.length-1&&i<radial){const k=j*(radial+1)+i;indices.push(k,k+radial+1,k+1,k+1,k+radial+1,k+radial+2);}
  }});const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setAttribute('color',new T.Float32BufferAttribute(tones,3));g.setIndex(indices);g.computeVertexNormals();return g;
 }
 const face=mesh(loft([[-.62,.01,.02,.08],[-.58,.17,.16,.07],[-.5,.28,.235,.055],[-.35,.355,.29,.025],[-.19,.407,.33,0],[-.02,.423,.35,-.005],[.14,.418,.35,-.015],[.32,.409,.345,-.025],[.48,.365,.3,-.035],[.6,.255,.23,-.03],[.66,.01,.015,-.025]],64,true),skin);face.name='Flavio_Face_Sculpted';
 // Ears, earlobes and a defined nasal bridge, alar wings and nostrils.
 for(const side of [-1,1]){ell('#cb987e',side*.436,-.015,-.015,.072,.155,.085);ell('#b78069',side*.467,-.02,.052,.027,.092,.018);ell('#d8aa90',side*.439,-.12,.015,.045,.052,.047);}
 const nose=mesh(loft([[-.23,.018,.015,.43],[-.205,.055,.03,.445],[-.16,.092,.085,.46],[-.1,.07,.078,.444],[.02,.043,.055,.405],[.16,.035,.025,.36],[.23,.015,.015,.33]],32),new T.MeshStandardMaterial({color:'#dfb49e',roughness:.82,vertexColors:true}));nose.name='Flavio_Nasal_Bridge';
 for(const side of [-1,1]){ell('#dfb49e',side*.077,-.175,.432,.045,.042,.052);ell('#79594f',side*.056,-.199,.477,.024,.011,.014);}
 const pupils=[],brows=[];
 for(const side of [-1,1]){
  const x=side*.185;ell('#ede7d6',x,.105,.335,.092,.034,.033);
  const iris=ell('#786f40',x,.107,.367,.026,.024,.012);pupils.push(iris);ell('#292b26',0,0,.8,.48,.7,.5,iris);ell('#fff5dc',-.25,.35,1.1,.16,.13,.14,iris);
  line('#b98471',[[x-.092,.108,.339],[x-.04,.135,.365],[x+.035,.132,.362],[x+.092,.092,.329]],.011);
  line('#c69b83',[[x-.092,.096,.34],[x,.066,.365],[x+.09,.102,.335]],.009);
  line('#b88a75',[[x-.095,.044,.32],[x,.015,.348],[x+.085,.049,.321]],.005);
  const brow=new T.Group();brow.position.set(x,.235,0);head.add(brow);line('#332b26',[[-.105,side>0?.006:-.012,.326],[-.055,.027,.346],[.015,.031,.35],[.105,side>0?-.014:.006,.323]],.027,brow);brows.push(brow);
  line('#bf917a',[[side*.104,-.192,.39],[side*.18,-.259,.365],[side*.218,-.355,.31]],.0055);
 }
 // Thin asymmetric lips and broad rounded chin, rather than a generic smile.
 const mouth=new T.Group();head.add(mouth);
 line('#a76f65',[[-.18,-.324,.346],[-.072,-.337,.38],[0,-.34,.39],[.075,-.335,.38],[.18,-.319,.346]],.011,mouth);
 line('#d3a18e',[[-.145,-.357,.34],[-.065,-.373,.372],[.04,-.371,.375],[.145,-.362,.34]],.016,mouth);
 line('#70564e',[[-.16,-.349,.342],[-.06,-.346,.384],[.06,-.349,.383],[.158,-.355,.34]],.005,mouth);
 line('#c3927b',[[-.115,-.435,.304],[0,-.447,.326],[.113,-.438,.306]],.005);
 // Custom swept cap with a receding temple line, parting and short comb ridges.
 const hv=[],hi=[];const rings=20,segments=64;
 for(let j=0;j<=rings;j++)for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,t=j/rings,front=Math.max(0,Math.sin(a)),hairline=.12+.29*front+.035*front*gauss((Math.abs(Math.cos(a))-.72)/.18),r=Math.sin(t*Math.PI/2);const ridge=.004*Math.sin(i*1.9+j*.45)*r;hv.push(Math.cos(a)*(.444+ridge)*r,.69-(.69-hairline)*(1-Math.cos(t*Math.PI/2))+.025*Math.cos(a)*Math.sin(t*Math.PI),Math.sin(a)*(.365+ridge)*r-.035);if(j<rings&&i<segments){const k=j*(segments+1)+i;hi.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}}
 const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(hv,3));hg.setIndex(hi);hg.computeVertexNormals();const hair=mesh(hg,'#302821');hair.name='Flavio_Swept_Hair_Custom';
 line('#46392e',[[.175,.405,.307],[.17,.51,.275],[.12,.645,.1],[.06,.67,-.11]],.004);
 for(let i=0;i<8;i++){const x=-.31+i*.07;line(i%2?'#41362c':'#4b3d32',[[x,.44+.025*(i%2),.29],[x-.015,.57,.25],[x-.025,.67,.06],[x-.03,.58,-.19]],.0035);}
 const sweat=ell('#8ad9e0',.425,.025,.2,.022,.07,.02);sweat.visible=false;
 return {pupils,brows,mouth,sweat,face,skin,hair};
}
