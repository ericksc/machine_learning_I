window.DigitLab=(()=>{
 function predict(pixels){
  const {weights:w,biases:b}=DigitModel;
  const h=b[0].map((bias,j)=>Math.max(0,bias+pixels.reduce((s,x,i)=>s+x*w[0][i][j],0)));
  const z=b[1].map((bias,j)=>bias+h.reduce((s,x,i)=>s+x*w[1][i][j],0));
  const ex=z.map(x=>Math.exp(x-Math.max(...z))),sum=ex.reduce((a,b)=>a+b,0);
  return {hidden:h,prob:ex.map(x=>x/sum)};
 }
 function mount(host){
  const section=document.createElement('section');section.className='panel';section.id='digit-simulator';
  section.innerHTML=`<p class="micro-label">RED NEURONAL · DÍGITOS 0–9</p><h2>¿Qué dígito ve la red?</h2><p>Prueba ejemplos reservados o modifica sus píxeles. La red recibe 64 intensidades, activa 32 neuronas con ReLU y produce 10 probabilidades con softmax. ReLU conserva valores positivos y convierte negativos en cero; softmax convierte las puntuaciones de salida en probabilidades que suman 1.</p><p>Modelo entrenado previamente con ${DigitModel.trainSize} imágenes de Digits (8 × 8), con una separación estratificada y semilla 42. Exactitud en ${DigitModel.testSize} imágenes reservadas: <strong>${(DigitModel.accuracy*100).toFixed(1)} %</strong>. Este dato no garantiza el resultado de un dibujo nuevo; los ejemplos se seleccionaron por etiqueta, sin filtrar aciertos.</p><label for="digit-example">Dígito de ejemplo</label><select id="digit-example">${Array.from({length:10},(_,i)=>`<option value="${i}">${i}</option>`).join('')}</select> <button type="button" id="digit-load">Cargar otro ejemplo</button> <button type="button" id="digit-clear">Limpiar imagen</button><p id="digit-source"></p><label for="digit-mode">Herramienta</label><select id="digit-mode"><option value="1">Pintar blanco</option><option value="0.5">Pintar gris</option><option value="0">Borrar</option></select><div class="lab-grid"><div><div id="digit-grid" role="group" aria-label="Imagen editable de 8 por 8 píxeles" style="display:grid;grid-template-columns:repeat(8,1fr);max-width:280px;touch-action:none">${Array.from({length:64},(_,i)=>`<button type="button" data-pixel="${i}" aria-label="Fila ${Math.floor(i/8)+1}, columna ${i%8+1}" style="padding:0;min-width:0;aspect-ratio:1;border:1px solid #667;border-radius:0"></button>`).join('')}</div><p>Pinta pulsando o arrastrando. Con teclado, usa Tab y Enter. Centra el dígito y deja un borde negro. Los dibujos libres pueden diferir mucho de los ejemplos de entrenamiento.</p></div><div id="digit-result" aria-live="polite" role="status"></div></div><h3>De píxeles a predicción</h3><p>8 × 8 píxeles → 64 entradas entre 0 y 1 → 32 neuronas ReLU → 10 salidas softmax → clase de mayor probabilidad.</p><div id="digit-hidden"></div><p>El gráfico de activaciones muestra la respuesta de cada neurona oculta; sus posiciones no corresponden a zonas de la imagen. Una probabilidad alta no es certeza. Los pesos permanecen fijos: dibujar cambia la entrada, no vuelve a entrenar la red.</p><p class="small">Datos: <a href="https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html" target="_blank" rel="noopener noreferrer">Digits de scikit-learn (nueva pestaña)</a>. Las imágenes se procesan localmente en el navegador.</p>`;
  host.querySelector('.quiz').before(section);
  const $=id=>section.querySelector('#'+id);let pixels=Array(64).fill(0),cycle=0,drag=false;
  function render(){
   section.querySelectorAll('[data-pixel]').forEach((button,i)=>{const v=Math.round(pixels[i]*255);button.style.background=`rgb(${v},${v},${v})`;button.setAttribute('aria-label',`Fila ${Math.floor(i/8)+1}, columna ${i%8+1}, intensidad ${pixels[i].toFixed(2)}`);});
   if(pixels.every(x=>x===0)){$('digit-result').innerHTML='<p>Imagen vacía: carga un ejemplo o pinta un dígito.</p>';$('digit-hidden').innerHTML='';return;}
   const {prob,hidden}=predict(pixels),winner=prob.indexOf(Math.max(...prob));
   $('digit-result').innerHTML=`<h3>Predicción: ${winner}</h3><table><caption>Probabilidades de las diez clases</caption><thead><tr><th>Dígito</th><th>Probabilidad</th><th>Distribución</th></tr></thead><tbody>${prob.map((p,i)=>`<tr><th scope="row">${i}${i===winner?' ←':''}</th><td>${(p*100).toFixed(2)} %</td><td><meter min="0" max="1" value="${p}" aria-label="Probabilidad del dígito ${i}" style="max-width:100%">${p}</meter></td></tr>`).join('')}</tbody></table>`;
   const max=Math.max(...hidden,1);
   $('digit-hidden').innerHTML=`<svg viewBox="0 0 640 150" role="img" aria-label="Activaciones de 32 neuronas ocultas; ${hidden.filter(x=>x>0).length} activas" style="width:100%">${hidden.map((v,i)=>`<rect x="${i*20}" y="${120-v/max*100}" width="15" height="${v/max*100}" fill="#754ab0"/><text x="${i*20+7}" y="140" text-anchor="middle" font-size="9">${i+1}</text>`).join('')}</svg><p>${hidden.filter(x=>x>0).length} neuronas activas de 32. Altura proporcional a la activación; máximo actual: ${Math.max(...hidden).toFixed(2)}.</p>`;
  }
  function load(){const label=Number($('digit-example').value),e=DigitModel.examples.filter(x=>x.label===label)[cycle++%3];pixels=e.pixels.slice();$('digit-source').textContent=`Etiqueta real: ${label}. Ejemplo reservado; compara con la predicción.`;render();}
  function paint(e){const b=e.target.closest('[data-pixel]');if(!b)return;pixels[Number(b.dataset.pixel)]=Number($('digit-mode').value);$('digit-source').textContent='Imagen modificada por ti: no se conoce su etiqueta real.';render();}
  $('digit-grid').addEventListener('pointerdown',e=>{drag=true;paint(e);});
  $('digit-grid').addEventListener('pointerover',e=>{if(drag&&e.buttons)paint(e);});
  $('digit-grid').addEventListener('pointerup',()=>drag=false);
  $('digit-grid').addEventListener('click',paint);
  $('digit-example').addEventListener('change',()=>{cycle=0;load();});$('digit-load').addEventListener('click',load);
  $('digit-clear').addEventListener('click',()=>{pixels.fill(0);$('digit-source').textContent='Dibujo nuevo.';render();});load();
 }
 return {mount,predict};
})();
