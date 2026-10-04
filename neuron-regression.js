window.NeuronRegression=(()=>{
 const points=[[0,1.2],[1,2.8],[2,5.3],[3,6.7],[4,9.2]];
 const loss=(w,b)=>points.reduce((s,[x,y])=>s+(w*x+b-y)**2,0)/points.length;
 function step(w,b,rate){let dw=0,db=0;for(const [x,y]of points){const e=w*x+b-y;dw+=2*e*x/points.length;db+=2*e/points.length;}return {w:w-rate*dw,b:b-rate*db,dw,db};}
 function mount(host){
  const section=document.createElement('section');section.className='panel';section.id='neuron-regression';
  section.innerHTML=`<p class="micro-label">SIMULADOR · UNA NEURONA LINEAL</p><h2>Aprende una regresión con una sola neurona</h2><p>La neurona calcula <strong>ŷ = w·x + b</strong>: w es el peso (pendiente) y b el sesgo (intercepto). No tiene capa oculta; su activación lineal deja la suma sin cambios. Con una entrada representa una recta, igual que una regresión lineal simple.</p><div class="lab-grid"><div><label for="nr-w">Peso w</label><input id="nr-w" type="number" min="-10" max="10" step="0.1" value="0"><label for="nr-b">Sesgo b</label><input id="nr-b" type="number" min="-10" max="10" step="0.1" value="0"><label for="nr-rate">Tasa de aprendizaje η</label><select id="nr-rate"><option value="0.01">0,01 · paso pequeño</option><option value="0.05" selected>0,05 · paso intermedio</option><option value="0.2">0,20 · explorar inestabilidad</option></select><p><button type="button" id="nr-step">Entrenar 1 paso</button> <button type="button" id="nr-many">Entrenar 20 pasos</button> <button type="button" id="nr-reset">Reiniciar neurona</button></p><label for="nr-x">Entrada nueva x (0 a 4)</label><input id="nr-x" type="range" min="0" max="4" step="0.1" value="2.5"><div id="nr-result" role="status" aria-live="polite"></div></div><figure id="nr-fit"></figure></div><h3>Cómo aprende</h3><p>MSE = promedio((ŷ − y)²). En cada paso usamos los cinco ejemplos: ∂MSE/∂w = promedio(2(ŷ − y)x) y ∂MSE/∂b = promedio(2(ŷ − y)). Actualizamos simultáneamente w ← w − η·gradiente_w y b ← b − η·gradiente_b. Aquí un paso equivale a una época con un único lote completo.</p><p id="nr-update"></p><figure id="nr-history"></figure><div class="table-wrap" id="nr-table"></div><p>Prueba: comienza con w = 0 y b = 0, entrena 20 pasos y observa el error. Reinicia y repite con η = 0,20. ¿Por qué un paso demasiado grande puede aumentar la pérdida? Cambiar w o b manualmente inicia una trayectoria nueva. Cambiar η conserva el estado actual.</p><p class="small">Datos sintéticos de entrenamiento. El MSE mostrado no mide generalización: para evaluar un modelo real se necesitan datos separados de validación y prueba. La entrada nueva no tiene respuesta real conocida.</p>`;
  host.children[1].before(section);
  const $=id=>section.querySelector('#'+id),fmt=n=>n.toLocaleString('es',{maximumFractionDigits:4});
  let w=0,b=0,history=[loss(0,0)],count=0,note='Aún no hay actualizaciones.',stopped=false;
  function svg(body,label){return `<svg viewBox="0 0 520 310" style="width:100%;height:auto" role="img" aria-label="${label}">${body}</svg>`;}
  function render(){
   const x=Number($('nr-x').value),mse=loss(w,b);
   $('nr-result').innerHTML=`<p><strong>ŷ = ${fmt(w)}·x + (${fmt(b)})</strong></p><p>Pasos: ${count} · MSE: <strong>${fmt(mse)}</strong></p><p>Para x = ${fmt(x)} → predicción <strong>${fmt(w*x+b)}</strong></p>`;
   $('nr-update').textContent=note;
   const vals=[0,...points.map(p=>p[1]),b,4*w+b],min=Math.min(...vals),max=Math.max(...vals)+1;
   const X=x=>55+x*105,Y=y=>250-(y-min)/(max-min)*210;
   let plot='<path d="M55 30v220h425" fill="none" stroke="#8da6b8"/>';
   for(let i=0;i<5;i++)plot+=`<text x="${X(i)}" y="271" text-anchor="middle">${i}</text>`;
   for(let i=0;i<5;i++){const v=min+(max-min)*i/4;plot+=`<text x="48" y="${Y(v)+4}" text-anchor="end" font-size="11">${fmt(v)}</text>`;}
   plot+=`<path d="M${X(0)} ${Y(b)}L${X(4)} ${Y(4*w+b)}" stroke="#2861a5" stroke-width="3"/>`;
   points.forEach(([x,y])=>plot+=`<path d="M${X(x)} ${Y(y)}V${Y(w*x+b)}" stroke="#b05220" stroke-dasharray="4 3"/><circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="#08796e"/>`);
   plot+=`<path d="M${X(x)} ${Y(w*x+b)-8}l8 8-8 8-8-8Z" fill="#754ab0"/><text x="55" y="20">Datos y predicción (escala Y automática)</text><text x="55" y="300" font-size="12">● Datos · azul: neurona · trazos: errores · ◆ consulta</text>`;
   $('nr-fit').innerHTML=svg(plot,'Datos de entrenamiento y recta predicha por la neurona');
   const log=history.some(v=>v>1000),values=history.map(v=>log?Math.log10(1+v):v),top=Math.max(...values,1);
   $('nr-history').innerHTML=svg(`<path d="M55 30v220h425" fill="none" stroke="#8da6b8"/><polyline points="${values.map((v,i)=>`${55+420*i/Math.max(1,values.length-1)},${250-210*v/top}`).join(' ')}" fill="none" stroke="#754ab0" stroke-width="3"/><text x="55" y="20">${log?'log₁₀(1 + MSE)':'MSE'} durante el entrenamiento</text><text x="55" y="273">0 pasos</text><text x="475" y="273" text-anchor="end">${count} pasos</text><text x="10" y="42" font-size="11">${fmt(top)}</text><text x="30" y="250">0</text>`, 'Evolución de la pérdida; '+(log?'escala logarítmica':'escala lineal'));
   $('nr-table').innerHTML=`<table><caption>Cálculo del error en los cinco ejemplos</caption><thead><tr><th>x</th><th>y real</th><th>ŷ</th><th>Residuo y − ŷ</th><th>Error²</th></tr></thead><tbody>${points.map(([x,y])=>`<tr><td>${x}</td><td>${fmt(y)}</td><td>${fmt(w*x+b)}</td><td>${fmt(y-w*x-b)}</td><td>${fmt((y-w*x-b)**2)}</td></tr>`).join('')}</tbody></table>`;
   $('nr-step').disabled=stopped;$('nr-many').disabled=stopped;
  }
  function train(n){const rate=Number($('nr-rate').value);for(let i=0;i<n;i++){
   if(count>=500){stopped=true;note='Límite didáctico de 500 pasos. Reinicia para comparar otro experimento.';break;}
   const next=step(w,b,rate);
   if(!Number.isFinite(loss(next.w,next.b))||Math.abs(next.w)>1e5||Math.abs(next.b)>1e5){stopped=true;note='Entrenamiento detenido: parámetros demasiado grandes. La tasa puede ser inestable. Reinicia y prueba una menor.';break;}
   note=`Último paso: gradiente_w = ${fmt(next.dw)}, gradiente_b = ${fmt(next.db)}; η = ${fmt(rate)}.`;
   w=next.w;b=next.b;count++;history.push(loss(w,b));
  }$('nr-w').value=w;$('nr-b').value=b;render();}
  function manual(){const nw=Number($('nr-w').value),nb=Number($('nr-b').value);if(!Number.isFinite(nw)||!Number.isFinite(nb)||Math.abs(nw)>1e5||Math.abs(nb)>1e5)return;w=nw;b=nb;history=[loss(w,b)];count=0;stopped=false;note='Nuevo estado inicial elegido manualmente.';render();}
  $('nr-w').addEventListener('change',manual);$('nr-b').addEventListener('change',manual);$('nr-x').addEventListener('input',render);
  $('nr-step').addEventListener('click',()=>train(1));$('nr-many').addEventListener('click',()=>train(20));$('nr-reset').addEventListener('click',()=>{$('nr-w').value=0;$('nr-b').value=0;manual();});render();
 }
 return {mount,step,loss};
})();
