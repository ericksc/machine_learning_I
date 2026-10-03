# Semana 4: ejecutar los cuadernos

Abra cada archivo .ipynb en Jupyter, VS Code con extensión Jupyter o Google Colab. Reinicie el kernel y ejecute las celdas en orden. Coloque los CSV y archivos .data en la misma carpeta de trabajo que el cuaderno; en Colab, súbalos al panel Archivos.

Entorno de revisión: Python 3.13.0. Para reproducirlo, cree un entorno virtual con Python 3.13. `requirements.txt` registra las versiones utilizadas que corresponden a esta semana. Instale con `python -m pip install -r requirements.txt`. En Colab, instale solamente las dependencias faltantes; cambiar TensorFlow puede requerir reiniciar el entorno.

Los cuadernos no instalan paquetes ni borran carpetas automáticamente. MNIST, Fashion-MNIST y los ejemplos de imágenes descargan datos públicos la primera vez; después reutilizan su caché. Las búsquedas con Keras Tuner crean carpetas distintas por ejecución. Los entrenamientos de muchas épocas pueden tardar varios minutos o más en CPU.

Distinga exactitud (accuracy) y precisión (precision). Ajuste escaladores, PCA y selección de variables solo con entrenamiento si evalúa un predictor. Use validación para elegir configuraciones y reserve prueba para la evaluación final. Las semillas permiten repetir experimentos en el mismo entorno, pero no garantizan resultados idénticos entre versiones o dispositivos.

Los archivos de actividad con celdas por completar son ejercicios; los de `_solucion` son material del docente. El informe de revisión y las ejecuciones verificadas se conservan en `semana_1/revision_cuadernos`. Las copias de la web se entregan sin salidas antiguas para que el estudiante genere sus propios resultados.
