window.ClassifierLabs=(()=>{
 const train=[[1,2,0],[2,1,0],[2,4,0],[3,3,0],[4,2,1],[4,6,1],[5,5,1],[6,3,0],[6,7,0],[7,5,1],[8,8,1],[9,6,1]];
 const validation=[[1.5,3,0],[3,2,0],[5,2,0],[7,2,0],[3,7,1],[5,7,1],[8,5,1],[9,9,1]];
 const name=c=>c===0?'Clase A':'Clase B';
 const color=c=>c===0?'#08796e':'#b05220';
 const num=n=>n.toLocaleString('es',{maximumFractionDigits:3});
 const input=(id,label,min,max,value,step=1)=>`<label for="${id}">${label}: <output id="${id}-value">${value}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
 const plot=(query,neighbors=[],tree=null)=>{
  const X=x=>45+x*43,Y=y=>355-y*31;
  let b='';
  if(tree)for(let x=0;x<10;x+=.25)for(let y=0;y<10;y+=.25)b+=`<rect x="${X(x)}" y="${Y(y+.25)}" width="11" height="8" fill="${color(predict(tree,[x+.125,y+.125]))}" opacity=".12"/>`;
  b+='<path d="M45 35v320h430" fill="none" stroke="#869ba9"/>';
  for(let i=0;i<=10;i+=2)b+=`<text x="${X(i)}" y="377" text-anchor="middle">${i}</text><text x="32" y="${Y(i)+5}" text-anchor="end">${i}</text>`;
  neighbors.forEach(n=>{b+=`<line x1="${X(query[0])}" y1="${Y(query[1])}" x2="${X(n.p[0])}" y2="${Y(n.p[1])}" stroke="#754ab0" stroke-dasharray="4 3"/>`;});
  train.forEach((p,i)=>{const x=X(p[0]),y=Y(p[1]);b+=p[2]===0?`<circle cx="${x}" cy="${y}" r="7" fill="${color(0)}"/>`:`<rect x="${x-7}" y="${y-7}" width="14" height="14" fill="${color(1)}"/>`;b+=`<text x="${x+9}" y="${y-9}" style="font-size:12px">${i+1}</text>`;});
  b+=`<path d="M${X(query[0])} ${Y(query[1])-11}l11 11-11 11-11-11Z" fill="#754ab0" stroke="white" stroke-width="2"/><text x="45" y="20">Característica Y</text><text x="475" y="399" text-anchor="end">Característica X</text>`;
  return `<svg viewBox="0 0 520 420" role="img" aria-label="Datos de entrenamiento y caso nuevo en (${query.join(', ')}). Círculos: A; cuadrados: B; rombo: consulta." style="width:100%;height:auto">${b}</svg>`;
 };
 const gini=rows=>{const p=rows.filter(r=>r[2]===1).length/rows.length;return 1-p*p-(1-p)*(1-p);};
 function fit(rows,depth,minLeaf){
  const ones=rows.filter(r=>r[2]===1).length;
  const node={rows,cl:ones>rows.length/2?1:0,impurity:gini(rows)};
  if(!depth||node.impurity===0)return node;
  let best=null;
  for(let axis=0;axis<2;axis++){
   const values=[...new Set(rows.map(r=>r[axis]))].sort((a,b)=>a-b);
   for(let i=1;i<values.length;i++){
    const threshold=(values[i-1]+values[i])/2,left=rows.filter(r=>r[axis]<=threshold),right=rows.filter(r=>r[axis]>threshold);
    if(left.length<minLeaf||right.length<minLeaf)continue;
    const gain=node.impurity-(left.length*gini(left)+right.length*gini(right))/rows.length;
    if(gain>1e-10&&(!best||gain>best.gain+1e-10))best={axis,threshold,left,right,gain};
   }
  }
  if(best){Object.assign(node,{axis:best.axis,threshold:best.threshold,gain:best.gain});node.left=fit(best.left,depth-1,minLeaf);node.right=fit(best.right,depth-1,minLeaf);}
  return node;
 }
 function predict(node,p){while(node.left)node=p[node.axis]<=node.threshold?node.left:node.right;return node.cl;}
 function rules(n){return n.left?`<li><strong>${n.axis?'Y':'X'} ≤ ${num(n.threshold)}</strong> · ${n.rows.length} casos · Gini ${num(n.impurity)} · reducción ${num(n.gain)}<ul><li>Sí<ul>${rules(n.left)}</ul></li><li>No<ul>${rules(n.right)}</ul></li></ul></li>`:`<li>Hoja: <strong>${name(n.cl)}</strong> · ${n.rows.length} casos · Gini ${num(n.impurity)}</li>`;}
 function mount(host){
  host.insertAdjacentHTML('beforeend',`<section class="panel" id="knn-simulator"><p class="micro-label">SIMULADOR DE CLASIFICACIÓN</p><h2>KNN: mueve el caso y cuenta los vecinos</h2><p>Los puntos son 12 ejemplos sintéticos de entrenamiento. Cambia la posición del rombo y k, el número de vecinos. Se usa distancia euclídea en las unidades mostradas; ambas características comparten rango. Cada vecino aporta un voto. En empate se elige A.</p>${input('knn-k','Vecinos k',1,9,3)}${input('knn-x','X del caso nuevo',0,10,5,.25)}${input('knn-y','Y del caso nuevo',0,10,4,.25)}<div class="lab-grid"><figure id="knn-plot"></figure><div><div id="knn-result" role="status" aria-live="polite"></div><div class="table-wrap" id="knn-distances"></div></div></div><p>● Clase A · ■ Clase B · ◆ Caso nuevo. Las líneas unen los vecinos que votan. Prueba k = 1, 3 y 9: ¿cambia la decisión? Un círculo o una distancia pequeña no garantiza una clasificación correcta; el caso nuevo no tiene etiqueta real.</p></section><section class="panel" id="tree-simulator"><p class="micro-label">SIMULADOR DE CLASIFICACIÓN</p><h2>Árbol de decisión: aprende reglas y recorre sus ramas</h2><p>El árbol se vuelve a entrenar con los mismos 12 puntos al cambiar sus límites. Busca cortes en X o Y que reduzcan más la impureza de Gini, ponderando el tamaño de los grupos. Gini = 1 − Σpᵢ²; vale cero en un grupo de una sola clase. La raíz tiene profundidad 0. Un empate de votos en una hoja se resuelve con A.</p>${input('tree-depth','Profundidad máxima',1,4,2)}${input('tree-leaf','Mínimo de casos por hoja',1,5,1)}${input('tree-x','X del caso nuevo',0,10,5,.25)}${input('tree-y','Y del caso nuevo',0,10,4,.25)}<div class="lab-grid"><figure id="tree-plot"></figure><div id="tree-result" role="status" aria-live="polite"></div></div><h3>Reglas aprendidas</h3><ul id="tree-rules"></ul><p>El fondo muestra la clase que predice el árbol en cada región. La validación utiliza ocho casos sintéticos distintos del entrenamiento; no es una estimación fiable para un problema real. Observarla para ajustar parámetros la convierte en validación, no en test final. Aumenta la profundidad y observa si cambian las reglas y los resultados.</p></section>`);
  const get=id=>host.querySelector('#'+id),value=id=>{const v=Number(get(id).value);get(id+'-value').textContent=num(v);return v;};
  const updateK=()=>{
   const k=value('knn-k'),q=[value('knn-x'),value('knn-y')];
   const near=train.map((p,i)=>({p,i,d:Math.hypot(p[0]-q[0],p[1]-q[1])})).sort((a,b)=>a.d-b.d||a.i-b.i).slice(0,k);
   const a=near.filter(n=>n.p[2]===0).length,b=k-a;
   get('knn-plot').innerHTML=plot(q,near);
   get('knn-result').innerHTML=`<h3>Predicción: ${name(b>a?1:0)}</h3><p>A: <strong>${a} votos</strong> · B: <strong>${b} votos</strong>${a===b?' · empate: regla A':''}</p>`;
   get('knn-distances').innerHTML=`<table><caption>Vecinos ordenados por distancia; empates por identificador</caption><thead><tr><th scope="col">Punto</th><th scope="col">Clase</th><th scope="col">Distancia</th></tr></thead><tbody>${near.map(n=>`<tr><th scope="row">${n.i+1}</th><td>${name(n.p[2])}</td><td>${num(n.d)}</td></tr>`).join('')}</tbody></table>`;
  };
  const updateT=()=>{
   const tree=fit(train,value('tree-depth'),value('tree-leaf')),q=[value('tree-x'),value('tree-y')];
   let n=tree,route=[];while(n.left){const yes=q[n.axis]<=n.threshold;route.push(`${n.axis?'Y':'X'} ≤ ${num(n.threshold)}: ${yes?'sí':'no'}`);n=yes?n.left:n.right;}
   const correct=rows=>rows.filter(r=>predict(tree,r)===r[2]).length;
   get('tree-plot').innerHTML=plot(q,[],tree);
   get('tree-result').innerHTML=`<h3>Predicción: ${name(n.cl)}</h3><p>Recorrido: ${route.join(' → ')||'Raíz sin división válida'} → ${name(n.cl)}</p><p>Aciertos de entrenamiento: <strong>${correct(train)}/12</strong></p><p>Aciertos de validación: <strong>${correct(validation)}/8</strong></p><details><summary>Ver los ocho casos de validación</summary><p>${validation.map(r=>`(${r[0]}, ${r[1]}): real ${name(r[2])}, predicha ${name(predict(tree,r))}`).join('<br>')}</p></details>`;
   get('tree-rules').innerHTML=rules(tree);
  };
  host.children[1].before(get('knn-simulator'),get('tree-simulator'));
  get('knn-simulator').addEventListener('input',updateK);get('tree-simulator').addEventListener('input',updateT);updateK();updateT();
 }
 return {mount};
})();
