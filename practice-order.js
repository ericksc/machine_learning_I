window.PracticeOrder=(host,week)=>{
 host.querySelector('nav[aria-label="Ruta de prácticas de la semana 3"]')?.remove();
 const base=host.querySelector('#lab').closest('section');base.id=base.id||`week-${week}-base`;
 const guide=host.querySelector('.visual-support'),quiz=host.querySelector('.quiz');
 const project=week===6?Array.from(host.children).find(s=>s.querySelector('h2')?.textContent==='Guía para tu proyecto final'):null;
 const ids=week===2?[base.id,'neuron-regression']:week===3?['tree-simulator','knn-simulator','threshold-simulator','digit-simulator']:week===6?['mi-lab','selection-lab','projection-lab',base.id]:[base.id];
 const activities=ids.map(id=>host.querySelector('#'+id));
 activities.forEach((s,i)=>{s.querySelector('h2').textContent=`${i+1}. ${s.querySelector('h2').textContent.replace(/^\d+\. /,'')}`;host.append(s);});
 host.append(guide);if(project)host.append(project);host.append(quiz);
 const nav=document.createElement('nav');nav.className='panel';nav.setAttribute('aria-label',`Orden de prácticas de la semana ${week}`);
 nav.innerHTML=`<p class="micro-label">RUTA DE PRÁCTICA</p><h2>Practica en este orden</h2><p>Experimenta con los controles, explica lo observado y completa la autoevaluación al final.</p><ol>${activities.map(s=>`<li><a href="#${s.id}">${s.querySelector('h2').textContent.replace(/^\d+\. /,'')}</a></li>`).join('')}<li>Registrar e interpretar resultados</li>${project?'<li>Integrar en el proyecto final</li>':''}<li>Autoevaluación</li></ol>`;
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();host.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});}));host.prepend(nav);
};
