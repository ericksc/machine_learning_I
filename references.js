window.CourseReferences = (() => {
 const sk=(path)=>'https://scikit-learn.org/stable/'+path;
 const r=(title,url,use,language='Inglés',source='scikit-learn')=>({title,url,use,language,source});
 const basics=r('Curso intensivo de aprendizaje automático','https://developers.google.com/machine-learning/crash-course?hl=es','Repasa conceptos y ejemplos antes de consultar las API.','Español','Google for Developers');
 const metrics=r('Métricas y evaluación',sk('modules/model_evaluation.html'),'Consulta definiciones de métricas y ejemplos de uso en Python.');
 const leakage=r('Errores frecuentes y fuga de información',sk('common_pitfalls.html'),'Revisa cómo separar datos y ajustar transformaciones correctamente.');
 const linear=r('Modelos lineales',sk('modules/linear_model.html'),'Consulta mínimos cuadrados, coeficientes y regresión logística.');
 const cv=r('Validación cruzada',sk('modules/cross_validation.html'),'Estudia pliegues, estratificación y alternativas para grupos o tiempo.');
 const scaling=r('Preparación y escalamiento',sk('modules/preprocessing.html'),'Compara estandarización, escalamiento por rango y tratamiento de entradas.');
 const networks=r('Redes neuronales supervisadas',sk('modules/neural_networks_supervised.html'),'Amplía capas, activaciones, entrenamiento y regularización.');
 const dense=r('Dense: capa completamente conectada','https://keras.io/api/layers/core_layers/dense/','Consulta units, activation y use_bias; una salida lineal permite representar regresión.','Inglés','Keras');
 const data={
 1:[basics,metrics,leakage],
 2:[linear,dense,metrics,leakage],
 3:[basics,cv,scaling,r('Árboles de decisión',sk('modules/tree.html'),'Profundiza en reglas, impureza, poda y visualización del árbol.'),r('Vecinos más cercanos: KNN',sk('modules/neighbors.html'),'Consulta clasificación por vecinos, distancias y formas de votación.'),linear,r('Ajuste del umbral de clasificación',sk('modules/classification_threshold.html'),'Distingue probabilidades y decisiones; estudia la elección del umbral con validación.'),networks],
 4:[networks,r('Parada temprana: EarlyStopping','https://keras.io/api/callbacks/early_stopping/','Consulta monitor, patience y restore_best_weights.','Inglés','Keras'),r('Introducción a KerasTuner','https://keras.io/keras_tuner/getting_started/','Aprende a definir el espacio de búsqueda y comparar hiperparámetros.','Inglés','Keras'),cv],
 5:[r('Métodos de clustering',sk('modules/clustering.html'),'Compara K-Means, DBSCAN, agrupamiento jerárquico y sus métricas.'),scaling],
 6:[r('Selección de características',sk('modules/feature_selection.html'),'Consulta selección univariada, información mutua y selección dentro de un pipeline.'),r('Descomposición y PCA',sk('modules/decomposition.html'),'Estudia componentes principales y varianza explicada.'),leakage]
 };
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(week){return `<section class="panel consultation-references" aria-labelledby="reference-title"><p class="micro-label">PARA PROFUNDIZAR</p><h2 id="reference-title">Referencias de consulta · Semana ${week}</h2><p>Fuentes oficiales, en orden de lectura sugerido. Los títulos se presentan en español; se indica el idioma de la página. Los enlaces externos requieren conexión y se abren en otra pestaña.</p><ol>${data[week].map(item=>`<li><h3><a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.title)} ↗<span class="small"> (nueva pestaña)</span></a></h3><p class="small">${escape(item.source)} · ${escape(item.language)} · Consulta: 3 de octubre de 2026</p><p>${escape(item.use)}</p></li>`).join('')}</ol><p class="small">La documentación puede actualizarse. Para reproducir los cuadernos, utiliza las versiones indicadas en requirements.txt de la semana.</p></section>`;}
 return {data,render};
})();
