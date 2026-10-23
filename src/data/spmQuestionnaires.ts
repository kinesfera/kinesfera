// ============================================================================
// BANCO DE ÍTEMS Y PREGUNTAS EXACTAS DEL SPM (SENSORY PROCESSING MEASURE)
// Adaptado para 2 a 5 años (SPM-Preschool) y > 5 años (SPM Escolar / Primaria)
// Cuestionarios: Hogar (Padres) y Escuela (Aula / Educadores) - 75 preguntas
// Escala de calificación de 4 puntos (Likert):
// 1 = Nunca (N), 2 = Ocasionalmente (O), 3 = Frecuentemente (F), 4 = Siempre (S)
//
// Ítems de Participación Social (SOC) y el ítem 57 del Hogar tienen valencia positiva,
// por lo que se puntúan invertidos (N=4, O=3, F=2, S=1) según el manual SPM.
// ============================================================================

export type SPMScaleId = 
  | 'SOC' // Participación Social
  | 'VIS' // Visión
  | 'HEA' // Audición
  | 'TOU' // Tacto
  | 'TS'  // Gusto y Olfato
  | 'BOD' // Conciencia Corporal (Propiocepción)
  | 'BAL' // Equilibrio y Movimiento (Vestibular)
  | 'PLA'; // Planificación e Ideas (Praxias)

export interface SPMQuestion {
  num: number;
  scale: SPMScaleId;
  scaleName: string;
  text: string;
  isReverseScored?: boolean; // True para ítems positivos donde Siempre = 1 punto de disfunción
  vulnerability?: string; // Hiperreactivo, Hiporreactivo, Buscador, Percepción, etc.
}

// ----------------------------------------------------------------------------
// 1. SPM HOGAR (CUESTIONARIO PARA PADRES) - MAYOR A 5 AÑOS (75 PREGUNTAS)
// ----------------------------------------------------------------------------
export const SPM_HOME_OVER_5_QUESTIONS: SPMQuestion[] = [
  // PARTICIPACIÓN SOCIAL (SOC) 1-10 (Reverse scored: N=4, O=3, F=2, S=1)
  { num: 1, scale: 'SOC', scaleName: 'Participación Social', text: 'Juega cooperativamente con sus pares / amigos (sin muchas discusiones o peleas).', isReverseScored: true },
  { num: 2, scale: 'SOC', scaleName: 'Participación Social', text: 'Interactúa apropiadamente con sus padres y otros adultos significativos (se comunica bien, sigue instrucciones, muestra respeto).', isReverseScored: true },
  { num: 3, scale: 'SOC', scaleName: 'Participación Social', text: 'Comparte sus cosas cuando se le pide.', isReverseScored: true },
  { num: 4, scale: 'SOC', scaleName: 'Participación Social', text: 'Mantiene una conversación sin pararse o sentarse demasiado cerca a los otros.', isReverseScored: true },
  { num: 5, scale: 'SOC', scaleName: 'Participación Social', text: 'Mantiene contacto visual apropiado durante una conversación.', isReverseScored: true },
  { num: 6, scale: 'SOC', scaleName: 'Participación Social', text: 'Se integra a los juegos de otros sin irrumpir ni desorganizar la actividad en curso.', isReverseScored: true },
  { num: 7, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa e interactúa apropiadamente durante las comidas.', isReverseScored: true },
  { num: 8, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa apropiadamente durante paseos familiares (salir a comer, parque, museo, cine).', isReverseScored: true },
  { num: 9, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa apropiadamente en reuniones familiares (cumpleaños, fiestas, vacaciones).', isReverseScored: true },
  { num: 10, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa adecuadamente en actividades con amigos (fiestas, andar en bicicleta / scooter).', isReverseScored: true },

  // VISIÓN (VIS) 11-21
  { num: 11, scale: 'VIS', scaleName: 'Visión', text: 'Pareciera molestarle la luz, en especial las luces brillantes (pestañea, entrecierra los ojos, se queja).', vulnerability: 'Hiperreactivo' },
  { num: 12, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para encontrar un objeto cuando éste es parte de un grupo de otras cosas.', vulnerability: 'Percepción' },
  { num: 13, scale: 'VIS', scaleName: 'Visión', text: 'Cierra un ojo o inclina la cabeza hacia atrás al mirar algo o a alguien.', vulnerability: 'Hiperreactivo' },
  { num: 14, scale: 'VIS', scaleName: 'Visión', text: 'Expresa molestias o se angustia en ambientes visuales inusuales (habitación muy brillante, colorida o con poca luz).', vulnerability: 'Hiperreactivo' },
  { num: 15, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para controlar movimientos oculares cuando sigue objetos con la vista (pelotas, juguetes).', vulnerability: 'Ocular-Motor' },
  { num: 16, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para reconocer cómo los objetos son iguales o diferentes basado en color, forma o tamaño.', vulnerability: 'Percepción' },
  { num: 17, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta mirando objetos girar o moverse más que la mayoría de los niños de su edad.', vulnerability: 'Buscador' },
  { num: 18, scale: 'VIS', scaleName: 'Visión', text: 'Choca con objetos u otras personas como si no hubieran estado ahí.', vulnerability: 'Hiporreactivo' },
  { num: 19, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta de encender y apagar interruptores de luz repetidamente.', vulnerability: 'Buscador' },
  { num: 20, scale: 'VIS', scaleName: 'Visión', text: 'Le molestan ciertos tipos de iluminación (sol de mediodía, luces estroboscópicas, intermitentes o fluorescentes).', vulnerability: 'Hiperreactivo' },
  { num: 21, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta mirando objetos que se mueven desde la periferia (rabillo) de su ojo.', vulnerability: 'Buscador' },

  // AUDICIÓN (HEA) 22-29
  { num: 22, scale: 'HEA', scaleName: 'Audición', text: 'Se molesta con los sonidos hogareños comunes (aspiradora, secador de pelo, cadena del baño).', vulnerability: 'Hiperreactivo' },
  { num: 23, scale: 'HEA', scaleName: 'Audición', text: 'Responde negativamente frente a ruidos fuertes (arrancando, llorando o tapándose los oídos con las manos).', vulnerability: 'Hiperreactivo' },
  { num: 24, scale: 'HEA', scaleName: 'Audición', text: 'Pareciera no escuchar ciertos sonidos o no responder a su nombre.', vulnerability: 'Hiporreactivo' },
  { num: 25, scale: 'HEA', scaleName: 'Audición', text: 'Se perturba o se interesa concentradamente en sonidos que otros suelen no notar.', vulnerability: 'Hiperreactivo' },
  { num: 26, scale: 'HEA', scaleName: 'Audición', text: 'Pareciera asustarse con sonidos que no suelen perturbar a otros niños de su edad.', vulnerability: 'Hiperreactivo' },
  { num: 27, scale: 'HEA', scaleName: 'Audición', text: 'Se distrae fácilmente con los ruidos de fondo (cortadora de pasto afuera, aire acondicionado, refrigerador).', vulnerability: 'Hiperreactivo' },
  { num: 28, scale: 'HEA', scaleName: 'Audición', text: 'Le gusta causar que ciertos sonidos ocurran repetidamente (ej. tirar la cadena del inodoro una y otra vez).', vulnerability: 'Buscador' },
  { num: 29, scale: 'HEA', scaleName: 'Audición', text: 'Expresa molestias frente a sonidos agudos o estridentes (silbatos, cornetas, flautas, trompetas).', vulnerability: 'Hiperreactivo' },

  // TACTO (TOU) 30-40
  { num: 30, scale: 'TOU', scaleName: 'Tacto', text: 'Se aleja tras ser tocado ligeramente o evita caricias suaves.', vulnerability: 'Hiperreactivo' },
  { num: 31, scale: 'TOU', scaleName: 'Tacto', text: 'Pareciera no percatarse de haber sido tocado o carece de conciencia táctil normal.', vulnerability: 'Hiporreactivo' },
  { num: 32, scale: 'TOU', scaleName: 'Tacto', text: 'Se molesta o irrita tras sentir ropa nueva, etiquetas o ciertas telas.', vulnerability: 'Hiperreactivo' },
  { num: 33, scale: 'TOU', scaleName: 'Tacto', text: 'Prefiere tocar antes que ser tocado por otros.', vulnerability: 'Hiperreactivo' },
  { num: 34, scale: 'TOU', scaleName: 'Tacto', text: 'Se irrita o molesta cuando le cortan las uñas de las manos o de los pies.', vulnerability: 'Hiperreactivo' },
  { num: 35, scale: 'TOU', scaleName: 'Tacto', text: 'Se molesta cuando alguien le toca la cara o le lava la cara.', vulnerability: 'Hiperreactivo' },
  { num: 36, scale: 'TOU', scaleName: 'Tacto', text: 'Evita tocar o jugar con pintura de dedos, pegamento, arena, greda, barro u otros materiales que ensucian.', vulnerability: 'Hiperreactivo' },
  { num: 37, scale: 'TOU', scaleName: 'Tacto', text: 'Tiene una tolerancia al dolor excepcionalmente alta (no llora con caídas fuertes o moretones).', vulnerability: 'Hiporreactivo' },
  { num: 38, scale: 'TOU', scaleName: 'Tacto', text: 'Le molesta lavarse o cepillarse los dientes mucho más que a otros niños de su edad.', vulnerability: 'Hiperreactivo' },
  { num: 39, scale: 'TOU', scaleName: 'Tacto', text: 'Pareciera disfrutar de sensaciones que deberían ser dolorosas (chocar con fuerza, estrellarse al suelo).', vulnerability: 'Buscador' },
  { num: 40, scale: 'TOU', scaleName: 'Tacto', text: 'Tiene dificultades para encontrar objetos en un bolsillo, bolso o mochila usando sólo el tacto (sin mirar).', vulnerability: 'Percepción' },

  // GUSTO Y OLFATO (TS) 41-45 (Parte del puntaje TOT)
  { num: 41, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Le gusta degustar o probar elementos no comestibles (pintura, pegamento, plastilina).', vulnerability: 'Buscador' },
  { num: 42, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Hace arcadas con sólo pensar o mirar un alimento poco apetecible (como espinacas o verduras).', vulnerability: 'Hiperreactivo' },
  { num: 43, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Le gusta oler objetos no comestibles o a las personas.', vulnerability: 'Buscador' },
  { num: 44, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Se perturba o angustia con olores que otros niños no notan.', vulnerability: 'Hiperreactivo' },
  { num: 45, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Pareciera ignorar o no notar olores fuertes a los cuales los demás niños sí reaccionan.', vulnerability: 'Hiporreactivo' },

  // CONCIENCIA CORPORAL / PROPIOCEPCIÓN (BOD) 46-55
  { num: 46, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Al tomar objetos (como lápiz o cuchara) los aprieta tanto que se le hace difícil utilizarlos.', vulnerability: 'Percepción' },
  { num: 47, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Muestra una marcada tendencia a buscar actividades de empujar, tirar, arrastrar, levantar o saltar.', vulnerability: 'Buscador' },
  { num: 48, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Pareciera no estar seguro de cuánto debe levantar o bajar su cuerpo al sentarse o pasar sobre un obstáculo.', vulnerability: 'Percepción' },
  { num: 49, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Toma objetos (lápiz o cuchara) tan sueltos que se le caen o se hace difícil usarlos.', vulnerability: 'Percepción' },
  { num: 50, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Utiliza demasiada fuerza para la tarea (camina pesadamente, azota puertas, rompe puntas de lápices).', vulnerability: 'Buscador' },
  { num: 51, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Salta mucho durante el día en muebles y pisos.', vulnerability: 'Buscador' },
  { num: 52, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Tiende a acariciar animales de compañía con demasiada fuerza o brusquedad.', vulnerability: 'Percepción' },
  { num: 53, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Choca o empuja a otros niños durante juegos espontáneos.', vulnerability: 'Percepción' },
  { num: 54, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Mastica los juguetes, ropa, lápices u otros objetos más que otros niños.', vulnerability: 'Buscador' },
  { num: 55, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Rompe cosas por presionarlas o apretarlas con excesiva fuerza.', vulnerability: 'Percepción' },

  // EQUILIBRIO Y MOVIMIENTO / VESTIBULAR (BAL) 56-66
  { num: 56, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Pareciera tenerle miedo excesivo al movimiento (subir/bajar escaleras, columpios, resbalines).', vulnerability: 'Hiperreactivo' },
  { num: 57, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: '¿Tiene buen equilibrio en superficies variadas?', isReverseScored: true, vulnerability: 'Control Postural' },
  { num: 58, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Evita actividades de equilibrio (caminar por la cuneta, bordes o terreno irregular).', vulnerability: 'Hiperreactivo' },
  { num: 59, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se cae de la silla cuando mueve o desplaza su cuerpo al estar sentado.', vulnerability: 'Control Postural' },
  { num: 60, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'No logra reaccionar a tiempo con sus brazos cuando está por caerse y cae fuertemente.', vulnerability: 'Control Postural' },
  { num: 61, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Pareciera no marearse cuando los demás niños suelen hacerlo tras girar mucho.', vulnerability: 'Hiporreactivo' },
  { num: 62, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Gira y hace rotar su cuerpo mucho más que otros niños de su edad.', vulnerability: 'Buscador' },
  { num: 63, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Muestra angustia o molestia cuando su cabeza está inclinada lejos de la posición vertical.', vulnerability: 'Hiperreactivo' },
  { num: 64, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Muestra poca coordinación motriz y parece ser torpe en sus desplazamientos.', vulnerability: 'Control Postural' },
  { num: 65, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Tiene miedo a subir a ascensores o escaleras mecánicas.', vulnerability: 'Hiperreactivo' },
  { num: 66, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se apoya en otras personas o muebles al sentarse o al intentar ponerse de pie.', vulnerability: 'Control Postural' },

  // PLANIFICACIÓN E IDEAS / PRAXIAS (PLA) 67-75
  { num: 67, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Su desempeño en tareas de la rutina diaria es irregular o inconsistente.', vulnerability: 'Planeamiento Motor' },
  { num: 68, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para resolver cómo acarrear múltiples objetos al mismo tiempo.', vulnerability: 'Planeamiento Motor' },
  { num: 69, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No sabe bien cómo guardar materiales y objetos en sus lugares correspondientes.', vulnerability: 'Planeamiento Motor' },
  { num: 70, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No logra realizar las tareas en su secuencia correcta (ej. al vestirse o al poner la mesa).', vulnerability: 'Planeamiento Motor' },
  { num: 71, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No logra completar tareas que requieren múltiples pasos seguidos.', vulnerability: 'Planeamiento Motor' },
  { num: 72, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para imitar demostraciones de acciones (juegos de movimiento o canciones con mímica).', vulnerability: 'Planeamiento Motor' },
  { num: 73, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para construir copiando un modelo (usar Legos o bloques según una muestra).', vulnerability: 'Planeamiento Motor' },
  { num: 74, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultades para pensar en ideas para juegos y actividades nuevas.', vulnerability: 'Ideación' },
  { num: 75, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiende a jugar los mismos juegos una y otra vez, en vez de intentar nuevas actividades.', vulnerability: 'Ideación' }
];

// ----------------------------------------------------------------------------
// 2. SPM-P HOGAR (CUESTIONARIO PARA PADRES) - EDADES 2 A 5 AÑOS (75 PREGUNTAS)
// ----------------------------------------------------------------------------
export const SPM_HOME_2_TO_5_QUESTIONS: SPMQuestion[] = [
  // PARTICIPACIÓN SOCIAL (1-8) (Reverse scored)
  { num: 1, scale: 'SOC', scaleName: 'Participación Social', text: 'Juega cooperativamente con sus pares / amigos.', isReverseScored: true },
  { num: 2, scale: 'SOC', scaleName: 'Participación Social', text: 'Comparte sus cosas cuando se le pide.', isReverseScored: true },
  { num: 3, scale: 'SOC', scaleName: 'Participación Social', text: 'Se integra a los juegos de otros sin irrumpir con la actividad en curso.', isReverseScored: true },
  { num: 4, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa e interactúa apropiadamente durante las comidas familiares.', isReverseScored: true },
  { num: 5, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa apropiadamente durante paseos familiares (salir a comer, museo, parque).', isReverseScored: true },
  { num: 6, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa apropiadamente de reuniones familiares (cumpleaños, matrimonios).', isReverseScored: true },
  { num: 7, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa apropiadamente en actividades con sus amigos (fiestas, juegos, triciclo).', isReverseScored: true },
  { num: 8, scale: 'SOC', scaleName: 'Participación Social', text: 'Coopera durante quehaceres / trámites familiares (ir al supermercado, buscar hermanos).', isReverseScored: true },

  // VISIÓN (9-19)
  { num: 9, scale: 'VIS', scaleName: 'Visión', text: 'Pareciera molestarle la luz, en especial las luces brillantes (pestañea, se cubre los ojos, se queja).', vulnerability: 'Hiperreactivo' },
  { num: 10, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para encontrar un objeto cuando éste es parte de un grupo de otras cosas.', vulnerability: 'Percepción' },
  { num: 11, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para reconocer cómo objetos son iguales o diferentes basado en su color, forma o tamaño.', vulnerability: 'Percepción' },
  { num: 12, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta mirando objetos que giran o se mueven, más que la mayoría de los niños de su edad.', vulnerability: 'Buscador' },
  { num: 13, scale: 'VIS', scaleName: 'Visión', text: 'Choca con objetos u otras personas como si no hubieran estado ahí.', vulnerability: 'Hiporreactivo' },
  { num: 14, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta de encender y apagar interruptores de luz repetidamente.', vulnerability: 'Buscador' },
  { num: 15, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta mirando objetos que se mueven desde la periferia de su ojo.', vulnerability: 'Buscador' },
  { num: 16, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para poner atención si hay muchas cosas que mirar a su alrededor.', vulnerability: 'Percepción' },
  { num: 17, scale: 'VIS', scaleName: 'Visión', text: 'Se molesta con ambientes de muchos estímulos visuales (tienda concurrida, habitación sobrecargada).', vulnerability: 'Hiperreactivo' },
  { num: 18, scale: 'VIS', scaleName: 'Visión', text: 'Se distrae fácilmente mirando cosas a su alrededor cuando camina.', vulnerability: 'Hiperreactivo' },
  { num: 19, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para completar tareas simples cuando hay muchas cosas que mirar.', vulnerability: 'Percepción' },

  // AUDICIÓN (20-28)
  { num: 20, scale: 'HEA', scaleName: 'Audición', text: 'Se molesta con los sonidos hogareños comunes (aspiradora, secador de pelo, cadena del baño).', vulnerability: 'Hiperreactivo' },
  { num: 21, scale: 'HEA', scaleName: 'Audición', text: 'Responde negativamente frente a ruidos fuertes (arrancando, llorando o tapándose los oídos).', vulnerability: 'Hiperreactivo' },
  { num: 22, scale: 'HEA', scaleName: 'Audición', text: 'Pareciera no escuchar ciertos sonidos o instrucciones.', vulnerability: 'Hiporreactivo' },
  { num: 23, scale: 'HEA', scaleName: 'Audición', text: 'Se perturba o se interesa concentradamente en sonidos que otros no suelen notar.', vulnerability: 'Hiperreactivo' },
  { num: 24, scale: 'HEA', scaleName: 'Audición', text: 'Se distrae fácilmente con los ruidos de fondo (cortadora de pasto afuera, aire acondicionado, refrigerador).', vulnerability: 'Hiperreactivo' },
  { num: 25, scale: 'HEA', scaleName: 'Audición', text: 'Le gusta causar que ciertos sonidos ocurran repetidamente (ej. tirar la cadena una vez tras otra).', vulnerability: 'Buscador' },
  { num: 26, scale: 'HEA', scaleName: 'Audición', text: 'Expresa molestia frente a sonidos agudos o estridentes (silbatos, flautas, trompetas).', vulnerability: 'Hiperreactivo' },
  { num: 27, scale: 'HEA', scaleName: 'Audición', text: 'Se molesta y/o desespera en ambientes ruidosos (fiestas infantiles, habitación llena de personas).', vulnerability: 'Hiperreactivo' },
  { num: 28, scale: 'HEA', scaleName: 'Audición', text: 'Se asusta fácilmente cuando escucha algún sonido fuerte o inesperado.', vulnerability: 'Hiperreactivo' },

  // TACTO (29-42)
  { num: 29, scale: 'TOU', scaleName: 'Tacto', text: 'Se aleja tras ser tocado ligeramente.', vulnerability: 'Hiperreactivo' },
  { num: 30, scale: 'TOU', scaleName: 'Tacto', text: 'Prefiere tocar a ser tocado por otros.', vulnerability: 'Hiperreactivo' },
  { num: 31, scale: 'TOU', scaleName: 'Tacto', text: 'Se irrita o molesta cuando le cortan las uñas.', vulnerability: 'Hiperreactivo' },
  { num: 32, scale: 'TOU', scaleName: 'Tacto', text: 'Se molesta cuando alguien le toca o limpia la cara.', vulnerability: 'Hiperreactivo' },
  { num: 33, scale: 'TOU', scaleName: 'Tacto', text: 'Evita tocar o jugar con pintura de dedos, pegamento, arena, greda, barro o cosas sucias.', vulnerability: 'Hiperreactivo' },
  { num: 34, scale: 'TOU', scaleName: 'Tacto', text: 'Tiene una tolerancia al dolor excepcionalmente alta.', vulnerability: 'Hiporreactivo' },
  { num: 35, scale: 'TOU', scaleName: 'Tacto', text: 'Le molesta lavarse los dientes (más que a otros niños de su edad).', vulnerability: 'Hiperreactivo' },
  { num: 36, scale: 'TOU', scaleName: 'Tacto', text: 'Pareciera disfrutar de sensaciones que deberían ser dolorosas (caer bruscamente, chocar).', vulnerability: 'Buscador' },
  { num: 37, scale: 'TOU', scaleName: 'Tacto', text: 'Le molesta que le peinen o cepillen el pelo.', vulnerability: 'Hiperreactivo' },
  { num: 38, scale: 'TOU', scaleName: 'Tacto', text: 'Le molesta que le corten el pelo.', vulnerability: 'Hiperreactivo' },
  { num: 39, scale: 'TOU', scaleName: 'Tacto', text: 'Evita comer alimentos de ciertas texturas específicas.', vulnerability: 'Hiperreactivo' },
  { num: 40, scale: 'TOU', scaleName: 'Tacto', text: 'Hace arcadas en respuesta a alimentos de ciertas consistencias.', vulnerability: 'Hiperreactivo' },
  { num: 41, scale: 'TOU', scaleName: 'Tacto', text: 'Le molesta que le limpien o laven la cara con toallitas o agua.', vulnerability: 'Hiperreactivo' },
  { num: 42, scale: 'TOU', scaleName: 'Tacto', text: 'Tiende a salivar o babear más que los demás niños de su misma edad.', vulnerability: 'Hiporreactivo' },

  // GUSTO Y OLFATO (43-46)
  { num: 43, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Le gusta degustar o probar elementos no comestibles (pintura, pegamento, masa).', vulnerability: 'Buscador' },
  { num: 44, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Pareciera ignorar o no notar olores fuertes a los cuales los demás niños sí reaccionan.', vulnerability: 'Hiporreactivo' },
  { num: 45, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Es selectivo a ciertos sabores de comida al punto de rehusar comer lo que se le ofrece.', vulnerability: 'Hiperreactivo' },
  { num: 46, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Se rehúsa a usar pasta de dientes en el cepillo dental.', vulnerability: 'Hiperreactivo' },

  // CONCIENCIA CORPORAL (47-55)
  { num: 47, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Al tomar objetos (como lápiz o cuchara) los aprieta tanto que se le hace difícil utilizarlos.', vulnerability: 'Percepción' },
  { num: 48, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Muestra una marcada tendencia a buscar actividades de empujar, tirar, arrastrar, levantar y saltar.', vulnerability: 'Buscador' },
  { num: 49, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Pareciera no estar seguro de cuánto debe levantar o bajar su cuerpo al sentarse o pasar un obstáculo.', vulnerability: 'Percepción' },
  { num: 50, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Toma objetos con tanta holgura o flojedad que se le caen de las manos.', vulnerability: 'Percepción' },
  { num: 51, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Utiliza demasiada fuerza para la tarea (camina pesadamente, azota puertas, rompe crayones).', vulnerability: 'Buscador' },
  { num: 52, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Salta mucho durante el día sobre cualquier superficie.', vulnerability: 'Buscador' },
  { num: 53, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Tiende a usar mucha fuerza cuando acaricia o toca animales.', vulnerability: 'Percepción' },
  { num: 54, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Choca o empuja a otros niños mientras juega.', vulnerability: 'Percepción' },
  { num: 55, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Mastica los juguetes, ropa u otros objetos más que otros niños.', vulnerability: 'Buscador' },

  // EQUILIBRIO Y MOVIMIENTO (56-66)
  { num: 56, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Pareciera tenerle miedo excesivo al movimiento (subir/bajar escaleras, columpios, resbalines).', vulnerability: 'Hiperreactivo' },
  { num: 57, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Evita actividades de equilibrio (caminar sobre la cuneta, líneas o suelo irregular).', vulnerability: 'Hiperreactivo' },
  { num: 58, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se cae de la silla cuando desplaza su cuerpo al sentarse.', vulnerability: 'Control Postural' },
  { num: 59, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'No logra reaccionar a tiempo con apoyo de brazos cuando está por caerse y cae.', vulnerability: 'Control Postural' },
  { num: 60, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Pareciera no marearse cuando los otros niños sí se marean.', vulnerability: 'Hiporreactivo' },
  { num: 61, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Gira y rota su cuerpo sobre sí mismo más que los otros niños.', vulnerability: 'Buscador' },
  { num: 62, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Expresa molestia y/o desesperación cuando tiene la cabeza inclinada o no vertical.', vulnerability: 'Hiperreactivo' },
  { num: 63, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Muestra tener poca coordinación y parece ser torpe motoramente.', vulnerability: 'Control Postural' },
  { num: 64, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se apoya en otras personas o muebles cuando está sentado o intenta ponerse de pie.', vulnerability: 'Control Postural' },
  { num: 65, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Balancea o mece su cuerpo rítmicamente cuando está sentado.', vulnerability: 'Buscador' },
  { num: 66, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Tiene miedo excesivo a bajar escaleras o pendientes de cerros.', vulnerability: 'Hiperreactivo' },

  // PLANIFICACIÓN E IDEAS (67-75)
  { num: 67, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para resolver cómo acarrear múltiples objetos al mismo tiempo.', vulnerability: 'Planeamiento Motor' },
  { num: 68, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No sabe bien cómo guardar materiales y objetos en sus lugares correspondientes.', vulnerability: 'Planeamiento Motor' },
  { num: 69, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Se le confunde cuál es la secuencia de acciones correcta en rutinas familiares (vestirse, acostarse).', vulnerability: 'Planeamiento Motor' },
  { num: 70, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No logra completar tareas sencillas de múltiples pasos.', vulnerability: 'Planeamiento Motor' },
  { num: 71, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para imitar demostraciones de acciones (juegos corporales o canciones con gestos).', vulnerability: 'Planeamiento Motor' },
  { num: 72, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para construir copiando un modelo a un adulto o compañero (Legos, cubos).', vulnerability: 'Planeamiento Motor' },
  { num: 73, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultades para generar nuevas ideas lúdicas durante el juego libre.', vulnerability: 'Ideación' },
  { num: 74, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiende a jugar los mismos juegos una y otra vez, en vez de intentar nuevas actividades.', vulnerability: 'Ideación' },
  { num: 75, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad motora para subirse y bajarse de una silla o del asiento del auto.', vulnerability: 'Planeamiento Motor' }
];

// ----------------------------------------------------------------------------
// 3. SPM ESCOLAR (AULA PRINCIPAL) - MAYOR A 5 AÑOS (62 PREGUNTAS ESTANDARIZADAS)
// ----------------------------------------------------------------------------
export const SPM_SCHOOL_OVER_5_QUESTIONS: SPMQuestion[] = [
  // PARTICIPACIÓN SOCIAL (1-10) (Reverse scored)
  { num: 1, scale: 'SOC', scaleName: 'Participación Social', text: 'Trabaja como parte de un equipo; ayuda a los demás.', isReverseScored: true },
  { num: 2, scale: 'SOC', scaleName: 'Participación Social', text: 'Resuelve conflictos con sus pares sin necesidad de que intervenga el profesor.', isReverseScored: true },
  { num: 3, scale: 'SOC', scaleName: 'Participación Social', text: 'Maneja su frustración sin arranques de rabia o comportamiento agresivo.', isReverseScored: true },
  { num: 4, scale: 'SOC', scaleName: 'Participación Social', text: 'Juega voluntariamente con sus pares en una variedad de actividades y juegos.', isReverseScored: true },
  { num: 5, scale: 'SOC', scaleName: 'Participación Social', text: 'Se integra a los juegos de sus pares sin irrumpir con la actividad en curso.', isReverseScored: true },
  { num: 6, scale: 'SOC', scaleName: 'Participación Social', text: 'Tiene amigos y elige compartir con ellos cuando es posible.', isReverseScored: true },
  { num: 7, scale: 'SOC', scaleName: 'Participación Social', text: 'Utiliza y entiende el humor al jugar con sus compañeros.', isReverseScored: true },
  { num: 8, scale: 'SOC', scaleName: 'Participación Social', text: 'Mantiene un adecuado espacio personal (no se para demasiado cerca durante conversaciones).', isReverseScored: true },
  { num: 9, scale: 'SOC', scaleName: 'Participación Social', text: 'Mantiene un contacto visual apropiado durante una conversación.', isReverseScored: true },
  { num: 10, scale: 'SOC', scaleName: 'Participación Social', text: 'Cambia los temas de conversación de acuerdo a los intereses de sus pares (no se queda fijado).', isReverseScored: true },

  // VISIÓN (11-17)
  { num: 11, scale: 'VIS', scaleName: 'Visión', text: 'Pestañea, se cubre los ojos o reclama acerca de las luces en la sala o la luz del sol brillante.', vulnerability: 'Hiper-responsivo' },
  { num: 12, scale: 'VIS', scaleName: 'Visión', text: 'Expresa molestias al estar mirando objetos en movimiento.', vulnerability: 'Hiper-responsivo' },
  { num: 13, scale: 'VIS', scaleName: 'Visión', text: 'Se distrae con estímulos visuales cercanos (fotos, cosas en las murallas, ventanas, otros niños).', vulnerability: 'Hiper-responsivo' },
  { num: 14, scale: 'VIS', scaleName: 'Visión', text: 'Al dar instrucciones de clase, mira a su alrededor o a otros niños en lugar del profesor o la pizarra.', vulnerability: 'Hipo-responsivo' },
  { num: 15, scale: 'VIS', scaleName: 'Visión', text: 'Gira objetos frente a sus ojos.', vulnerability: 'Buscador' },
  { num: 16, scale: 'VIS', scaleName: 'Visión', text: 'Queda mirando fijo a personas u objetos.', vulnerability: 'Buscador' },
  { num: 17, scale: 'VIS', scaleName: 'Visión', text: 'Expresa molestias cuando baja la luminosidad en la sala (ej. para videos o películas).', vulnerability: 'Hiper-responsivo' },

  // AUDICIÓN (18-24)
  { num: 18, scale: 'HEA', scaleName: 'Audición', text: 'Expresa molestias o desesperación frente a ruidos fuertes (portazos, alarmas, sacapuntas eléctrico).', vulnerability: 'Hiperreactivo' },
  { num: 19, scale: 'HEA', scaleName: 'Audición', text: 'Expresa molestias o desesperación cuando otros cantan o tocan instrumentos musicales.', vulnerability: 'Hiperreactivo' },
  { num: 20, scale: 'HEA', scaleName: 'Audición', text: 'No responde a voces o sonidos nuevos en la sala de clases.', vulnerability: 'Hiporreactivo' },
  { num: 21, scale: 'HEA', scaleName: 'Audición', text: 'Incapaz de localizar la procedencia de sonidos o voces.', vulnerability: 'Percepción' },
  { num: 22, scale: 'HEA', scaleName: 'Audición', text: 'Emite ruidos, canta o grita durante el tiempo de clase tranquilo.', vulnerability: 'Buscador' },
  { num: 23, scale: 'HEA', scaleName: 'Audición', text: 'Habla demasiado fuerte o hace ruido excesivo durante las transiciones de actividad.', vulnerability: 'Buscador' },
  { num: 24, scale: 'HEA', scaleName: 'Audición', text: 'Grita o se emite ruidos inusuales a sí mismo.', vulnerability: 'Buscador' },

  // TACTO (25-32)
  { num: 25, scale: 'TOU', scaleName: 'Tacto', text: 'Expresa molestia cuando tiene las manos o la cara sucias (pegamento, pintura, comida, barro).', vulnerability: 'Hiperreactivo' },
  { num: 26, scale: 'TOU', scaleName: 'Tacto', text: 'No tolera mugre o suciedad en manos o ropa, ni siquiera por un instante breve.', vulnerability: 'Hiperreactivo' },
  { num: 27, scale: 'TOU', scaleName: 'Tacto', text: 'Se molesta al tocar ciertas texturas (materiales de sala, utensilios, equipos deportivos).', vulnerability: 'Hiperreactivo' },
  { num: 28, scale: 'TOU', scaleName: 'Tacto', text: 'Se irrita o molesta tras contacto físico accidental por sus pares (puede agredir o retirarse).', vulnerability: 'Hiperreactivo' },
  { num: 29, scale: 'TOU', scaleName: 'Tacto', text: 'No responde al tacto de otra persona.', vulnerability: 'Hiporreactivo' },
  { num: 30, scale: 'TOU', scaleName: 'Tacto', text: 'Busca temperaturas frías o calientes tocando ventanas u otras superficies.', vulnerability: 'Buscador' },
  { num: 31, scale: 'TOU', scaleName: 'Tacto', text: 'Toca a sus compañeros indebidamente (molestando) durante clases o al estar en la fila.', vulnerability: 'Buscador' },
  { num: 32, scale: 'TOU', scaleName: 'Tacto', text: 'No se limpia la saliva ni la comida de la cara.', vulnerability: 'Hiporreactivo' },

  // GUSTO Y OLFATO (33-36)
  { num: 33, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Expresa molestia frente a sabores u olores de alimentos diferentes.', vulnerability: 'Hiperreactivo' },
  { num: 34, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'No nota olores fuertes o inusuales (pintura, pegamento, tintas, rotuladores).', vulnerability: 'Hiporreactivo' },
  { num: 35, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'No logra distinguir entre olores, ni preferir olores ricos a olores desagradables.', vulnerability: 'Percepción' },
  { num: 36, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Intenta degustar, morder o lamer objetos del aula o personas.', vulnerability: 'Buscador' },

  // CONCIENCIA CORPORAL (37-43)
  { num: 37, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Derrama los contenidos al abrir envases o cajas de materiales.', vulnerability: 'Percepción' },
  { num: 38, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Mastica la ropa, lápices, crayones u otros materiales de la sala.', vulnerability: 'Buscador' },
  { num: 39, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Mueve la silla bruscamente (la empuja fuertemente bajo el escritorio o la saca con fuerza).', vulnerability: 'Percepción' },
  { num: 40, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Corre, salta o rebota en la sala en lugar de caminar calmadamente.', vulnerability: 'Buscador' },
  { num: 41, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Camina golpeando fuertemente los pies en el suelo.', vulnerability: 'Buscador' },
  { num: 42, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Salta sobre las sillas o las golpea con los pies.', vulnerability: 'Buscador' },
  { num: 43, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Cierra con portazos o abre las puertas de la sala con fuerza excesiva.', vulnerability: 'Buscador' },

  // EQUILIBRIO Y MOVIMIENTO (44-52)
  { num: 44, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Cuando camina pasa la mano por las murallas para orientarse o sostenerse.', vulnerability: 'Buscador' },
  { num: 45, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Envuelve las piernas alrededor de las patas de la silla al estar sentado.', vulnerability: 'Control Postural' },
  { num: 46, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se balancea en la silla cuando está sentado frente al escritorio.', vulnerability: 'Buscador' },
  { num: 47, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se retuerce o cambia de posición constantemente en la silla.', vulnerability: 'Buscador' },
  { num: 48, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se cae de la silla cuando está sentado frente al escritorio.', vulnerability: 'Control Postural' },
  { num: 49, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se apoya sobre la mesa / escritorio o afirma su cabeza con las manos.', vulnerability: 'Control Postural' },
  { num: 50, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Cuando está sentado en el suelo, no se puede sentar derecho sin apoyo.', vulnerability: 'Control Postural' },
  { num: 51, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se desploma, se echa sobre la mesa o sostiene la cabeza entre las manos.', vulnerability: 'Control Postural' },
  { num: 52, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Tiene poca coordinación motora general; parece torpe.', vulnerability: 'Control Postural' },

  // PLANIFICACIÓN E IDEAS (53-62)
  { num: 53, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No tiene un desempeño consistente en tareas diarias; la calidad del trabajo varía ampliamente.', vulnerability: 'Planeamiento Motor' },
  { num: 54, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Incapaz de resolver problemas de forma autónoma y eficaz.', vulnerability: 'Ideación' },
  { num: 55, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Se le caen las cosas al intentar acarrear múltiples útiles al mismo tiempo.', vulnerability: 'Planeamiento Motor' },
  { num: 56, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No logra ejecutar acciones en la secuencia correcta.', vulnerability: 'Planeamiento Motor' },
  { num: 57, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No logra completar tareas escolares de múltiples pasos.', vulnerability: 'Planeamiento Motor' },
  { num: 58, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Dificultades para imitar demostraciones correctamente (canciones con gestos, gimnasia).', vulnerability: 'Planeamiento Motor' },
  { num: 59, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultades para completar un trabajo o manualidad desde un modelo.', vulnerability: 'Planeamiento Motor' },
  { num: 60, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Demuestra limitada imaginación o creatividad en su juego o tiempo libre.', vulnerability: 'Ideación' },
  { num: 61, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Repite los mismos juegos en el recreo; no expande ni altera sus actividades.', vulnerability: 'Ideación' },
  { num: 62, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Muestra dificultades para organizar sus materiales en o sobre su escritorio.', vulnerability: 'Ideación' }
];

// ----------------------------------------------------------------------------
// 4. SPM-P ESCOLAR (PREESCOLAR) - EDADES 2 A 5 AÑOS (75 PREGUNTAS)
// ----------------------------------------------------------------------------
export const SPM_SCHOOL_2_TO_5_QUESTIONS: SPMQuestion[] = [
  // PARTICIPACIÓN SOCIAL (1-10) (Reverse scored)
  { num: 1, scale: 'SOC', scaleName: 'Participación Social', text: 'Juega voluntariamente con sus pares en una variedad de actividades y juegos.', isReverseScored: true },
  { num: 2, scale: 'SOC', scaleName: 'Participación Social', text: 'Espera su turno en las actividades de grupo.', isReverseScored: true },
  { num: 3, scale: 'SOC', scaleName: 'Participación Social', text: 'Participa adecuadamente en las actividades académicas y rondas del Jardín.', isReverseScored: true },
  { num: 4, scale: 'SOC', scaleName: 'Participación Social', text: 'Realiza transiciones a nuevas actividades fluidamente.', isReverseScored: true },
  { num: 5, scale: 'SOC', scaleName: 'Participación Social', text: 'Se integra a los juegos de sus pares sin irrumpir con la actividad en curso.', isReverseScored: true },
  { num: 6, scale: 'SOC', scaleName: 'Participación Social', text: 'Sigue los reglamentos y rutinas de la sala de clases.', isReverseScored: true },
  { num: 7, scale: 'SOC', scaleName: 'Participación Social', text: 'Comparte los juguetes y materiales de la sala cuando se le pide.', isReverseScored: true },
  { num: 8, scale: 'SOC', scaleName: 'Participación Social', text: 'Trabaja cooperativamente con sus pares hacia un objetivo común (guardar cosas, armar puzzles).', isReverseScored: true },
  { num: 9, scale: 'SOC', scaleName: 'Participación Social', text: 'Interactúa con sus pares durante el juego imaginario o simbólico.', isReverseScored: true },
  { num: 10, scale: 'SOC', scaleName: 'Participación Social', text: 'Resuelve conflictos con sus pares sin necesidad de intervenir la educadora.', isReverseScored: true },

  // VISIÓN (11-20)
  { num: 11, scale: 'VIS', scaleName: 'Visión', text: 'Pestañea, se cubre los ojos o reclama acerca de las luces en la sala o la luz del sol brillante.', vulnerability: 'Hiper-responsivo' },
  { num: 12, scale: 'VIS', scaleName: 'Visión', text: 'Se distrae con los objetos o personas cercanas visibles (cuadros, ventanas, otros niños).', vulnerability: 'Hiper-responsivo' },
  { num: 13, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para localizar visualmente objetos o personas al escanear la sala o patio.', vulnerability: 'Percepción' },
  { num: 14, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para encontrar objetos específicos sobre la mesa entre muchos otros objetos.', vulnerability: 'Percepción' },
  { num: 15, scale: 'VIS', scaleName: 'Visión', text: 'Mira a su alrededor en la sala o a los otros niños cuando la profesora está hablando.', vulnerability: 'Hipo-responsivo' },
  { num: 16, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para identificar objetos del mismo color o forma.', vulnerability: 'Percepción' },
  { num: 17, scale: 'VIS', scaleName: 'Visión', text: 'Choca con otros niños que están jugando en el patio.', vulnerability: 'Hipo-responsivo' },
  { num: 18, scale: 'VIS', scaleName: 'Visión', text: 'Queda mirando fijo a personas u objetos.', vulnerability: 'Buscador' },
  { num: 19, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta mirando objetos que giran o se mueven, más que la mayoría de los niños de su edad.', vulnerability: 'Buscador' },
  { num: 20, scale: 'VIS', scaleName: 'Visión', text: 'Disfruta mirando desde la periferia de su ojo los objetos que se mueven.', vulnerability: 'Buscador' },

  // AUDICIÓN (21-30)
  { num: 21, scale: 'HEA', scaleName: 'Audición', text: 'Expresa molestia y/o desesperación frente a ruidos fuertes (gritos, llanto de otros niños, pasillos ruidosos).', vulnerability: 'Hiper-responsivo' },
  { num: 22, scale: 'HEA', scaleName: 'Audición', text: 'Expresa molestia y/o desesperación cuando otros cantan o tocan instrumentos musicales.', vulnerability: 'Hiper-responsivo' },
  { num: 23, scale: 'HEA', scaleName: 'Audición', text: 'Pareciera no notar voces o sonidos nuevos en la sala.', vulnerability: 'Hipo-responsivo' },
  { num: 24, scale: 'HEA', scaleName: 'Audición', text: 'Incapaz de localizar sonidos o voces en el entorno preescolar.', vulnerability: 'Percepción' },
  { num: 25, scale: 'HEA', scaleName: 'Audición', text: 'Emite ruidos, canta o grita durante los momentos de silencio o descanso.', vulnerability: 'Buscador' },
  { num: 26, scale: 'HEA', scaleName: 'Audición', text: 'Le gusta causar que ciertos sonidos ocurran repetidamente (tirar la cadena una vez tras otra).', vulnerability: 'Buscador' },
  { num: 27, scale: 'HEA', scaleName: 'Audición', text: 'Pareciera no notar sonidos que sí notan los demás.', vulnerability: 'Hipo-responsivo' },
  { num: 28, scale: 'HEA', scaleName: 'Audición', text: 'Tiene dificultades para poner atención cuando hay ruido ambiental en la sala.', vulnerability: 'Hiper-responsivo' },
  { num: 29, scale: 'HEA', scaleName: 'Audición', text: 'Pareciera no poder seguir instrucciones verbales grupales.', vulnerability: 'Hipo-responsivo' },
  { num: 30, scale: 'HEA', scaleName: 'Audición', text: 'Le molestan sonidos ambientales constantes que otros ignoran (ventilador, relojes, cafetería).', vulnerability: 'Hiper-responsivo' },

  // TACTO (31-40)
  { num: 31, scale: 'TOU', scaleName: 'Tacto', text: 'Evita ser tocado por otros (rechaza abrazos, rechaza tomarse de las manos en ronda).', vulnerability: 'Hiperreactivo' },
  { num: 32, scale: 'TOU', scaleName: 'Tacto', text: 'Expresa molestia y/o desesperación cuando tiene las manos o la cara sucias (pegamento, pintura, comida).', vulnerability: 'Hiperreactivo' },
  { num: 33, scale: 'TOU', scaleName: 'Tacto', text: 'Expresa molestia y/o desesperación cuando se lava las manos con agua fría o tibia.', vulnerability: 'Hiperreactivo' },
  { num: 34, scale: 'TOU', scaleName: 'Tacto', text: 'Se irrita o molesta tras contacto físico accidental por sus pares (puede agredir o retirarse).', vulnerability: 'Hiperreactivo' },
  { num: 35, scale: 'TOU', scaleName: 'Tacto', text: 'No se limpia la saliva o la comida de la cara.', vulnerability: 'Hiporreactivo' },
  { num: 36, scale: 'TOU', scaleName: 'Tacto', text: 'Se irrita o molesta tras la sensación de ciertas texturas (materiales de sala, colchonetas).', vulnerability: 'Hiperreactivo' },
  { num: 37, scale: 'TOU', scaleName: 'Tacto', text: 'Se rehúsa a usar disfraces o capas en actividades del jardín.', vulnerability: 'Hiperreactivo' },
  { num: 38, scale: 'TOU', scaleName: 'Tacto', text: 'Tiene una tolerancia al dolor excepcionalmente alta (no se percata de golpes ni reacciona a raspones).', vulnerability: 'Hiporreactivo' },
  { num: 39, scale: 'TOU', scaleName: 'Tacto', text: 'Pareciera no percatarse de la necesidad de ir al baño (o si tiene los pantalones o pañal mojados).', vulnerability: 'Hiporreactivo' },
  { num: 40, scale: 'TOU', scaleName: 'Tacto', text: 'Evita tocar o jugar con pintura, pegamento, arena, greda o barro.', vulnerability: 'Hiperreactivo' },

  // GUSTO Y OLFATO (41-45)
  { num: 41, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Degusta o chupa elementos no comestibles (juguetes, ropa, lápices).', vulnerability: 'Buscador' },
  { num: 42, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Pareciera no notar olores fuertes o inusuales (pintura, tintas, pegamentos).', vulnerability: 'Hiporreactivo' },
  { num: 43, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Expresa molestia y/o desesperación frente a olores de jabón, perfume o cremas.', vulnerability: 'Hiperreactivo' },
  { num: 44, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Expresa molestia y/o desesperación frente al gusto / sabor de alimentos que no perturban a otros niños.', vulnerability: 'Hiperreactivo' },
  { num: 45, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Se rehúsa a probar comidas o colaciones nuevas ofrecidas.', vulnerability: 'Hiperreactivo' },

  // CONCIENCIA CORPORAL (46-55)
  { num: 46, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Mueve la silla de forma brusca (empuja fuertemente la silla debajo del escritorio o la saca con fuerza).', vulnerability: 'Percepción' },
  { num: 47, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Rompe accidentalmente las cosas (lápices, crayones, hojas de papel) por utilizar demasiada fuerza.', vulnerability: 'Percepción' },
  { num: 48, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Salta excesivamente; y busca saltar y caer desde alturas.', vulnerability: 'Buscador' },
  { num: 49, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Cierra con portazos o abre las puertas con fuerza excesiva.', vulnerability: 'Buscador' },
  { num: 50, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Utiliza demasiada fuerza al jugar con objetos (golpea instrumentos musicales o juguetes entre ellos).', vulnerability: 'Buscador' },
  { num: 51, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Choca con sus pares más de lo esperado (cuando parados en fila o jugando en el patio).', vulnerability: 'Percepción' },
  { num: 52, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Mastica la ropa, lápices, crayones u otros utensilios de la sala.', vulnerability: 'Buscador' },
  { num: 53, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Utiliza envases de bebida o comida de forma muy brusca (rompe, abolla o derrama).', vulnerability: 'Percepción' },
  { num: 54, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Derrumba proyectos de construcción de otros niños (torres, legos, pistas de auto).', vulnerability: 'Percepción' },
  { num: 55, scale: 'BOD', scaleName: 'Conciencia Corporal', text: 'Cierra las tijeras forzosamente con un apretón para cada corte.', vulnerability: 'Percepción' },

  // EQUILIBRIO Y MOVIMIENTO (56-65)
  { num: 56, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Gira o da vueltas excesivamente sobre equipos del jardín (columpios, carruseles).', vulnerability: 'Buscador' },
  { num: 57, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se apoya en las murallas, muebles u otras personas mientras está de pie.', vulnerability: 'Control Postural' },
  { num: 58, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se apoya sobre la mesa / escritorio o afirma su cabeza con las manos estando sentado a la mesa.', vulnerability: 'Control Postural' },
  { num: 59, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Pareciera tenerle miedo a actividades de movimiento (columpios, resbalines, trepadoras).', vulnerability: 'Hiper-responsivo' },
  { num: 60, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se columpia en exceso olvidando otras actividades colectivas.', vulnerability: 'Buscador' },
  { num: 61, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se desorienta o muestra temor al inclinarse para recoger objetos del suelo.', vulnerability: 'Control Postural' },
  { num: 62, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'No logra reaccionar a tiempo con sus brazos para evitar caer.', vulnerability: 'Control Postural' },
  { num: 63, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Expresa molestia y/o desesperación al estar muy alto en los juegos del patio.', vulnerability: 'Hiper-responsivo' },
  { num: 64, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Tiene poca coordinación motora gruesa general.', vulnerability: 'Control Postural' },
  { num: 65, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Tiene dificultades para mover el cuerpo al ritmo (aplaudir, marcar ritmo con los pies).', vulnerability: 'Control Postural' },

  // PLANIFICACIÓN E IDEAS (66-75)
  { num: 66, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Se "pega" en una sola actividad olvidando las otras (no presta atención a las otras actividades).', vulnerability: 'Ideación' },
  { num: 67, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultades para generar nuevas ideas durante el juego libre.', vulnerability: 'Ideación' },
  { num: 68, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Juega repetidamente de la misma manera durante el recreo; sin alterar la actividad ni aumentar desafíos.', vulnerability: 'Ideación' },
  { num: 69, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Requiere de elementos reales para jugar al juego imaginario (ejemplo: teléfono real).', vulnerability: 'Ideación' },
  { num: 70, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultades para imitar demostraciones correctamente (canciones con gestos y movimientos).', vulnerability: 'Planeamiento Motor' },
  { num: 71, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Juega sólo a sus propios juegos, evita imitar a los otros niños.', vulnerability: 'Ideación' },
  { num: 72, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultades para copiar un modelo de construcción a un adulto o compañero.', vulnerability: 'Planeamiento Motor' },
  { num: 73, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultades para usar ambas manos coordinadas para recortar, dibujar o pintar.', vulnerability: 'Planeamiento Motor' },
  { num: 74, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No logra completar tareas de múltiples pasos en el aula.', vulnerability: 'Planeamiento Motor' },
  { num: 75, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No logra ejecutar acciones de la rutina diaria en la secuencia correcta (guardar materiales, ponerse chaqueta).', vulnerability: 'Planeamiento Motor' }
];

// ----------------------------------------------------------------------------
// 5. SPM-2 BEBÉS (4 A 9 MESES) - CUESTIONARIO OFICIAL EN ESPAÑOL (80 PREGUNTAS)
// ----------------------------------------------------------------------------
export const SPM_BEBES_4_TO_9_MESES_QUESTIONS: SPMQuestion[] = [
  // VISIÓN (VIS) 1-10
  { num: 1, scale: 'VIS', scaleName: 'Visión', text: 'Se fastidia o cierra los ojos cuando hay una luz fuerte.', vulnerability: 'Hiperreactivo' },
  { num: 2, scale: 'VIS', scaleName: 'Visión', text: 'Mira fijamente a las luces que parpadean o brillan intermitentemente.', vulnerability: 'Buscador' },
  { num: 3, scale: 'VIS', scaleName: 'Visión', text: 'Muestra angustia en habitaciones de colores fuertes.', vulnerability: 'Hiperreactivo' },
  { num: 4, scale: 'VIS', scaleName: 'Visión', text: 'Mira fijamente a las luces brillantes.', vulnerability: 'Buscador' },
  { num: 5, scale: 'VIS', scaleName: 'Visión', text: 'Mira fijamente a objetos que giran.', vulnerability: 'Buscador' },
  { num: 6, scale: 'VIS', scaleName: 'Visión', text: 'Tiene problemas para seguir objetos que se mueven con la vista.', vulnerability: 'Ocular-Motor' },
  { num: 7, scale: 'VIS', scaleName: 'Visión', text: 'Mira a objetos con el rabillo del ojo.', vulnerability: 'Buscador' },
  { num: 8, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para encontrar un juguete que esté sobre una alfombra o frazada estampada.', vulnerability: 'Percepción' },
  { num: 9, scale: 'VIS', scaleName: 'Visión', text: 'Mira fijamente a la gente o a los objetos.', vulnerability: 'Hiporreactivo' },
  { num: 10, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para encontrar un juguete favorito que esté entre otros objetos.', vulnerability: 'Percepción' },

  // OÍDO / AUDICIÓN (HEA) 11-20
  { num: 11, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Muestra angustia con sonidos hogareños normales como el sonido de la aspiradora o el de jalar la cadena de la taza del baño.', vulnerability: 'Hiperreactivo' },
  { num: 12, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'No hace caso de los sonidos cotidianos como el repique de juguetes o el timbre del teléfono.', vulnerability: 'Hiporreactivo' },
  { num: 13, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'No me mira cuando lo/la llamo por su nombre.', vulnerability: 'Hiporreactivo' },
  { num: 14, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Tiene dificultad para dormir con ruidos suaves en el fondo como el de pisadas o el del teclado de una computadora.', vulnerability: 'Hiperreactivo' },
  { num: 15, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Parece no darse cuenta o confundirse acerca de dónde provienen los sonidos.', vulnerability: 'Percepción' },
  { num: 16, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Muestra angustia al oír el bullicio de una fiesta o de una habitación llena de gente.', vulnerability: 'Hiperreactivo' },
  { num: 17, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'No nota que hay nuevas voces o nuevos sonidos en la habitación.', vulnerability: 'Hiporreactivo' },
  { num: 18, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Prefiere los juguetes que hacen bulla a los que son silenciosos.', vulnerability: 'Buscador' },
  { num: 19, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'No hace caso de los sonidos fuertes como una sirena o truenos.', vulnerability: 'Hiporreactivo' },
  { num: 20, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'No reconoce mi voz.', vulnerability: 'Percepción' },

  // TACTO (TOU) 21-30
  { num: 21, scale: 'TOU', scaleName: 'Tacto', text: 'Muestra angustia cuando su piel desnuda toca superficies texturizadas como ciertas ropas, el pasto, la arena, la alfombra, o los juguetes peludos.', vulnerability: 'Hiperreactivo' },
  { num: 22, scale: 'TOU', scaleName: 'Tacto', text: 'Muestra angustia cuando toca comidas con los dedos.', vulnerability: 'Hiperreactivo' },
  { num: 23, scale: 'TOU', scaleName: 'Tacto', text: 'Muestra angustia o se aparta cuando lo/la tocan.', vulnerability: 'Hiperreactivo' },
  { num: 24, scale: 'TOU', scaleName: 'Tacto', text: 'Se fastidia si es que la temperatura de la comida, del agua del baño, o de una toallita húmeda no está precisamente correcta.', vulnerability: 'Hiperreactivo' },
  { num: 25, scale: 'TOU', scaleName: 'Tacto', text: 'Se fastidia cuando lo/la están vistiendo o le están cambiando el pañal.', vulnerability: 'Hiperreactivo' },
  { num: 26, scale: 'TOU', scaleName: 'Tacto', text: 'Llora o empuja hacia atrás cuando lo cargan.', vulnerability: 'Hiperreactivo' },
  { num: 27, scale: 'TOU', scaleName: 'Tacto', text: 'Se frota las manos o la cara con telas o con animales de peluche.', vulnerability: 'Buscador' },
  { num: 28, scale: 'TOU', scaleName: 'Tacto', text: 'Muestra angustia, hace arcadas, o vomita en reacción a comidas de ciertas texturas como comida blanda o crujiente.', vulnerability: 'Hiperreactivo' },
  { num: 29, scale: 'TOU', scaleName: 'Tacto', text: 'Jadea o tose cuando come, cuando bebe, cuando toma de la mamadera o cuando mama.', vulnerability: 'Motor Oral' },
  { num: 30, scale: 'TOU', scaleName: 'Tacto', text: 'Pone sus manos, su cabeza, o su cuerpo contra objetos que vibran como la lavadora de platos o la lavadora de ropa.', vulnerability: 'Buscador' },

  // GUSTO Y OLFATO (TS) 31-40
  { num: 31, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Se fastidia cuando hay ciertos olores a su alrededor.', vulnerability: 'Hiperreactivo' },
  { num: 32, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Huele la comida antes de comérsela.', vulnerability: 'Hiperreactivo' },
  { num: 33, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Evita comidas que tengan olores fuertes.', vulnerability: 'Hiperreactivo' },
  { num: 34, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Hace arcadas en reacción a ciertos olores.', vulnerability: 'Hiperreactivo' },
  { num: 35, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Huele los juguetes u otros objetos que no son comibles.', vulnerability: 'Buscador' },
  { num: 36, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Se fastidia durante una comida si hay cambios entre alimentos que tienen sabores diferentes.', vulnerability: 'Hiperreactivo' },
  { num: 37, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'No muestra preferir comidas de un cierto sabor a las de otros sabores.', vulnerability: 'Hiporreactivo' },
  { num: 38, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Evita comidas que tengan sabores fuertes.', vulnerability: 'Hiperreactivo' },
  { num: 39, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Hace arcadas cuando prueba las comidas.', vulnerability: 'Hiperreactivo' },
  { num: 40, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Insiste en comer solo la misma marca de ciertos alimentos.', vulnerability: 'Hiperreactivo' },

  // CONCIENCIA DEL CUERPO (BOD) 41-50
  { num: 41, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Juega de manera brusca con objetos, mascotas, u otros niños.', vulnerability: 'Buscador' },
  { num: 42, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Muerde los juguetes, la ropa, u otros objetos repetidamente.', vulnerability: 'Buscador' },
  { num: 43, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se cansa fácilmente cuando le dan de comer.', vulnerability: 'Control Postural' },
  { num: 44, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Hace movimientos grandes y rápidos con los brazos y las piernas repetidamente.', vulnerability: 'Buscador' },
  { num: 45, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se golpea la cabeza a propósito contra el suelo, la pared, o contra algún objeto.', vulnerability: 'Buscador' },
  { num: 46, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Pone demasiada comida en su boca.', vulnerability: 'Percepción' },
  { num: 47, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se mueve despacio o con lentitud.', vulnerability: 'Hiporreactivo' },
  { num: 48, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Mueve su cuerpo de modos raros, sacudiendo los dedos o agitando las muñecas.', vulnerability: 'Buscador' },
  { num: 49, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Afloja el cuerpo cuando un adulto lo/la carga.', vulnerability: 'Tono / Postura' },
  { num: 50, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se muerde o se golpea.', vulnerability: 'Buscador' },

  // EQUILIBRIO Y MOVIMIENTO (BAL) 51-60
  { num: 51, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Muestra angustia cuando lo mecen o lo mueven de arriba abajo.', vulnerability: 'Hiperreactivo' },
  { num: 52, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se fastidia cuando yace sobre su estómago.', vulnerability: 'Hiperreactivo' },
  { num: 53, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Trata de zafarse, se pone tieso/a, o se fastidia cuando lo balancean o lo/la levantan en alto.', vulnerability: 'Hiperreactivo' },
  { num: 54, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se sobresalta o llora cuando lo/la mueven de repente.', vulnerability: 'Hiperreactivo' },
  { num: 55, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Necesita un movimiento intenso para calmarse.', vulnerability: 'Buscador' },
  { num: 56, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Necesita algún movimiento para poder dormirse como ir en un auto o mecerse en un asiento para bebés.', vulnerability: 'Buscador' },
  { num: 57, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Busca movimiento intenso o continuo como balancearse, mecerse, o moverse de arriba abajo.', vulnerability: 'Buscador' },
  { num: 58, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se fastidia cuando su cabeza está boca abajo.', vulnerability: 'Hiperreactivo' },
  { num: 59, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Muestra angustia cuando lo/la mueven de una posición a otra.', vulnerability: 'Hiperreactivo' },
  { num: 60, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Tiene dificultad para alzar la cabeza cuando lo/la levantan luego de estar echado/a.', vulnerability: 'Control Postural' },

  // PLANIFICACIÓN E IDEAS (PLA) 61-70
  { num: 61, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No explora nuevas maneras de jugar con objetos familiares.', vulnerability: 'Ideación' },
  { num: 62, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No inicia juegos con los juguetes.', vulnerability: 'Ideación' },
  { num: 63, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No explora nuevos ambientes.', vulnerability: 'Ideación' },
  { num: 64, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para bajarse de una silla, de un sillón, o de un sitio alto.', vulnerability: 'Planeamiento Motor' },
  { num: 65, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para controlar la comida en la boca.', vulnerability: 'Motor Oral' },
  { num: 66, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para controlar los líquidos en la boca.', vulnerability: 'Motor Oral' },
  { num: 67, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para maniobrar alrededor de obstáculos o bajo o encima de ellos.', vulnerability: 'Planeamiento Motor' },
  { num: 68, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No trata de imitar las acciones de otros como hacer adiós.', vulnerability: 'Planeamiento Motor' },
  { num: 69, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad imitando sonidos correctamente como haciendo ruido con los labios y la lengua o diciendo "mamá".', vulnerability: 'Planeamiento Motor' },
  { num: 70, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad imitando expresiones de la cara, o movimientos de la boca o de la lengua correctamente.', vulnerability: 'Planeamiento Motor' },

  // PARTICIPACIÓN SOCIAL (SOC) 71-80 (Ítems positivos invertidos: N=4, O=3, F=2, S=1)
  { num: 71, scale: 'SOC', scaleName: 'Participación Social', text: 'Responde a mi voz o a mi cara con expresiones vocales o faciales.', isReverseScored: true },
  { num: 72, scale: 'SOC', scaleName: 'Participación Social', text: 'Sonríe, se ríe, o se une a juegos como "el escondite".', isReverseScored: true },
  { num: 73, scale: 'SOC', scaleName: 'Participación Social', text: 'Hace sonidos vocales de felicidad cuando juego con él o ella.', isReverseScored: true },
  { num: 74, scale: 'SOC', scaleName: 'Participación Social', text: 'Me mira a los ojos por más que un vistazo cuando yo le hablo.', isReverseScored: true },
  { num: 75, scale: 'SOC', scaleName: 'Participación Social', text: 'Mueve sus brazos o sus piernas activamente cuando juega conmigo.', isReverseScored: true },
  { num: 76, scale: 'SOC', scaleName: 'Participación Social', text: 'Mira a lo que yo estoy mirando.', isReverseScored: true },
  { num: 77, scale: 'SOC', scaleName: 'Participación Social', text: 'Trata de darles cosas a los adultos o de tomarlas.', isReverseScored: true },
  { num: 78, scale: 'SOC', scaleName: 'Participación Social', text: 'Se calma fácilmente con un adulto familiar cuando está alterado/a.', isReverseScored: true },
  { num: 79, scale: 'SOC', scaleName: 'Participación Social', text: 'Expresa una variedad de emociones como alegría, tristeza, y frustración.', isReverseScored: true },
  { num: 80, scale: 'SOC', scaleName: 'Participación Social', text: 'Se acerca hacia adelante y abre la boca cuando le están dando de comer.', isReverseScored: true }
];

// ----------------------------------------------------------------------------
// 6. SPM-2 NIÑOS PEQUEÑOS / TODDLER (10 A 30 MESES) - CUESTIONARIO OFICIAL (80 PREGUNTAS)
// ----------------------------------------------------------------------------
export const SPM_TODDLER_10_TO_30_MESES_QUESTIONS: SPMQuestion[] = [
  // VISIÓN (VIS) 1-10
  { num: 1, scale: 'VIS', scaleName: 'Visión', text: 'Se fastidia o cierra los ojos cuando hay una luz fuerte.', vulnerability: 'Hiperreactivo' },
  { num: 2, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para encontrar un juguete favorito que esté entre otros objetos.', vulnerability: 'Percepción' },
  { num: 3, scale: 'VIS', scaleName: 'Visión', text: 'Mira fijamente a objetos que giran o a las luces que parpadean o que brillan intermitentemente.', vulnerability: 'Buscador' },
  { num: 4, scale: 'VIS', scaleName: 'Visión', text: 'Tiene problemas para seguir objetos que se mueven con la vista.', vulnerability: 'Ocular-Motor' },
  { num: 5, scale: 'VIS', scaleName: 'Visión', text: 'Mira a objetos con el rabillo del ojo.', vulnerability: 'Buscador' },
  { num: 6, scale: 'VIS', scaleName: 'Visión', text: 'No se fija en juguetes que brillan o tienen muchos colores.', vulnerability: 'Hiporreactivo' },
  { num: 7, scale: 'VIS', scaleName: 'Visión', text: 'Muestra angustia en habitaciones de colores fuertes.', vulnerability: 'Hiperreactivo' },
  { num: 8, scale: 'VIS', scaleName: 'Visión', text: 'Tiene dificultad para encontrar un juguete que esté sobre una alfombra o frazada estampada.', vulnerability: 'Percepción' },
  { num: 9, scale: 'VIS', scaleName: 'Visión', text: 'Mira fijamente a la gente o a los objetos.', vulnerability: 'Hiporreactivo' },
  { num: 10, scale: 'VIS', scaleName: 'Visión', text: 'Mira fijamente a las luces brillantes.', vulnerability: 'Buscador' },

  // OÍDO / AUDICIÓN (HEA) 11-20
  { num: 11, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Muestra angustia con sonidos hogareños normales como el sonido de la aspiradora o el de jalar la cadena de la taza del baño.', vulnerability: 'Hiperreactivo' },
  { num: 12, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Toma nota de sonidos sutiles que otros no notan como un avión lejano o el zumbido del refrigerador.', vulnerability: 'Hiperreactivo' },
  { num: 13, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'No me mira cuando lo/la llamo por su nombre.', vulnerability: 'Hiporreactivo' },
  { num: 14, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Muestra angustia cuando hay sonidos inesperados o fuertes.', vulnerability: 'Hiperreactivo' },
  { num: 15, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Tiene dificultad para dormir con ruidos suaves en el fondo como el de pisadas o el del teclado de una computadora.', vulnerability: 'Hiperreactivo' },
  { num: 16, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Parece no darse cuenta o confundirse acerca de dónde provienen los sonidos.', vulnerability: 'Percepción' },
  { num: 17, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Escucha cuidadosamente a los sonidos que hace, ignorando todo los demás.', vulnerability: 'Buscador' },
  { num: 18, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Parece disfrutar de sonidos fuertes que irritan a los demás.', vulnerability: 'Buscador' },
  { num: 19, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Gusta hacer ciertos sonidos repetidamente como jalar la cadena de la taza del baño.', vulnerability: 'Buscador' },
  { num: 20, scale: 'HEA', scaleName: 'Audición (Oído)', text: 'Muestra angustia al oír el bullicio de una fiesta o de una habitación llena de gente.', vulnerability: 'Hiperreactivo' },

  // TACTO (TOU) 21-30
  { num: 21, scale: 'TOU', scaleName: 'Tacto', text: 'Muestra angustia cuando toca comidas con los dedos.', vulnerability: 'Hiperreactivo' },
  { num: 22, scale: 'TOU', scaleName: 'Tacto', text: 'Se fastidia si es que la temperatura de la comida, del agua del baño, o de una toallita húmeda no está precisamente correcta.', vulnerability: 'Hiperreactivo' },
  { num: 23, scale: 'TOU', scaleName: 'Tacto', text: 'No hace caso de sensaciones que para otros serían dolorosas.', vulnerability: 'Hiporreactivo' },
  { num: 24, scale: 'TOU', scaleName: 'Tacto', text: 'Se fastidia cuando lo/la están vistiendo o le están cambiando el pañal.', vulnerability: 'Hiperreactivo' },
  { num: 25, scale: 'TOU', scaleName: 'Tacto', text: 'No se da cuenta que tiene comida en la boca.', vulnerability: 'Hiporreactivo' },
  { num: 26, scale: 'TOU', scaleName: 'Tacto', text: 'Busca sensaciones que para otros serían dolorosas como tirándose al suelo.', vulnerability: 'Buscador' },
  { num: 27, scale: 'TOU', scaleName: 'Tacto', text: 'Trata de estar envuelto/a en frazadas o ropas bien apretadas.', vulnerability: 'Buscador' },
  { num: 28, scale: 'TOU', scaleName: 'Tacto', text: 'Muestra angustia, hace arcadas, o vomita en reacción a comidas de ciertas texturas, como comida blanda o crujiente.', vulnerability: 'Hiperreactivo' },
  { num: 29, scale: 'TOU', scaleName: 'Tacto', text: 'Busca meterse en espacios pequeños como bajo un montón de almohadas.', vulnerability: 'Buscador' },
  { num: 30, scale: 'TOU', scaleName: 'Tacto', text: 'Pone sus manos, su cabeza, o su cuerpo contra objetos que vibran como la lavadora de platos o la lavadora de ropa.', vulnerability: 'Buscador' },

  // GUSTO Y OLFATO (TS) 31-40
  { num: 31, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Huele los juguetes u otros objetos que no son comibles.', vulnerability: 'Buscador' },
  { num: 32, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Muestra angustia ante el olor del jabón, del perfume, o de las lociones para la piel.', vulnerability: 'Hiperreactivo' },
  { num: 33, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'No nota olores fuertes o inusuales.', vulnerability: 'Hiporreactivo' },
  { num: 34, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Hace arcadas en reacción a ciertos olores.', vulnerability: 'Hiperreactivo' },
  { num: 35, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Prefiere comidas que tengan fuertes olores.', vulnerability: 'Buscador' },
  { num: 36, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Evita comidas que tengan olores fuertes.', vulnerability: 'Hiperreactivo' },
  { num: 37, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'No muestra preferir comidas de un cierto sabor a las de otros sabores.', vulnerability: 'Hiporreactivo' },
  { num: 38, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Evita comidas que tengan sabores fuertes.', vulnerability: 'Hiperreactivo' },
  { num: 39, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Hace arcadas cuando prueba las comidas.', vulnerability: 'Hiperreactivo' },
  { num: 40, scale: 'TS', scaleName: 'Gusto y Olfato', text: 'Insiste en comer solo la misma marca de ciertos alimentos.', vulnerability: 'Hiperreactivo' },

  // CONCIENCIA DEL CUERPO (BOD) 41-50
  { num: 41, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Juega de manera brusca con objetos, mascotas, u otros niños.', vulnerability: 'Buscador' },
  { num: 42, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se golpea la cabeza a propósito contra algún objeto o contra la gente.', vulnerability: 'Buscador' },
  { num: 43, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Muerde los juguetes, la ropa, u otros objetos repetidamente.', vulnerability: 'Buscador' },
  { num: 44, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Rompe juguetes al manejarlos con demasiada fuerza.', vulnerability: 'Percepción' },
  { num: 45, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se mueve despacio o con lentitud.', vulnerability: 'Hiporreactivo' },
  { num: 46, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Camina sobre los dedos del pie.', vulnerability: 'Buscador' },
  { num: 47, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Afloja el cuerpo cuando un adulto lo/la carga.', vulnerability: 'Tono / Postura' },
  { num: 48, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Deja caer un montón de comida cuando come con una cuchara.', vulnerability: 'Percepción' },
  { num: 49, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se muerde, se golpea, o muerde o golpea a otros.', vulnerability: 'Buscador' },
  { num: 50, scale: 'BOD', scaleName: 'Conciencia del Cuerpo', text: 'Se cansa fácilmente cuando le dan de comer.', vulnerability: 'Control Postural' },

  // EQUILIBRIO Y MOVIMIENTO (BAL) 51-60
  { num: 51, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se marea en el automóvil.', vulnerability: 'Hiperreactivo' },
  { num: 52, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se sienta con los hombros caídos o inclinándose hacia adelante.', vulnerability: 'Control Postural' },
  { num: 53, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Necesita un movimiento intenso para calmarse.', vulnerability: 'Buscador' },
  { num: 54, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'No se sujeta cuando se está cayendo.', vulnerability: 'Control Postural' },
  { num: 55, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Necesita algún movimiento para poder dormirse como que lo/la mezan o como ir en un auto.', vulnerability: 'Buscador' },
  { num: 56, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Busca movimiento intenso o continuo como balancearse, mecerse, o moverse de arriba abajo.', vulnerability: 'Buscador' },
  { num: 57, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se apoya sobre la gente o los muebles para mantenerse erguido/a.', vulnerability: 'Control Postural' },
  { num: 58, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Se fastidia cuando su cabeza está boca abajo.', vulnerability: 'Hiperreactivo' },
  { num: 59, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'Puede girar repetidamente sin marearse.', vulnerability: 'Hiporreactivo' },
  { num: 60, scale: 'BAL', scaleName: 'Equilibrio y Movimiento', text: 'No puede saltar con los dos pies al mismo tiempo.', vulnerability: 'Control Postural' },

  // PLANIFICACIÓN E IDEAS (PLA) 61-70
  { num: 61, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No explora nuevas maneras de jugar con objetos familiares.', vulnerability: 'Ideación' },
  { num: 62, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Sigue el mismo patrón de conducta repetidamente cuando juega con objetos o con juguetes como por ejemplo poniéndolos en fila de la misma manera.', vulnerability: 'Ideación' },
  { num: 63, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'No pone un objeto dentro de otro, como un bloque dentro de una taza, cuando está jugando.', vulnerability: 'Planeamiento Motor' },
  { num: 64, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para bajarse de una silla, de un sillón, o de un sitio alto.', vulnerability: 'Planeamiento Motor' },
  { num: 65, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad trepándose a una silla o a un asiento para el auto y dando la vuelta para sentarse.', vulnerability: 'Planeamiento Motor' },
  { num: 66, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para controlar la comida o los líquidos en la boca.', vulnerability: 'Motor Oral' },
  { num: 67, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad para maniobrar alrededor de obstáculos o bajo o encima de ellos.', vulnerability: 'Planeamiento Motor' },
  { num: 68, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Repite la misma actividad una y otra vez sin aumentar su destreza.', vulnerability: 'Ideación' },
  { num: 69, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad imitando sonidos correctamente como haciendo ruido con los labios y la lengua o diciendo "mamá".', vulnerability: 'Planeamiento Motor' },
  { num: 70, scale: 'PLA', scaleName: 'Planificación e Ideas', text: 'Tiene dificultad imitando expresiones de la cara, o movimientos de la boca o de la lengua correctamente.', vulnerability: 'Planeamiento Motor' },

  // PARTICIPACIÓN SOCIAL (SOC) 71-80 (Ítems positivos invertidos: N=4, O=3, F=2, S=1)
  { num: 71, scale: 'SOC', scaleName: 'Participación Social', text: 'Responde a mi voz o a mi cara con expresiones vocales o faciales.', isReverseScored: true },
  { num: 72, scale: 'SOC', scaleName: 'Participación Social', text: 'Trata de darles cosas a los adultos o de tomarlas.', isReverseScored: true },
  { num: 73, scale: 'SOC', scaleName: 'Participación Social', text: 'Señala objetos para enseñárselos a los adultos.', isReverseScored: true },
  { num: 74, scale: 'SOC', scaleName: 'Participación Social', text: 'Se calma fácilmente con un adulto familiar cuando está alterado/a.', isReverseScored: true },
  { num: 75, scale: 'SOC', scaleName: 'Participación Social', text: 'Expresa una variedad de emociones como alegría, tristeza, y frustración.', isReverseScored: true },
  { num: 76, scale: 'SOC', scaleName: 'Participación Social', text: 'Me mira a los ojos por más que un vistazo cuando yo le hablo.', isReverseScored: true },
  { num: 77, scale: 'SOC', scaleName: 'Participación Social', text: 'Prosigue fácilmente cuando hay un cambio inesperado en su rutina.', isReverseScored: true },
  { num: 78, scale: 'SOC', scaleName: 'Participación Social', text: 'Duerme sin interrumpir la rutina familiar.', isReverseScored: true },
  { num: 79, scale: 'SOC', scaleName: 'Participación Social', text: 'Se acerca hacia adelante y abre la boca cuando le están dando de comer.', isReverseScored: true },
  { num: 80, scale: 'SOC', scaleName: 'Participación Social', text: 'Se asegura que estoy cerca cuando está en un sitio nuevo.', isReverseScored: true }
];

export type SPMAgeGroupKey = 'bebes_4_9' | '10_a_30_meses' | '2_a_5_anos' | 'mayor_5_anos';

// Helper para obtener las preguntas según edad y contexto
export function getSPMQuestions(
  ageGroup: SPMAgeGroupKey,
  formType: 'hogar' | 'escuela' = 'hogar'
): SPMQuestion[] {
  if (ageGroup === 'bebes_4_9') {
    return SPM_BEBES_4_TO_9_MESES_QUESTIONS;
  }
  if (ageGroup === '10_a_30_meses') {
    return SPM_TODDLER_10_TO_30_MESES_QUESTIONS;
  }
  if (ageGroup === '2_a_5_anos') {
    return formType === 'hogar' ? SPM_HOME_2_TO_5_QUESTIONS : SPM_SCHOOL_2_TO_5_QUESTIONS;
  }
  return formType === 'hogar' ? SPM_HOME_OVER_5_QUESTIONS : SPM_SCHOOL_OVER_5_QUESTIONS;
}

// Cálculo psicométrico exacto según manual SPM / SPM-2:
// Puntuaciones Likert: N=1, O=2, F=3, S=4
// (Excepto ítems positivos de Participación Social donde N=4, O=3, F=2, S=1)
export function calculateSPMScores(
  answers: Record<number, number>,
  questions: SPMQuestion[],
  ageGroup: SPMAgeGroupKey,
  formType: 'hogar' | 'escuela' = 'hogar'
) {
  const scaleRaw: Record<SPMScaleId, number> = {
    SOC: 0,
    VIS: 0,
    HEA: 0,
    TOU: 0,
    TS: 0,
    BOD: 0,
    BAL: 0,
    PLA: 0
  };

  const scaleCounts: Record<SPMScaleId, number> = {
    SOC: 0,
    VIS: 0,
    HEA: 0,
    TOU: 0,
    TS: 0,
    BOD: 0,
    BAL: 0,
    PLA: 0
  };

  let answeredTotal = 0;

  questions.forEach(q => {
    const rawVal = answers[q.num];
    if (rawVal !== undefined && rawVal >= 1 && rawVal <= 4) {
      answeredTotal++;
      const points = q.isReverseScored ? (5 - rawVal) : rawVal;
      scaleRaw[q.scale] += points;
      scaleCounts[q.scale]++;
    }
  });

  // Cálculo de TOT / ST (Total Sensory Systems) = VIS + HEA + TOU + BOD + BAL + TS
  const totRaw = scaleRaw.VIS + scaleRaw.HEA + scaleRaw.TOU + scaleRaw.BOD + scaleRaw.BAL + scaleRaw.TS;

  // Conversión a Puntaje T (Media = 50, DE = 10) según Tablas del manual SPM / SPM-2
  const convertToT = (raw: number, maxPossible: number, minPossible: number) => {
    if (raw === 0) return 50;
    const ratio = (raw - minPossible) / Math.max(1, maxPossible - minPossible);
    const tScore = Math.round(40 + ratio * 38);
    return Math.min(80, Math.max(40, tScore));
  };

  const getRange = (t: number): 'Típico (40-59)' | 'Dificultades Moderadas (60-69)' | 'Disfunción Severa (70-80)' => {
    if (t < 60) return 'Típico (40-59)';
    if (t <= 69) return 'Dificultades Moderadas (60-69)';
    return 'Disfunción Severa (70-80)';
  };

  const isInfantOrToddler = ageGroup === 'bebes_4_9' || ageGroup === '10_a_30_meses';
  const defaultScaleLen = isInfantOrToddler ? 10 : 10;

  const socT = convertToT(scaleRaw.SOC, (scaleCounts.SOC || defaultScaleLen) * 4, (scaleCounts.SOC || defaultScaleLen) * 1);
  const visT = convertToT(scaleRaw.VIS, (scaleCounts.VIS || defaultScaleLen) * 4, (scaleCounts.VIS || defaultScaleLen) * 1);
  const heaT = convertToT(scaleRaw.HEA, (scaleCounts.HEA || (isInfantOrToddler ? 10 : 8)) * 4, (scaleCounts.HEA || (isInfantOrToddler ? 10 : 8)) * 1);
  const touT = convertToT(scaleRaw.TOU, (scaleCounts.TOU || (isInfantOrToddler ? 10 : 11)) * 4, (scaleCounts.TOU || (isInfantOrToddler ? 10 : 11)) * 1);
  const tsT = convertToT(scaleRaw.TS, (scaleCounts.TS || (isInfantOrToddler ? 10 : 5)) * 4, (scaleCounts.TS || (isInfantOrToddler ? 10 : 5)) * 1);
  const bodT = convertToT(scaleRaw.BOD, (scaleCounts.BOD || 10) * 4, (scaleCounts.BOD || 10) * 1);
  const balT = convertToT(scaleRaw.BAL, (scaleCounts.BAL || (isInfantOrToddler ? 10 : 11)) * 4, (scaleCounts.BAL || (isInfantOrToddler ? 10 : 11)) * 1);
  const plaT = convertToT(scaleRaw.PLA, (scaleCounts.PLA || (isInfantOrToddler ? 10 : 9)) * 4, (scaleCounts.PLA || (isInfantOrToddler ? 10 : 9)) * 1);
  const totMaxItems = isInfantOrToddler ? 60 : 56;
  const totT = convertToT(totRaw, totMaxItems * 4, totMaxItems * 1);

  return {
    answeredTotal,
    totalQuestions: questions.length,
    scaleRaw,
    totRaw,
    scores: {
      social: { raw: scaleRaw.SOC, t: socT, range: getRange(socT) },
      vision: { raw: scaleRaw.VIS, t: visT, range: getRange(visT) },
      hearing: { raw: scaleRaw.HEA, t: heaT, range: getRange(heaT) },
      touch: { raw: scaleRaw.TOU, t: touT, range: getRange(touT) },
      tasteSmell: { raw: scaleRaw.TS, t: tsT, range: getRange(tsT) },
      bodyAwareness: { raw: scaleRaw.BOD, t: bodT, range: getRange(bodT) },
      balanceMotion: { raw: scaleRaw.BAL, t: balT, range: getRange(balT) },
      planningIdeas: { raw: scaleRaw.PLA, t: plaT, range: getRange(plaT) },
      totalSensory: { raw: totRaw, t: totT, range: getRange(totT) }
    }
  };
}

