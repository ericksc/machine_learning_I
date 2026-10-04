# Ruta de los nuevos cuadernos

## Visualizaciones

Los cuadernos 7 a 11 incluyen una galería de rendimiento y clasificación. En Jupyter o Colab, use «Reiniciar y ejecutar todo» para generar las imágenes debajo de las celdas. Las descargas de la web contienen el código sin salidas previas; los originales locales conservan las figuras verificadas.

- KNN, árbol y regresión logística: métricas por clase, aciertos y errores, probabilidades y fronteras de un modelo auxiliar de dos variables.
- Umbral: matrices de confusión comparadas, distribución de probabilidades, evolución de falsos positivos y negativos, e imagen de etiquetas al cambiar el umbral.
- Escalamiento: resultados por pliegue, mapa de métricas de las 12 combinaciones, brecha de entrenamiento y validación, y clasificación del modelo elegido. Si el modelo entrega puntuaciones de decisión, se identifican como tales, sin llamarlas probabilidades.

Los cuadernos 1 y 2 ya introducen y comparan clasificadores. Los nuevos profundizan en decisiones concretas:

1. 1_Clasificadores_Aprendizaje_Automatico.ipynb: introducción guiada; algunas secciones anticipan la ruta.
2. 8_Arbol_decision_paso_a_paso.ipynb: reglas y complejidad.
3. 7_KNN_paso_a_paso.ipynb: distancias y vecinos.
4. 9_Regresion_logistica_paso_a_paso.ipynb: probabilidades y regularización.
5. 10_Efecto_cambio_umbral.ipynb: errores y costos.
6. 11_Escalamiento_comparacion_modelos.ipynb: comparar escaladores después de conocer los modelos.
7. 2_Comparacion_clasificadores.ipynb: integración y validación cruzada.
8. 3_clasificacion_red_neuronal.ipynb, junto con tree_groups.csv: red neuronal.
9. Prueba_Corta_2_Clasificacion_Frutas.ipynb, junto con data_frutas.csv: aplicación final.

Antes de las prácticas lea las subsecciones de fundamentos, validación cruzada y escalamiento en la web. Los nombres originales de archivo se conservan; siga esta secuencia y la numeración de las tarjetas, no el número del nombre de archivo.

Los cinco son independientes y usan datos incluidos en scikit-learn o generados localmente. Requieren las dependencias de la semana, no archivos adicionales. Ejecute cada uno desde un kernel limpio. Las conclusiones numéricas se calculan al ejecutarlos. Repetir Wine permite comparar conceptos; no interprete la exposición reiterada a su test como una nueva evaluación externa.
