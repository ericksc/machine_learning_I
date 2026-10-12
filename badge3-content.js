(() => {
 const w=COURSE[2];
 w.exercise={title:'Clasificar una fruta con cuatro características',intro:'El archivo data_frutas.csv contiene masa, ancho, altura y puntaje de color. La red estima si la fruta es manzana (0), mandarina (1), naranja (2) o limón (3).',steps:[['Preparar entradas y etiquetas','Conserva las cuatro columnas numéricas. Separa etiquetas y elimina nombre y subtipo de las entradas. Divide con estratificación y semilla 42. Ajusta StandardScaler solo con entrenamiento.'],['Calcular activaciones','Cada una de las ocho neuronas ocultas combina las cuatro entradas escaladas con sus pesos y sesgo. ReLU convierte las sumas negativas en cero. La capa final combina estas ocho activaciones para producir cuatro puntuaciones.'],['Elegir la clase y evaluar','Softmax convierte las puntuaciones en probabilidades que suman 1. Argmax elige la mayor. En Practica puedes seguir el cálculo numérico con los pesos reales y comparar la predicción con la etiqueta del ejemplo reservado. Usa datos de prueba para evaluar el modelo final.']],code:`import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

df = pd.read_csv("data_frutas.csv")
columnas = ["masa_fruta", "ancho_fruta", "altura_fruta", "puntaje_color"]
X = df[columnas]
y = df["etiqueta_fruta"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=42)
escala = StandardScaler().fit(X_train)
A = escala.transform(X_train)
B = escala.transform(X_test)
red = MLPClassifier(hidden_layer_sizes=(8,), solver="sgd",
    learning_rate_init=0.05, batch_size=len(A), alpha=0.001,
    random_state=42)
for epoca in range(301):
    red.partial_fit(A, y_train, classes=np.arange(4))
probabilidades = red.predict_proba(B)
print("Orden de columnas:", red.classes_)
print("Primera fruta:", probabilidades[0])
print("Clase elegida:", red.classes_[probabilidades[0].argmax()])
print("Exactitud:", accuracy_score(y_test, red.predict(B)))
print(confusion_matrix(y_test, red.predict(B)))`,challenge:'¿Qué cambia cuando modificas la masa de una fruta? ¿Y cuando recorres los estados de entrenamiento?',solution:'Modificar la masa cambia una entrada, las activaciones y posiblemente la clase predicha, conservando los pesos del estado elegido. Recorrer épocas cambia pesos y sesgos aprendidos, por lo que incluso la misma fruta puede recibir probabilidades diferentes.'};
 w.resources.push(
 ['3_Clasificacion_NN_Fashion.ipynb','Fashion-MNIST: introducción','Imágenes de prendas, Flatten, capas densas, softmax y variantes de arquitectura.'],
 ['5_extra_classifying_images_of_clothing.ipynb','Fashion-MNIST: ampliación','Preparación con tf.data, predicciones, imágenes y análisis de errores.'],
 ['4_Clasificador_de_imagenes_usando_red_neuronal.ipynb','Fotografías: dientes de león y hierba','Clasificación binaria de fotografías RGB mediante una red densa.'],
 ['6_Clasificador_de_imagenes_usando_red_neuronal.ipynb','Fotografías: variante del clasificador','Segundo ejemplo del mismo problema binario para comparar el procesamiento.'],
 ['Semana4_redes_neuronales.pptx','Presentación de redes neuronales','Material original: clasificación y conceptos generales. Aunque su nombre dice Semana4, pertenece a la carpeta suministrada para el badge 3.']);
 w.objectives.push('Explicar una predicción de fruta siguiendo escalado, pesos, sesgo, ReLU y softmax.','Relacionar las características medidas con los píxeles de Fashion-MNIST y fotografías RGB.');
 const neurons=LESSONS[3].find(s=>s.title==='Neuronas, capas y activaciones');
 neurons.paragraphs.push('El CSV de frutas contiene masa, ancho, altura y puntaje de color. Estas son las cuatro entradas numéricas. La etiqueta y los nombres son información de la respuesta y no se incluyen como características. En el laboratorio usamos 4 entradas, 8 neuronas ocultas ReLU y 4 salidas softmax. Se escalan las medidas usando estadísticas calculadas solo en entrenamiento.');
 neurons.example='Una mandarina del CSV tiene masa, ancho, altura y color. Tras el escalado, cada neurona calcula z = Σwᵢx′ᵢ + b y h = max(0, z). Otra capa combina las ocho activaciones. Softmax produce cuatro valores que suman 1 y argmax elige manzana, mandarina, naranja o limón. En Practica puedes inspeccionar el cálculo de la primera neurona y modificar las características.';
 const training=LESSONS[3].find(s=>s.title==='Cómo se entrena una red');
 training.paragraphs.push('Para una fruta cuya clase real es naranja, la pérdida de clasificación es −log(p_naranja). Cuanto menor es la probabilidad asignada a naranja, mayor es la pérdida. La retropropagación calcula derivadas, y el optimizador modifica pesos y sesgos. Las activaciones cambian al cambiar una entrada; los pesos cambian al entrenar. El laboratorio de frutas permite recorrer estados de un entrenamiento real.');
 const images=LESSONS[3].find(s=>s.title==='Clasificación de imágenes');
 images.paragraphs.push('Fashion-MNIST contiene diez categorías de prendas: camiseta/top, pantalón, suéter, vestido, abrigo, sandalia, camisa, zapatilla deportiva, bolso y botín. Cada imagen contiene 28 × 28 intensidades de gris. Dividir por 255 lleva sus valores a [0,1]; Flatten conserva esos 784 valores en una lista. El cuaderno introductorio usa Dense(128, ReLU) y Dense(10, softmax), con entropía cruzada dispersa para etiquetas enteras.');
 images.paragraphs.push('La simulación de dígitos usa Digits de scikit-learn, imágenes de 8 × 8 y diez clases numéricas. La simulación Fashion usa prendas reales de 28 × 28 y una red compacta de 32 neuronas. Sus resultados no son los del cuaderno de 128 neuronas. Los cuadernos 4 y 6 emplean fotografías RGB de dientes de león y hierba con salida sigmoide para dos categorías, mientras que el cuaderno 5 amplía la práctica de prendas.');
 images.points.push('Comprueba la correspondencia entre etiqueta, clase y unidad de salida.','Observa imágenes, compara etiqueta real con predicción y revisa las clases confundidas.');
 images.example='Una fruta aporta cuatro características medidas. Una prenda aporta 784 píxeles y requiere diez salidas. Una fotografía de 200 × 200 RGB aporta 120 000 valores y, en el ejemplo binario, una salida sigmoide. Las redes densas de estos cuadernos permiten entender el cálculo; una CNN agrega filtros que aprovechan la estructura espacial.';
 const render=CourseVisuals.render;
 // The resolved exercise now follows the network topic instead of the binary threshold.
 const section=CourseVisuals.section;
 CourseVisuals.section=(week,tab)=>week===3&&tab==='ejercicio'?CourseVisuals.render(3,LESSONS[3].findIndex(s=>s.title==='Neuronas, capas y activaciones')):section(week,tab);
 CourseVisuals.render=(week,index)=>{
  const base=render(week,index);
  if(week!==3)return base;
  const title=LESSONS[3][index].title;
  if(title==='Neuronas, capas y activaciones')return base+'<div class="callout"><a href="#semana-3/practica">Simular la red de frutas: cambiar características, observar activaciones y recorrer épocas</a></div>';
  if(title==='Clasificación de imágenes')return base+'<div class="callout"><a href="#semana-3/practica">Ver imágenes reales y predicciones de Fashion-MNIST y dígitos</a></div><figure><img src="assets/badge3/5-ejemplo.png" alt="Visualización original de prendas del cuaderno Fashion-MNIST ampliado" style="max-width:100%;height:auto" loading="lazy"><figcaption>Figura original del cuaderno 5. La práctica interactiva permite inspeccionar prendas individuales y sus probabilidades.</figcaption></figure>';
  return base;
 };
})();
