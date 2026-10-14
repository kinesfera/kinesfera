import { MonthlyContentPlan, ContentPlanPost } from '../types';

// ============================================================================
// MES 1: JULIO 2026 (AWARENESS & AUTORIDAD LOCAL)
// Extraído fielmente del documento "Plan Mes 1 - Plan de contenidos Kinesfera"
// ============================================================================
export const PLAN_MES_1: MonthlyContentPlan = {
  id: 'plan_mes_1',
  monthKey: 'julio_mes_1',
  monthTitle: 'Mes 1 (Julio) · Conciencia & Autoridad Local',
  phase: 'Fase 1: Conciencia (Awareness) & Confianza Digital',
  objective: 'Ordenar la base comercial, reactivar pacientes, activar derivadores y publicar 12 contenidos que generen confianza en padres de Copiapó. La meta no es viralizar: es producir consultas reales y construir autoridad local.',
  postsCount: 12,
  nicheAnalysisSummary: {
    clinicDataFindings: 'Base inicial con 95 publicaciones y 449 seguidores en Instagram sin llamadas a la acción ni ubicación clara en bio.',
    patientTrends: 'Padres no tienen claro qué diferencia a un kinesiólogo infantil de un kinesiólogo de adultos.',
    seasonalNicheContext: 'Inicio de semestre escolar en Copiapó; padres buscan aclarar dudas sobre torpeza motriz, caídas y posturas.',
    bestFormatsRecommended: 'Alternancia 3 veces por semana: Lunes (Reel educador), Miércoles (Carrusel guardable), Viernes (Reel humano/recorrido del centro).'
  },
  posts: [
    {
      id: 'm1-p1',
      monthId: 'julio_mes_1',
      postNumber: 1,
      weekDay: 'S1 – Lunes',
      format: 'Reel',
      topic: 'Qué hace un kinesiólogo infantil',
      type: 'Me Content',
      hookVariants: [
        'A) Un kinesiólogo infantil no trabaja como un kinesiólogo de adultos en miniatura.',
        'B) Si llevas meses pensando que ya se le va a pasar... este video es para ti.',
        'C) ¿Sabías que hay niños que necesitan kinesiólogo y nadie se los dijo?'
      ],
      hookScript: '"Un kinesiólogo infantil no trabaja como un kinesiólogo de adultos en miniatura."',
      needScript: '"Y es importante que lo entiendas, porque muchos papás llevan a sus hijos a fisioterapia general... y los resultados no son los mismos. En los niños, el cuerpo, el juego, la conducta y la confianza van juntos. Si trabajamos solo el músculo, nos perdemos la mitad del cuadro. Por eso hoy te voy a explicar qué evalúa exactamente un kinesiólogo infantil."',
      valuePoints: [
        'Punto 1 – El movimiento completo: Evaluamos cómo corre, salta, sube escaleras, pero también cómo responde al entorno (si evita texturas o se cansa rápido).',
        'Punto 2 – El juego como herramienta: No le pedimos al niño que se quede quieto y haga el ejercicio. Observamos cómo juega y cómo se mueve.',
        'Punto 3 – El trabajo con los papás: Lo que pasa en sesión tiene que tener continuidad en casa. Sin eso, los avances se pierden.'
      ],
      ctaScript: '"La idea no es obligar al niño a moverse. Es construir desde lo que puede hacer y desde lo que necesita. Si tienes dudas sobre el desarrollo motor de tu hijo, escríbenos. Estamos en Copiapó y orientamos sin costo."',
      caption: 'Un kinesiólogo infantil no es un fisioterapeuta de adultos en formato pequeño. 🧩 En los niños, el cuerpo, el juego, la conducta y la confianza van juntos. Por eso evaluamos diferente, trabajamos diferente y acompañamos diferente.\n\nSi tienes dudas sobre el desarrollo motor de tu hijo, escríbenos por mensaje. Estamos en Copiapó y orientamos sin costo.\n\n🧩 Copiapó, Chile\n🧩 Escríbenos HOLA para más info',
      hashtags: ['#KinesiologiaInfantil', '#Copiapo', '#DesarrolloInfantil', '#NiñosSaludables', '#KinesFera', '#FisioterapiaPediatrica', '#NeurodivergenciaCL'],
      productionNotes: [
        'Aldo a cámara directa, espacio visible y colorido de fondo.',
        'Sin música o con música suave muy baja (el habla es el contenido).',
        'Agregar subtítulos en el video – aumenta retención ~40%.',
        'Duración objetivo: 60-75 segundos. Grabar con buena luz frontal.'
      ],
      dataDrivenReason: 'Punto de partida obligatorio: 80% de los padres en Copiapó asocian kinesiología solo con rehabilitación de lesiones de adultos.'
    },
    {
      id: 'm1-p2',
      monthId: 'julio_mes_1',
      postNumber: 2,
      weekDay: 'S1 – Miércoles',
      format: 'Carrusel',
      topic: '5 señales para consultar a kinesiología infantil',
      type: 'You Content',
      hookVariants: [
        '5 señales de que tu hijo podría necesitar evaluación kinésica'
      ],
      hookScript: '"5 señales de que tu hijo podría necesitar evaluación kinésica. Guarda esto para revisarlo con calma."',
      needScript: 'Muchos padres esperan meses porque creen que "es torpeza normal" o que "ya se le pasará".',
      valuePoints: [
        'Señal 1: Se cae más seguido que otros niños de su edad (coordinación y equilibrio).',
        'Señal 2: Evita correr, saltar o actividades físicas que otros disfrutan.',
        'Señal 3: Se cansa muy rápido en comparación a sus pares (fatiga precoz / tono muscular bajo).',
        'Señal 4: Dificultad para coordinar ambas manos o atrapar una pelota.',
        'Señal 5: Marcha con pies hacia adentro/afuera o dolor al caminar.'
      ],
      ctaScript: '¿Reconoces alguna de estas señales en tu hijo? Guarda este carrusel y compártelo con papás que lo puedan necesitar. Escríbenos para coordinar una evaluación en Copiapó.',
      caption: '¿Tu hijo muestra alguna de estas señales? 🧩 No todas significan lo mismo, y no todas requieren tratamiento. Pero sí requieren evaluación. Una evaluación temprana puede darte claridad, y eso vale mucho más que seguir esperando.\n\n🧩 Guarda este carrusel y compártelo con otros papás.\n🧩 Copiapó – escríbenos para agendar',
      hashtags: ['#KinesiologiaInfantil', '#DesarrolloInfantil', '#Copiapo', '#KinesFera', '#NiñosSaludables', '#TerapiaInfantil', '#PsicomotricidadInfantil'],
      productionNotes: [
        'Diseño consistente en las 8 láminas: misma paleta corporativa y tipografía.',
        'Lámina 1 es la más importante – invertir tiempo en diseño visual para parar el scroll.',
        'Iconos o ilustraciones simples para cada señal, sin fotos de stock frías.'
      ],
      dataDrivenReason: 'Contenido de alta guardabilidad y viralización entre familias de Copiapó.'
    },
    {
      id: 'm1-p3',
      monthId: 'julio_mes_1',
      postNumber: 3,
      weekDay: 'S1 – Viernes',
      format: 'Reel',
      topic: 'Conoce el espacio de KinesFera (Tour)',
      type: 'Me Content',
      hookVariants: [
        'A) Este espacio no fue pensado como una consulta tradicional. Fue pensado para niños.',
        'B) La primera vez que un niño entra aquí, normalmente no quiere irse.',
        'C) ¿Cómo se ve una sala de kinesiología infantil? Te muestro la nuestra.'
      ],
      hookScript: '"Este espacio no fue pensado como una consulta tradicional. Fue pensado para niños."',
      needScript: '"Muchos papás me preguntan: ¿Mi hijo va a querer quedarse? ¿Va a llorar? Y lo entiendo – una consulta médica fría puede ser difícil para cualquier niño. Aquí buscamos exactamente lo contrario. Y para que lo veas, te hago el recorrido."',
      valuePoints: [
        'Zona de colchonetas: regulación sensorial, diferentes texturas, alturas y materiales.',
        'Panel y barras: equilibrio y coordinación sin que el niño sienta que está haciendo ejercicio.',
        'Bloques y materiales de colores: planificación motora a través del juego libre y guiado.'
      ],
      ctaScript: '"Aquí buscamos que el niño quiera moverse. Que no sepa que está siendo evaluado. Que llegue con miedo y salga con ganas de volver. Escríbenos HOLA y te contamos cómo funciona la evaluación inicial."',
      caption: 'Una consulta que no parece consulta. 🧩 Este espacio fue diseñado pensando en que el niño se sienta seguro, no intimidado. Porque cuando un niño confía en el espacio, la terapia funciona distinto.\n\n🧩 Escríbenos HOLA por mensaje y te explicamos cómo funciona la primera evaluación.\n🧩 Copiapó, Chile',
      hashtags: ['#KinesiologiaInfantil', '#EspacioTerapeutico', '#PsicomotricidadInfantil', '#Copiapo', '#KinesFera', '#TerapiaInfantil', '#NiñosSeguros'],
      productionNotes: [
        'Reel tipo "tour caminando" – Aldo no está estático, se mueve con la cámara.',
        'Mostrar entrada → colchonetas → barras → materiales coloridos.',
        'Duración 55-65 segundos con luz natural.'
      ],
      dataDrivenReason: 'Genera confianza visual inmediata y reduce la objeción parental del miedo infantil a la bata blanca.'
    },
    {
      id: 'm1-p4',
      monthId: 'julio_mes_1',
      postNumber: 4,
      weekDay: 'S2 – Lunes',
      format: 'Carrusel',
      topic: 'Neurodivergencia y movimiento (TEA & TDAH)',
      type: 'You Content',
      hookVariants: [
        'Cuando hablamos de autismo o TDA, no todo pasa solo por la conducta.'
      ],
      hookScript: '"Cuando hablamos de autismo o TDA, no todo pasa solo por la conducta. Hay algo que pocos explican sobre el cuerpo de estos niños."',
      needScript: 'Muchos niños neurodivergentes tienen desafíos motores no visibles a simple vista: dispraxia, poca conciencia corporal y desregulación sensorial.',
      valuePoints: [
        'Dispraxia: el cerebro sabe lo que quiere hacer pero la ejecución motora falla.',
        'Propiocepción: el cuerpo que no sabe dónde está en el espacio busca chocar o saltar.',
        'Regulación: el movimiento organizado calma y organiza el sistema nervioso.',
        'Rol kinésico: complementamos al neurólogo, fonoaudiólogo y terapeuta ocupacional.'
      ],
      ctaScript: '¿Tu hijo tiene diagnóstico de autismo o TDA y no ha tenido evaluación kinésica? Puede ser el momento. Escríbenos para orientarte.',
      caption: 'Cuando hablamos de neurodivergencia, pensamos en conducta, lenguaje, atención... 🧩 Pero hay algo que muchos no consideran: el cuerpo también está involucrado.\n\nDesafíos de coordinación, equilibrio, planificación motora y procesamiento sensorial son muy frecuentes en niños con autismo o TDA. No reemplazamos a nadie: complementamos.\n\n🧩 Copiapó | 🧩 Escríbenos para orientarte',
      hashtags: ['#Neurodivergencia', '#TDA', '#Autismo', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#RegulacionSensorial'],
      productionNotes: [
        'Lenguaje claro, sin jerga médica pesada.',
        'Diseño con portada de alto impacto visual y tipografía legible.'
      ],
      dataDrivenReason: 'Conexión directa con los pacientes del centro derivados por la neuróloga Dra. Pilar Navarrete.'
    },
    {
      id: 'm1-p5',
      monthId: 'julio_mes_1',
      postNumber: 5,
      weekDay: 'S2 – Miércoles',
      format: 'Reel',
      topic: 'TDA/TDAH y regulación desde el cuerpo',
      type: 'You Content',
      hookVariants: [
        'A) No todo niño inquieto necesita calmarse. A veces necesita aprender a regularse mejor.',
        'B) El niño con TDA no está portándose mal. Su sistema nervioso está pidiendo ayuda.',
        'C) ¿Cuántas veces le dijeron a tu hijo que se quedara quieto?'
      ],
      hookScript: '"No todo niño inquieto necesita calmarse. A veces necesita aprender a regularse mejor."',
      needScript: '"Y hay una diferencia enorme entre las dos cosas. Cuando le pedimos a un niño con TDA que se quede quieto, muchas veces le pedimos que luche contra su propio sistema nervioso. Eso no funciona y frustra a todos. Lo que sí funciona es darle herramientas desde el cuerpo."',
      valuePoints: [
        'Coordinación y control motor: trabajar torpezas motrices sutiles.',
        'Equilibrio y propiocepción: entrenar la conciencia del cuerpo en el espacio.',
        'Estrategias corporales: cómo canalizar energía antes de tareas escolares.'
      ],
      ctaScript: '"El objetivo no es que el niño esté quieto. Es que pueda participar mejor en su vida diaria. Si esto te hace sentido con tu hijo, escríbenos."',
      caption: 'El niño inquieto no necesita que lo calmen. Necesita aprender a regularse. 🧩 Trabajamos coordinación, equilibrio y estrategias corporales que ayudan a niños con TDA/TDAH a participar mejor en su vida diaria.\n\n🧩 Si esto te resuena con tu hijo, escríbenos.\n🧩 Copiapó, Chile',
      hashtags: ['#TDA', '#TDAH', '#NiñosConTDA', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#RegulacionSensorial'],
      productionNotes: ['Aldo a cámara en tono empático y no clínico, hablando a padres cansados de que juzguen a su hijo.'],
      dataDrivenReason: 'Aborda uno de los mayores motivos de consulta en colegios de Copiapó.'
    },
    {
      id: 'm1-p6',
      monthId: 'julio_mes_1',
      postNumber: 6,
      weekDay: 'S2 – Viernes',
      format: 'Post foto',
      topic: 'Quién es Aldo (Historia Personal)',
      type: 'Me Content',
      hookVariants: ['"No elegí la kinesiología infantil por casualidad."'],
      hookScript: '"No elegí la kinesiología infantil por casualidad."',
      needScript: 'Presentar la vocación y misión de crear KinesFera en Copiapó para que los niños tengan un espacio a su medida.',
      valuePoints: [
        'Especialización en neurodivergencia, TDA y autismo.',
        'Donde el juego es la herramienta y el movimiento el lenguaje.',
        'Acompañamiento cercano a las familias sin etiquetas.'
      ],
      ctaScript: '"Si tienes un hijo que te preocupa o quieres saber si necesita evaluación, escríbenos. Primera orientación sin costo."',
      caption: 'No elegí la kinesiología infantil por casualidad. 🧩 Empecé a trabajar con niños y entendí que aquí podía hacer la diferencia más concreta. Me especialicé en neurodivergencia porque son los niños que más veces escuchan que el problema es su conducta, cuando muchas veces el punto de partida está en el cuerpo.\n\nKinesFera nació para que Copiapó tuviera un espacio pensado para ellos. Escríbenos si tienes dudas.\n\n🧩 Copiapó, Chile | @kinesferachile',
      hashtags: ['#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#TDA', '#Autismo', '#KinesiologoPediatrico'],
      productionNotes: ['Foto natural de Aldo en el espacio con materiales de fondo, no foto de estudio fría.'],
      dataDrivenReason: 'Humaniza la marca y construye conexión emocional indispensable en pediatría.'
    },
    {
      id: 'm1-p7',
      monthId: 'julio_mes_1',
      postNumber: 7,
      weekDay: 'S3 – Lunes',
      format: 'Carrusel',
      topic: 'Tortícolis en bebés',
      type: 'You Content',
      hookVariants: ['"¿Tu bebé siempre mira hacia el mismo lado?"'],
      hookScript: '"¿Tu bebé siempre mira hacia el mismo lado? Puede ser tortícolis. Aquí te explico qué hacer."',
      needScript: 'La tortícolis muscular congénita se resuelve rápidamente si se detecta en los primeros 3 meses de vida.',
      valuePoints: [
        'Qué es: tensión del músculo esternocleidomastoideo que limita el giro.',
        'Señales: prefiere mirar a un lado, le cuesta girar, inicio de aplanamiento de cabeza.',
        'Tratamiento: terapia manual suave, estimulación activa y pauta para el hogar.'
      ],
      ctaScript: 'Si notas que tu bebé prefiere mirar hacia un lado, agenda evaluación pronto. Evaluamos desde el primer mes de vida.',
      caption: '¿Tu bebé siempre mira hacia el mismo lado? No lo dejes pasar. 🧩 Puede ser tortícolis muscular congénita, una condición que con evaluación y tratamiento kinésico temprano se resuelve muy bien.\n\nEn los primeros meses, el tiempo importa.\n\n🧩 Guarda esto si tienes un bebé o conoces a alguien embarazada.\n🧩 Copiapó | Escríbenos para coordinar evaluación',
      hashtags: ['#Torticolis', '#BebésSaludables', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#DesarrolloMotor'],
      productionNotes: ['Ilustraciones cuidadas de cuello y posicionamiento sin mostrar rostros de pacientes.'],
      dataDrivenReason: 'Alineado con el protocolo de TMC y los casos derivados por pediatras en Copiapó.'
    },
    {
      id: 'm1-p8',
      monthId: 'julio_mes_1',
      postNumber: 8,
      weekDay: 'S3 – Miércoles',
      format: 'Reel',
      topic: 'Cómo es una primera sesión en KinesFera',
      type: 'Conversión',
      hookVariants: [
        'A) Muchos papás llegan nerviosos porque no saben qué va a pasar en la primera sesión.',
        'B) La primera sesión no empieza con el niño. Empieza con los papás.',
        'C) En la primera sesión, yo no evalúo solo al niño. Evalúo todo.'
      ],
      hookScript: '"Muchos papás llegan nerviosos porque no saben qué va a pasar en la primera sesión."',
      needScript: '"Y lo entiendo. Llevas a tu hijo a un espacio nuevo sin saber cómo va a reaccionar. Eso genera ansiedad. Por eso te explico los 4 momentos."',
      valuePoints: [
        'Momento 1: Conversamos con los papás para entender su contexto.',
        'Momento 2: Observo cómo entra y explora el niño sin forzar nada.',
        'Momento 3: Evaluamos jugando (coordinación, equilibrio, tono).',
        'Momento 4: Cerramos con orientaciones y un plan claro.'
      ],
      ctaScript: '"Primero evaluamos. Después decidimos el mejor camino juntos. ¿Tienes preguntas antes de agendar? Escríbenos."',
      caption: 'La primera sesión no es un examen. Es una conversación. 🧩 Te cuento exactamente qué pasa cuando entras por primera vez a KinesFera, para que tú y tu hijo lleguen tranquilos.\n\n🧩 ¿Tienes preguntas antes de agendar? Escríbenos sin compromiso.\n🧩 Copiapó, Chile',
      hashtags: ['#KinesiologiaInfantil', '#PrimeraSesion', '#Copiapo', '#KinesFera', '#TerapiaInfantil', '#EvaluacionInfantil'],
      productionNotes: ['Aldo a cámara directa en tono tranquilizador explicando los 4 momentos.'],
      dataDrivenReason: 'Baja la barrera de entrada para familias que dudan en agendar por miedo o incertidumbre.'
    },
    {
      id: 'm1-p9',
      monthId: 'julio_mes_1',
      postNumber: 9,
      weekDay: 'S3 – Viernes',
      format: 'Carrusel',
      topic: 'Pie plano infantil: ¿me preocupo o espero?',
      type: 'You Content',
      hookVariants: ['"Mi hijo tiene pie plano: ¿me preocupo o espero?"'],
      hookScript: '"Mi hijo tiene pie plano: ¿me preocupo o espero? La respuesta depende de su edad y de lo que veas."',
      needScript: 'Hasta los 5-6 años cierto grado de pie plano es normal. El tema es cuándo evaluar y si las plantillas bastan.',
      valuePoints: [
        'Alerta si hay dolor en rodillas/pies o tropieza seguido.',
        'Alerta si a los 5 años el arco no aparece al ponerse en puntillas.',
        'Las plantillas solas no corrigen: se requiere fortalecer la musculatura del pie y pierna.'
      ],
      ctaScript: 'Si tienes dudas sobre el pie de tu hijo, evaluemos sin compromiso. Escríbenos en Copiapó.',
      caption: '¿Mi hijo tiene pie plano? ¿Me preocupo o espero? 🧩 Depende de su edad y de los síntomas. En este carrusel te explico cuándo sí actuar y por qué las plantillas necesitan ejercicio muscular.\n\n🧩 Guarda esto y compártelo con otros papás.\n🧩 Copiapó | Escríbenos si quieres evaluar',
      hashtags: ['#PiePlano', '#PiePlanoInfantil', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#DesarrolloInfantil'],
      productionNotes: ['Ilustraciones de huella plantar y postura de marcha.'],
      dataDrivenReason: 'Tema clásico con alta tasa de guardados y consultas espontáneas.'
    },
    {
      id: 'm1-p10',
      monthId: 'julio_mes_1',
      postNumber: 10,
      weekDay: 'S4 – Lunes',
      format: 'Reel',
      topic: '3 errores comunes de padres al notar dificultades motoras',
      type: 'Conversión',
      hookVariants: [
        'A) 3 cosas que los papás hacen con buena intención, pero que pueden retrasar una consulta.',
        'B) Ningún papá hace esto con mala intención. Pero a veces retrasa el tratamiento meses.',
        'C) El peor error que veo en mi consulta no lo cometen los niños. Lo cometen los papás.'
      ],
      hookScript: '"3 cosas que los papás hacen con buena intención, pero que pueden retrasar una consulta."',
      needScript: '"Papás que quieren lo mejor para su hijo, pero que por esperar un poco más, el proceso se complica."',
      valuePoints: [
        'Error 1: Esperar porque "ya se le va a pasar" (se consolidan compensaciones).',
        'Error 2: Compararlo con otros niños (minimiza o exagera sin objetividad).',
        'Error 3: Buscar ejercicios en internet sin diagnóstico previo individual.'
      ],
      ctaScript: '"Una evaluación temprana puede ahorrarte meses de incertidumbre. Agendamos evaluación inicial en Copiapó."',
      caption: 'Ningún papá lo hace con mala intención. Pero a veces retrasa el tratamiento sin saberlo. 🧩 Estos son los 3 errores más comunes que veo en mi consulta. No para juzgar, sino para actuar a tiempo.\n\n🧩 ¿Tienes dudas sobre el desarrollo de tu hijo? Escríbenos.\n🧩 Copiapó, Chile',
      hashtags: ['#KinesiologiaInfantil', '#DesarrolloInfantil', '#Copiapo', '#KinesFera', '#ConsejosPapas', '#TerapiaInfantil'],
      productionNotes: ['Aldo empático y no juzgador, texto en pantalla numerando cada error.'],
      dataDrivenReason: 'Contenido con alto potencial viral y reflexivo.'
    },
    {
      id: 'm1-p11',
      monthId: 'julio_mes_1',
      postNumber: 11,
      weekDay: 'S4 – Miércoles',
      format: 'Carrusel',
      topic: 'Sesión individual vs taller grupal',
      type: 'Conversión',
      hookVariants: ['"No todos los niños necesitan lo mismo: sesión individual vs. taller grupal"'],
      hookScript: '"No todos los niños necesitan lo mismo: sesión individual vs. taller grupal. ¿Cuál es mejor para tu hijo?"',
      needScript: 'Sembrar el terreno para el nuevo servicio grupal que KinesFera está preparando.',
      valuePoints: [
        'Individual: ideal para evaluación, tortícolis, asimetrías o inicio de tratamiento.',
        'Grupal: ideal para niños con evaluación previa, objetivo social y juego colaborativo.',
        'Beneficios del grupo: modelado entre pares, regulación en contexto real y menor costo.',
        'Cómo decidimos: primero evaluamos individual, después recomendamos.'
      ],
      ctaScript: 'Estamos preparando un taller grupal piloto de cupos limitados en Copiapó. Si te interesa, escríbenos ahora.',
      caption: 'No todos los niños necesitan exactamente lo mismo. 🧩 Algunos avanzan mejor en individual y otros se potencian en grupo. Lo que nunca cambia: primero evaluamos, después decidimos.\n\n🧩 Estamos preparando un taller grupal piloto con cupos muy limitados. Si te interesa, escríbenos ahora.\n🧩 Copiapó | @kinesferachile',
      hashtags: ['#PsicomotricidadInfantil', '#TallerGrupal', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#NiñosSaludables'],
      productionNotes: ['La lámina 6 debe tener el CTA visible para captar la lista de espera del taller.'],
      dataDrivenReason: 'Valida la demanda y lista de espera del taller grupal antes del lanzamiento.'
    },
    {
      id: 'm1-p12',
      monthId: 'julio_mes_1',
      postNumber: 12,
      weekDay: 'S4 – Viernes',
      format: 'Reel',
      topic: 'Preguntas frecuentes de padres antes de agendar',
      type: 'CTA Directo',
      hookVariants: [
        'A) Estas son las 4 preguntas que los papás me hacen siempre antes de agendar.',
        'B) Antes de agendar, la mayoría de los papás tiene exactamente estas dudas.',
        'C) Si tienes estas preguntas antes de consultar, este video es para ti.'
      ],
      hookScript: '"Estas son las 4 preguntas que los papás me hacen siempre antes de agendar."',
      needScript: '"Llevas a tu hijo a un lugar nuevo con alguien que no conoces. Es normal tener dudas. Te las respondo todas."',
      valuePoints: [
        '1. ¿Desde qué edad? Desde bebés en el primer mes de vida hasta adolescentes.',
        '2. ¿Necesito orden médica? No es obligatoria para la evaluación inicial.',
        '3. ¿Cuánto dura la sesión? 60 minutos completos.',
        '4. ¿Pueden estar los papás? Sí, es fundamental que participen para replicar en casa.'
      ],
      ctaScript: '"¿Tienes alguna pregunta que no está aquí? Déjala en comentarios o escríbenos directo y coordinamos la evaluación."',
      caption: 'Las 4 preguntas que casi todo papá tiene antes de agendar. 🧩 Las respondo en el video para que llegues sin dudas. ¿Tienes alguna otra pregunta? Déjala en comentarios.\n\n🧩 Copiapó, Chile\n🧩 Escríbenos para agendar',
      hashtags: ['#KinesiologiaInfantil', '#FAQ', '#PreguntasFrecuentes', '#Copiapo', '#KinesFera', '#PsicomotricidadInfantil'],
      productionNotes: ['Formato pregunta en pantalla + respuesta hablada rápida de 65-75 segundos.'],
      dataDrivenReason: 'Elimina las últimas fricciones cognitivas para cerrar evaluaciones del mes.'
    }
  ]
};

// ============================================================================
// MES 2: AGOSTO 2026 (CONSIDERACIÓN + CONVERSIÓN & MÉDICOS)
// Extraído fielmente del documento "Guiones de Contenido Mes 2 - Kinesfera"
// ============================================================================
export const PLAN_MES_2: MonthlyContentPlan = {
  id: 'plan_mes_2',
  monthKey: 'agosto_mes_2',
  monthTitle: 'Mes 2 (Agosto) · Consideración, Casos Concretos & Médicos',
  phase: 'Fase 2: Consideración + Conversión (Profundidad & Alianzas Médicas)',
  objective: 'Pasar del "¿Quiénes somos?" a "¿Por qué KinesFera y cuándo consultar?". Mayor profundidad técnica, casos concretos, contenido compartible para médicos pediatras y llamados directos a agendar evaluación.',
  postsCount: 12,
  nicheAnalysisSummary: {
    clinicDataFindings: 'Consultas entrantes de familias preguntando por plazos de tratamiento y derivaciones de la Dra. Eith Arias y Dr. Rojas.',
    patientTrends: 'Inquietudes de padres sobre diagnóstico diferencial: ¿es conducta o es cuerpo?',
    seasonalNicheContext: 'Mes de invierno/agosto en Atacama: aumento de consultas respiratorias y postura en colegios.',
    bestFormatsRecommended: '7 Reels de conversación directa + 3 Carruseles técnicos + 1 Post humano + 1 Reel estratégico para pediatras.'
  },
  posts: [
    {
      id: 'm2-p1',
      monthId: 'agosto_mes_2',
      postNumber: 1,
      weekDay: 'S1 – Lunes',
      format: 'Reel',
      topic: 'Un mes publicando: lo que aprendimos',
      type: 'Me Content',
      hookVariants: [
        'A) Un mes publicando sobre kinesiología infantil. Esto es lo que aprendimos.',
        'B) Llevamos un mes compartiendo contenido. Y el resultado nos sorprendió.',
        'C) El primer mes fue de presentarnos. El mes 2 lo dedicamos a ti.'
      ],
      hookScript: '"Un mes publicando sobre kinesiología infantil. Esto es lo que aprendimos."',
      needScript: '"Cuando empezamos, no sabíamos muy bien qué quería saber la gente sobre kinesiología infantil en Copiapó. Y algo que no esperábamos pasó: los papás empezaron a escribir con dudas reales que nadie les estaba respondiendo."',
      valuePoints: [
        'Los papás no necesitan tecnicismos difíciles, necesitan claridad.',
        'Las dudas más frecuentes son cuándo ir, qué esperar y cuánto tiempo toma.',
        'Cuando un papá encuentra respuestas claras, confía y actúa.'
      ],
      ctaScript: '"Si llevas tiempo con una duda sobre el desarrollo de tu hijo, este mes 2 es para ti. Déjanos tus dudas o escríbenos."',
      caption: 'El primer mes fue de presentarnos. El mes 2 es para profundizar. 🧩 Un mes publicando nos dejó algo claro: hay muchos papás en Copiapó con dudas reales sobre el desarrollo de sus hijos. Ese es nuestro trabajo. Escríbenos sin compromiso.\n\n🧩 Copiapó, Chile',
      hashtags: ['#KinesiologiaInfantil', '#KinesFera', '#Copiapo', '#DesarrolloInfantil', '#NiñosSaludables'],
      productionNotes: ['Aldo habla desde lo que vivió reflexivamente, no publicitario.'],
      dataDrivenReason: 'Demuestra escucha activa hacia la comunidad de Copiapó.'
    },
    {
      id: 'm2-p2',
      monthId: 'agosto_mes_2',
      postNumber: 2,
      weekDay: 'S1 – Miércoles',
      format: 'Carrusel',
      topic: 'Autismo y cuerpo: más allá de la conducta',
      type: 'You Content',
      hookVariants: ['"Autismo y cuerpo: 5 cosas que van más allá de la conducta"'],
      hookScript: '"Autismo y cuerpo: 5 cosas que van más allá de la conducta. Hay algo que pocas personas explican sobre el autismo y el movimiento."',
      needScript: 'El foco suele estar en lenguaje y conducta, pero el cuerpo también está involucrado.',
      valuePoints: [
        '1. Dispraxia y dificultad de secuenciación motriz.',
        '2. Poca conciencia corporal (busca choques o presión para orientarse).',
        '3. Procesamiento sensorial (hipo o hipersensibilidad).',
        '4. Coordinación bimanual (comer, vestirse, tijeras).',
        '5. La regulación emocional tiene base motriz.'
      ],
      ctaScript: '¿Tu hijo tiene diagnóstico de autismo y nunca ha tenido evaluación kinésica? Puede ser el momento. Escríbenos en Copiapó.',
      caption: 'Cuando hablamos de autismo, hablamos de conducta, lenguaje, socialización. 🧩 Pero hay algo que pocas veces se menciona: el cuerpo también está involucrado. Coordinación, equilibrio y procesamiento sensorial son trabajables desde la kinesiología.\n\n🧩 Guarda esto y compártelo.\n🧩 Copiapó | @kinesferachile',
      hashtags: ['#Autismo', '#TEA', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#NeurodivergenciaCL', '#RegulacionSensorial'],
      productionNotes: ['Diseño más oscuro y de impacto visual.'],
      dataDrivenReason: 'Alineado a las derivaciones de neuropediatría y pautas SPM-2.'
    },
    {
      id: 'm2-p3',
      monthId: 'agosto_mes_2',
      postNumber: 3,
      weekDay: 'S1 – Viernes',
      format: 'Reel',
      topic: '¿Cuánto tarda ver resultados en kinesiología infantil?',
      type: 'Conversión',
      hookVariants: [
        'A) "¿Cuánto tiempo voy a tardar en ver resultados?" – La pregunta que más me hacen antes de agendar.',
        'B) La respuesta honesta a la pregunta que más me hacen los papás antes de empezar.',
        'C) Antes de agendar, casi todo papá me pregunta lo mismo. Aquí la respuesta real.'
      ],
      hookScript: '"¿Cuánto tiempo voy a tardar en ver resultados? La pregunta que más me hacen antes de agendar."',
      needScript: '"Y lo entiendo. Inviertes tiempo, dinero y energía en tu hijo. La respuesta honesta es la que te ayuda a decidir bien."',
      valuePoints: [
        'Semanas 1-3: Familiarización, confianza y participación sin resistencia.',
        'Mes 1-2: Mejoras en equilibrio, coordinación y menos caídas.',
        'A los 3 meses: Cambios funcionales consolidados en la vida diaria.',
        'La variable clave: La constancia de venir y practicar pautas en casa.'
      ],
      ctaScript: '"No te puedo prometer un número mágico de sesiones. Sí te puedo decir que la evaluación te da un mapa claro. Escríbenos."',
      caption: 'La respuesta honesta a la pregunta más frecuente antes de agendar. 🧩 ¿Cuánto tarda ver resultados? Depende del niño y la constancia, pero hay cosas que se notan rápido y una variable que lo cambia todo.\n\n🧩 Copiapó, Chile | Escríbenos',
      hashtags: ['#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#ResultadosReales', '#TerapiaInfantil'],
      productionNotes: ['Tono sincero y directo, desmitificando soluciones milagrosas.'],
      dataDrivenReason: 'Rompe la objeción sobre comprar un paquete de sesiones frente a una sesión suelta.'
    },
    {
      id: 'm2-p4',
      monthId: 'agosto_mes_2',
      postNumber: 4,
      weekDay: 'S2 – Lunes',
      format: 'Carrusel',
      topic: 'Cómo preparar a tu hijo para su primera sesión',
      type: 'Conversión',
      hookVariants: ['"Cómo preparar a tu hijo para su primera sesión de kinesiología"'],
      hookScript: '"Cómo preparar a tu hijo para su primera sesión de kinesiología. Lo que dicen los papás que más ayuda al niño a llegar tranquilo."',
      needScript: 'La anticipación adecuada evita el llanto y la resistencia al llegar al centro.',
      valuePoints: [
        'Qué SÍ decirle: "Vamos a un lugar donde vas a jugar y moverte con alguien que ayuda a niños".',
        'Qué NO decirle: Evitar "no va a doler", "pórtate bien" o "es como el médico".',
        'Traer su peluche o juguete de apego preferido.',
        'Qué pasa si no quiere entrar: no se fuerza nada, la primera sesión es de exploración.'
      ],
      ctaScript: '¿Tienes una primera sesión agendada pronto? Guarda estas láminas. ¿Aún no agendaste? Escríbenos en Copiapó.',
      caption: 'La primera sesión genera más ansiedad en los papás que en el niño. 🧩 Esto es lo que más ayuda al niño a llegar tranquilo, lo que no decirle y cómo prepararse ustedes también.\n\n🧩 Guarda esto antes de tu cita.\n🧩 Copiapó | Escríbenos para agendar',
      hashtags: ['#KinesiologiaInfantil', '#PrimeraSesion', '#Copiapo', '#KinesFera', '#ConsejosPapas'],
      productionNotes: ['Ilustraciones cálidas de padre e hijo.'],
      dataDrivenReason: 'Aumenta la asistencia efectiva y reduce cancelaciones de último minuto.'
    },
    {
      id: 'm2-p5',
      monthId: 'agosto_mes_2',
      postNumber: 5,
      weekDay: 'S2 – Miércoles',
      format: 'Reel',
      topic: 'Cuando el niño no habla, el cuerpo sí habla',
      type: 'You Content',
      hookVariants: [
        'A) Cuando el niño no puede decirlo con palabras, el cuerpo lo dice de otra forma.',
        'B) Hay niños que no encuentran las palabras. Pero su cuerpo lleva meses avisando.',
        'C) Una de las cosas más importantes que aprendí trabajando con niños: el cuerpo habla antes que las palabras.'
      ],
      hookScript: '"Cuando el niño no puede decirlo con palabras, el cuerpo lo dice de otra forma."',
      needScript: '"Un niño que no puede regular sus emociones muchas veces tampoco puede regular su cuerpo. Y un cuerpo no regulado dificulta aprender y concentrarse. Aquí van 4 señales."',
      valuePoints: [
        '1. Busca choques y caídas constantes (su sistema nervioso pide información propioceptiva).',
        '2. No tolera el tacto o abrazos (procesamiento sensorial táctil alterado).',
        '3. Mueve el cuerpo sin parar para concentrarse (el movimiento lo regula).',
        '4. Se cansa muchísimo más que otros niños de su edad.'
      ],
      ctaScript: '"Ninguna de estas señales significa que algo esté mal con tu hijo. Significa que su cuerpo comunica algo que puede trabajarse. Escríbenos."',
      caption: 'Hay niños que llevan meses avisando algo. Solo que el aviso no viene con palabras. 🧩 Estas son 4 señales corporales que pueden trabajarse desde la kinesiología. ¿Reconoces alguna en tu hijo?\n\n🧩 Copiapó | Escríbenos',
      hashtags: ['#KinesiologiaInfantil', '#RegulacionSensorial', '#TDA', '#Autismo', '#Copiapo', '#KinesFera'],
      productionNotes: ['Subtítulos en cada señal numerada en pantalla.'],
      dataDrivenReason: 'Alineado con el protocolo de Habilidades Críticas de Comunicación y Pilar Arnaiz.'
    },
    {
      id: 'm2-p6',
      monthId: 'agosto_mes_2',
      postNumber: 6,
      weekDay: 'S2 – Viernes',
      format: 'Post foto',
      topic: 'Aldo en acción: un momento del trabajo',
      type: 'Me Content',
      hookVariants: ['"Hay días en que un niño llega al espacio sin querer entrar. Y hay días en que no se quiere ir."'],
      hookScript: '"Hay días en que un niño llega al espacio sin querer entrar. Y hay días en que no se quiere ir."',
      needScript: 'Mostrar la realidad cotidiana del trabajo con niños en KinesFera.',
      valuePoints: [
        'El niño no siente que lo evalúan, siente que juega.',
        'No buscamos que coopere obligadamente: buscamos que quiera estar.',
        'Espacio seguro donde el error no se castiga.'
      ],
      ctaScript: '"Si tu hijo necesita evaluación y todavía no has dado el paso, escríbenos. Primera orientación sin costo."',
      caption: 'Hay días en que un niño llega al espacio sin querer entrar. Y hay días en que no se quiere ir. 🧩 Eso segundo pasa cuando el espacio se siente seguro. Cuando el niño no siente que lo están evaluando, sino que está jugando. Eso es KinesFera.\n\n🧩 Copiapó | @kinesferachile',
      hashtags: ['#KinesFera', '#KinesiologiaInfantil', '#Copiapo', '#TerapiaInfantil', '#EspacioTerapeutico'],
      productionNotes: ['Foto espontánea de Aldo ordenando colchonetas o interactuando de espaldas.'],
      dataDrivenReason: 'Publicación de mayor engagement emocional de la semana.'
    },
    {
      id: 'm2-p7',
      monthId: 'agosto_mes_2',
      postNumber: 7,
      weekDay: 'S3 – Lunes',
      format: 'Carrusel',
      topic: 'Escoliosis en niños: cuándo preocuparse',
      type: 'You Content',
      hookVariants: ['"Escoliosis en niños: ¿cuándo es normal y cuándo necesita evaluación?"'],
      hookScript: '"Escoliosis en niños: ¿cuándo es normal y cuándo necesita evaluación? La guía que ningún pediatra tiene tiempo de explicarte en 10 minutos."',
      needScript: 'La escoliosis suele descubrirse tarde en revisiones escolares superficiales.',
      valuePoints: [
        'Diferencia entre actitud postural leve y escoliosis estructural.',
        'Señales: un hombro más alto, una cadera prominente o giba al inclinarse.',
        'La ventana de oro: intervenir antes de la pubertad evita corsé y complicaciones.',
        'El rol kinésico: fortalecimiento específico, reeducación postural y control radiológico.'
      ],
      ctaScript: '¿Notaste algo en la postura de tu hijo? Una evaluación postural dura 30 minutos y te da un mapa claro. Evaluamos desde los 6 años.',
      caption: 'La escoliosis muchas veces se descubre tarde. No porque no hubiera señales. Porque nadie sabía qué mirar. 🧩 En este carrusel: cuándo es normal, cuándo no, y cuándo consultar antes del estirón de crecimiento.\n\n🧩 Guarda esto si tienes hijos entre 6 y 14 años.\n🧩 Copiapó | Escríbenos',
      hashtags: ['#Escoliosis', '#PosturaInfantil', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#SaludInfantil'],
      productionNotes: ['Ilustración de silueta de columna y test de Adams.'],
      dataDrivenReason: 'Atrae consultas de niños escolares más grandes (6 a 14 años).'
    },
    {
      id: 'm2-p8',
      monthId: 'agosto_mes_2',
      postNumber: 8,
      weekDay: 'S3 – Miércoles',
      format: 'Reel',
      topic: '★ Lo que le diría a un pediatra sobre kinesiología infantil',
      type: 'Referidos Médicos',
      hookVariants: [
        'A) Lo que le diría a un pediatra sobre kinesiología infantil. Sin rodeos.',
        'B) Si eres pediatra o conoces uno, este video es para ti.',
        'C) Hay algo que la mayoría de los pediatras no saben sobre kinesiología infantil. Y vale la pena que lo sepan.'
      ],
      hookScript: '"Lo que le diría a un pediatra sobre kinesiología infantil. Sin rodeos."',
      needScript: '"Trabajo con niños con TDA, autismo, tortícolis, pie plano y escoliosis. Y noto que muchos llegan tarde. No porque el pediatra no quiera derivar, sino porque no siempre es claro cuándo un niño no puede esperar. Aquí van 3 criterios."',
      valuePoints: [
        'Criterio 1: Desarrollo motor bajo el rango esperado (no corre a los 2 años, caídas continuas a los 5).',
        'Criterio 2: Diagnóstico neurológico sin evaluación motriz previa (TDA, autismo, retraso).',
        'Criterio 3: Condición musculoesquelética en etapa de crecimiento (tortícolis, pie plano, escoliosis).'
      ],
      ctaScript: '"Si tienes un paciente que encaja en estos criterios y no sabes a quién derivar en Copiapó, estamos disponibles y te mantendremos informado del proceso. Somos KinesFera."',
      caption: 'Para pediatras, médicos y cualquier profesional que trabaje con niños. 🧩 Estos son los 3 criterios más claros de cuándo derivar a kinesiología infantil. Sin rodeos.\n\nSi buscas un kinesiólogo infantil en Copiapó especializado en neurodesarrollo, estamos disponibles.\n\n🧩 KinesFera – Copiapó | Contacto en perfil',
      hashtags: ['#KinesiologiaInfantil', '#Pediatria', '#Copiapo', '#KinesFera', '#DerivacionMedica'],
      productionNotes: [
        'Aldo en uniforme o ropa profesional hablando de colega a colega médico.',
        'Este video se comparte activamente por WhatsApp a la lista de 30 médicos de Copiapó.'
      ],
      dataDrivenReason: 'Contenido ancla para el Motor de Derivadores en Copiapó.'
    },
    {
      id: 'm2-p9',
      monthId: 'agosto_mes_2',
      postNumber: 9,
      weekDay: 'S3 – Viernes',
      format: 'Reel',
      topic: '3 señales de que tu hijo necesita más movimiento',
      type: 'You Content',
      hookVariants: [
        'A) 3 señales de que tu hijo necesita más movimiento del que le estás dando.',
        'B) El cuerpo de tu hijo puede estar pidiendo algo que tú interpretas como otro problema.',
        'C) No es hiperactividad. No es falta de atención. A veces es solo falta de movimiento organizado.'
      ],
      hookScript: '"3 señales de que tu hijo necesita más movimiento del que le estás dando."',
      needScript: '"El ritmo moderno con pantallas y poco patio hace que los niños no descarguen lo que su cuerpo necesita."',
      valuePoints: [
        '1. Se aburre fácil y busca estimulación constante (acumula energía motora).',
        '2. Le cuesta conciliar el sueño o se despierta alterado.',
        '3. Las emociones se desbordan con facilidad ante cualquier frustración pequeña.'
      ],
      ctaScript: '"Si además de estas señales ves dificultades con equilibrio y coordinación, vale la pena evaluarlo. Escríbenos en Copiapó."',
      caption: 'No siempre es TDA. No siempre es falta de disciplina. A veces es falta de movimiento organizado. 🧩 Estas son 3 señales que indican que el cuerpo de tu hijo pide movimiento.\n\n🧩 Copiapó | Escríbenos si quieres evaluar',
      hashtags: ['#KinesiologiaInfantil', '#MovimientoInfantil', '#DesarrolloInfantil', '#Copiapo', '#KinesFera'],
      productionNotes: ['Formato ágil de 60 segundos mostrando materiales de fondo.'],
      dataDrivenReason: 'Muy compartido por mamás en grupos de WhatsApp escolares.'
    },
    {
      id: 'm2-p10',
      monthId: 'agosto_mes_2',
      postNumber: 10,
      weekDay: 'S4 – Lunes',
      format: 'Reel',
      topic: '¿Qué pasa si no intervenimos a tiempo?',
      type: 'Conversión',
      hookVariants: [
        'A) ¿Qué pasa si no intervenimos a tiempo? La respuesta honesta.',
        'B) No digo esto para asustar. Lo digo porque nadie más te lo va a decir directo.',
        'C) "Ya se le va a pasar." Puede ser. Pero también puede no ser. Aquí la diferencia.'
      ],
      hookScript: '"¿Qué pasa si no intervenimos a tiempo? La respuesta honesta."',
      needScript: '"No digo esto para generar miedo, sino porque los papás merecen información real para decidir."',
      valuePoints: [
        'Postural: lo que se resuelve en 2 meses a los 4 años puede requerir años a los 12.',
        'Neurodesarrollo: el niño compensa la falta de coordinación evitando actividades y aislándose.',
        'Autoestima: esperar a ciegas acumula experiencias de fracaso en juegos con sus amigos.'
      ],
      ctaScript: '"Una evaluación no te compromete a un tratamiento. Te da información. Agenda evaluación en KinesFera Copiapó."',
      caption: 'La respuesta que nadie te da directo: ¿qué pasa si no intervenimos? 🧩 En la mayoría de los casos, la ventana de mayor plasticidad se cierra antes de lo que pensamos. No para generar miedo, sino para decidir bien.\n\n🧩 Copiapó, Chile | Escríbenos',
      hashtags: ['#KinesiologiaInfantil', '#IntervencionTemprana', '#Copiapo', '#KinesFera', '#DesarrolloInfantil'],
      productionNotes: ['Tono serio, respetuoso y profesional, sin alarmismo amarillista.'],
      dataDrivenReason: 'Empuja a los papás indecisos del CRM a dar el paso final de agendar.'
    },
    {
      id: 'm2-p11',
      monthId: 'agosto_mes_2',
      postNumber: 11,
      weekDay: 'S4 – Miércoles',
      format: 'Carrusel',
      topic: 'Hipersensibilidad sensorial: cuando el mundo es demasiado',
      type: 'You Content',
      hookVariants: ['"Hipersensibilidad sensorial: cuando el mundo es demasiado para tu hijo"'],
      hookScript: '"Hipersensibilidad sensorial: cuando el mundo es demasiado para tu hijo. Y lo que puedes hacer desde hoy."',
      needScript: 'Cuando el sistema nervioso procesa estímulos con volumen máximo.',
      valuePoints: [
        'Tacto: no tolera etiquetas, lavado de pelo o roces leves.',
        'Audición: se tapa los oídos en malls o fiestas de cumpleaños.',
        'Propiocepción: torpeza motora aparente y búsqueda de presión intensa.',
        'Abordaje kinésico: modulación sensorial desde el movimiento graduado.'
      ],
      ctaScript: '¿Tu hijo tiene hipersensibilidad que interfiere en su día a día? En KinesFera lo evaluamos con pruebas SPM-2. Escríbenos en Copiapó.',
      caption: 'Para algunos niños, el mundo es demasiado. Ruidos muy fuertes, ropa muy áspera. 🧩 Eso tiene nombre: hipersensibilidad sensorial, y tiene abordaje kinésico respetuoso.\n\n🧩 Guarda esto y compártelo.\n🧩 Copiapó | Escríbenos',
      hashtags: ['#HipersensibilidadSensorial', '#ProcesamientoSensorial', '#Autismo', '#TDA', '#KinesiologiaInfantil', '#Copiapo'],
      productionNotes: ['Diseño visual limpio con iconos por cada sentido sensorial.'],
      dataDrivenReason: 'Alineado con el cuestionario estandarizado SPM-2 integrado en la app.'
    },
    {
      id: 'm2-p12',
      monthId: 'agosto_mes_2',
      postNumber: 12,
      weekDay: 'S4 – Viernes',
      format: 'Reel',
      topic: '★ Cupos disponibles + lo que viene el mes 3',
      type: 'CTA Directo',
      hookVariants: [
        'A) Cerramos el mes 2. Estos son los cupos disponibles para empezar evaluación.',
        'B) Dos meses compartiendo contenido. Esto es lo que viene.',
        'C) Si estás leyendo esto y llevas semanas pensando en consultar, este es el video.'
      ],
      hookScript: '"Cerramos el mes 2 de contenido. Y quiero hablarte directo sobre los cupos disponibles."',
      needScript: '"Llevamos dos meses compartiendo todo esto y sé que hay papás que guardan los videos pero aún dudan en consultar. Las dudas son normales, pero no tienes que resolverlas antes de venir: para eso es la evaluación inicial."',
      valuePoints: [
        '60 minutos dedicados exclusivamente a tu hijo.',
        'No requiere orden médica obligatoria para empezar.',
        'Te vas con un mapa y diagnóstico claro de por dónde partir.'
      ],
      ctaScript: '"Si llevas tiempo pensando en esto, escríbenos ahora. Cupos limitados para esta y la próxima semana en Copiapó."',
      caption: 'Dos meses compartiendo contenido. Y un mensaje directo para los que llevan semanas pensando en consultar. 🧩 Las dudas son normales. Para eso es la evaluación inicial.\n\n🧩 Cupos disponibles esta semana en Copiapó.\n🧩 Escríbenos ahora directo al perfil',
      hashtags: ['#KinesFera', '#KinesiologiaInfantil', '#Copiapo', '#EvaluacionInfantil', '#CuposDisponibles'],
      productionNotes: ['CTA explícito y sin suavizar, cerrando agenda presencial.'],
      dataDrivenReason: 'Cierre comercial mensual para cumplir meta de 6 a 8 pacientes activos.'
    }
  ]
};

// ============================================================================
// MES ACTUAL: NOVIEMBRE 2026 (CIERRE ESCOLAR, INFORMES PIE & TALLERES VERANO)
// Diseñado con Inteligencia Analítica combinando datos de la clínica y nicho
// ============================================================================
export const PLAN_MES_NOVIEMBRE: MonthlyContentPlan = {
  id: 'plan_mes_noviembre',
  monthKey: 'noviembre_mes_actual',
  monthTitle: 'Mes Noviembre 2026 · Cierre Escolar, Informes PIE & Talleres de Verano',
  phase: 'Fase 3: Conversión Estacional (Informes Escolares + Preventa Talleres de Verano)',
  objective: 'Aprovechar la coyuntura estacional de Copiapó en Noviembre: 1) Familias buscando informes kinésicos para postulación/cierre PIE 2027; 2) Detección de fatiga y crisis sensoriales de fin de año; 3) Preventa del Taller Grupal Psicomotriz de Verano; 4) Lactantes de primavera con tortícolis/plagiocefalia por calor y coche.',
  postsCount: 12,
  nicheAnalysisSummary: {
    clinicDataFindings: 'En el CRM y fichas de Kinesfera aumentan consultas de colegios (Karla, Claudia, Perla) pidiendo informes de neurodesarrollo e informes sensoriales SPM antes de diciembre.',
    patientTrends: 'Alta presencia de casos con hipertonía distal, TDA y dispraxia que necesitan nivelación antes del paso de curso.',
    seasonalNicheContext: 'Noviembre en Copiapó: fin del año escolar, estrés de exámenes, temperaturas en aumento que limitan juegos al aire libre y búsqueda de actividades estructuradas para el verano.',
    bestFormatsRecommended: 'Estrategia balanceada de 6 Reels (conversión directa y empatía de fin de año) + 5 Carruseles (educación práctica para vacaciones e informes PIE) + 1 Post de equipo.'
  },
  posts: [
    {
      id: 'nov-p1',
      monthId: 'noviembre_mes_actual',
      postNumber: 1,
      weekDay: 'S1 – Lunes',
      format: 'Reel',
      topic: 'Fin de año escolar: ¿por qué tu hijo está más desregulado que nunca?',
      type: 'You Content',
      hookVariants: [
        'A) Si notas a tu hijo más inquieto, irritable o torpe este mes... no es que retrocedió.',
        'B) Noviembre es el mes más difícil para el sistema nervioso de un niño.',
        'C) ¿Tu hijo empezó con más berrinches o caídas ahora en noviembre? Te explico qué pasa.'
      ],
      hookScript: '"Si notas a tu hijo más inquieto, irritable o torpe este mes... no es que retrocedió."',
      needScript: '"Llega noviembre y muchos papás me dicen: "Aldo, mi hijo estaba avanzando súper bien y ahora bota las cosas, se tropieza, no se puede concentrar". Y piensan que algo falló. No falló nada. Su cuerpo está pagando el cansancio acumulado de 9 meses de exigencia escolar."',
      valuePoints: [
        'El cansancio del sistema nervioso reduce el control postural y el tono muscular.',
        'Un cuerpo agotado pierde precisión motora: aumentan las caídas y la desatención.',
        'En niños con TDA o autismo, el sobreestímulo de fin de año satura el procesamiento sensorial.'
      ],
      ctaScript: '"No le exijas que se controle solo con la mente. Dale descarga motriz organizada. En KinesFera ayudamos a regular su cuerpo para cerrar el año en paz. Escríbenos en Copiapó."',
      caption: 'Noviembre no es fácil para los niños. 🧩 El cansancio acumulado del año escolar impacta directo en el cuerpo: más torpeza, más desregulación y menos tolerancia a la frustración.\n\nNo es falta de voluntad. Es un sistema nervioso saturado que necesita movimiento organizado.\n\n🧩 Copiapó, Chile | Escríbenos si notas esto en tu hijo',
      hashtags: ['#FinDeAñoEscolar', '#RegulacionSensorial', '#KinesiologiaInfantil', '#Copiapo', '#TDA', '#KinesFera', '#DesarrolloInfantil'],
      productionNotes: [
        'Aldo a cámara en tono comprensivo, validando el agotamiento de papás e hijos en noviembre.',
        'Subtítulos claros. Duración 60-70 segundos.'
      ],
      dataDrivenReason: 'Responde a la desregulación observada en los pacientes del CRM durante el último trimestre escolar.'
    },
    {
      id: 'nov-p2',
      monthId: 'noviembre_mes_actual',
      postNumber: 2,
      weekDay: 'S1 – Miércoles',
      format: 'Carrusel',
      topic: '¿El colegio te pidió informe para el Programa PIE 2027?',
      type: 'Conversión',
      hookVariants: [
        '¿El colegio te pidió informe para el Programa PIE 2027? Lo que debe incluir.'
      ],
      hookScript: '"¿El colegio te pidió informe kinésico para postular o renovar el PIE 2027? Aquí te explico exactamente qué debe contener."',
      needScript: 'Muchos colegios cierran carpetas PIE en noviembre y los padres no saben qué profesional emite la evaluación motriz estandarizada.',
      valuePoints: [
        '1. La kinesiología infantil evalúa coordinación, tono, praxias (Da Fonseca) y sensorialidad (SPM).',
        '2. El informe oficial con diagnóstico funcional CIF es válido para comités de integración escolar.',
        '3. Plazos críticos: tramitar la evaluación en noviembre asegura cupo antes del cierre administrativo.',
        '4. En KinesFera emitimos informes detallados de entrega rápida con pautas para el aula.'
      ],
      ctaScript: '¿Necesitas informe kinésico para el colegio de tu hijo en Copiapó? Agenda tu evaluación esta semana para tener el documento a tiempo.',
      caption: '¿Te pidieron informe para el Programa PIE antes de terminar el año? 🧩 No lo dejes para última hora. Una evaluación kinésica integral con perfil sensorial y diagnóstico CIF entrega datos objetivos que los educadores necesitan para apoyar a tu hijo en 2027.\n\n🧩 En KinesFera evaluamos y emitimos informes completos en Copiapó.\n🧩 Escríbenos para agendar',
      hashtags: ['#ProgramaPIE', '#InformeKinesico', '#KinesiologiaInfantil', '#Copiapo', '#InclusionEscolar', '#KinesFera'],
      productionNotes: [
        'Carrusel de 7 láminas con diseño sobrio y profesional que transmita rigurosidad técnica.',
        'Mencionar explícitamente colegios y jardines de Copiapó.'
      ],
      dataDrivenReason: 'Alta estacionalidad: noviembre es el mes récord de solicitudes de informes para renovación de cupos escolares en Chile.'
    },
    {
      id: 'nov-p3',
      monthId: 'noviembre_mes_actual',
      postNumber: 3,
      weekDay: 'S1 – Viernes',
      format: 'Reel',
      topic: 'Bebés nacidos en primavera: calor, coche y riesgo de cabeza plana',
      type: 'You Content',
      hookVariants: [
        'A) Si tu bebé nació hace pocos meses y empezó el calor en Copiapó, cuidado con esto.',
        'B) El motivo oculto por el que en primavera y verano aumentan los casos de plagiocefalia.',
        'C) ¿Tu bebé suda en el coche y pasa mucho rato de espaldas? Esto te interesa.'
      ],
      hookScript: '"Si tu bebé nació hace pocos meses y empezó el calor en Copiapó, cuidado con esto."',
      needScript: '"Con el calor, usamos más el coche con telas sintéticas, sillas nido y bouncers frescos. El problema es que el bebé pasa horas apoyando exactamente el mismo lado de la cabeza sobre superficies duras mientras dormita."',
      valuePoints: [
        'La gravedad constante en un cráneo blando produce aplanamiento en solo 3 semanas.',
        'Cómo alternar el tummy time sin que el bebé sufra por el calor (sobre el pecho de los papás con pañal o colchoneta fresca).',
        'Señal de alerta: oreja desplazada hacia adelante o frente abombada.'
      ],
      ctaScript: '"Medimos la simetría con craneómetro exacto. Si notas su cabecita plana o cuello tenso, escríbenos en Copiapó."',
      caption: 'El calor de Copiapó cambia las rutinas de los bebés. 🧩 Más tiempo en coche y huevito significa más presión sobre el mismo lado del cráneo. En los primeros 6 meses, prevenir la plagiocefalia es rápido y simple.\n\n🧩 Evaluamos con craneometría objetiva en Copiapó.\n🧩 Escríbenos para orientarte',
      hashtags: ['#Plagiocefalia', '#LactantesCopiapo', '#Torticolis', '#KinesiologiaInfantil', '#CuidadoDelBebe', '#KinesFera'],
      productionNotes: ['Aldo mostrando un craneómetro y explicando cómo se mide en milímetros sin dolor.'],
      dataDrivenReason: 'Alineado con el protocolo de asimetrías craneales y consultas de lactantes en el CRM.'
    },
    {
      id: 'nov-p4',
      monthId: 'noviembre_mes_actual',
      postNumber: 4,
      weekDay: 'S2 – Lunes',
      format: 'Carrusel',
      topic: 'Adelanto Exclusivo: Taller de Psicomotricidad Verano 2027 en KinesFera',
      type: 'Conversión',
      hookVariants: [
        '¿Qué hará tu hijo en vacaciones? Llega el Taller de Psicomotricidad Verano KinesFera'
      ],
      hookScript: '"¿Qué hará tu hijo en vacaciones? Abrimos lista de espera para el Taller Grupal de Psicomotricidad & Neurodesarrollo."',
      needScript: 'Las vacaciones en Copiapó pueden significar semanas de encierro y pantallas si no hay actividades que estimulen el cuerpo.',
      valuePoints: [
        'Grupos reducidos de 3 a 5 niños por cohorte de edad (2-4 años y 5-8 años).',
        'Juego psicomotriz libre y guiado, coordinación dinámica, equilibrio y autorregulación.',
        'Filtro de ingreso clínico: evaluación individual previa para asegurar que el grupo sea un éxito.',
        'Precio pack accesible: 4 sesiones grupales al valor de una fracción de sesiones individuales.'
      ],
      ctaScript: 'Cupos ultra limitados para garantizar atención personalizada. Escríbenos la palabra VERANO para enviarte los detalles y asegurar tu cupo piloto.',
      caption: '¡Se vienen las vacaciones y el cuerpo de los niños lo sabe! 🧩 Estamos preparando el Taller Grupal de Psicomotricidad KinesFera en Copiapó: un espacio donde el movimiento, el juego con otros niños y los desafíos motores serán los protagonistas.\n\nGrupos pequeños (3-5 niños). Cupos prioritarios para familias de nuestra comunidad.\n\n🧩 Escríbenos VERANO para recibir la información\n🧩 Copiapó, Chile',
      hashtags: ['#TallerDeVerano', '#PsicomotricidadInfantil', '#Copiapo', '#KinesFera', '#VacacionesNiños', '#Neurodesarrollo'],
      productionNotes: ['Láminas dinámicas con fotos del espacio sensorial y bloques de espuma.'],
      dataDrivenReason: 'Cumple el objetivo estratégico de la asesoría: validar y vender el nuevo servicio grupal con anticipación.'
    },
    {
      id: 'nov-p5',
      monthId: 'noviembre_mes_actual',
      postNumber: 5,
      weekDay: 'S2 – Miércoles',
      format: 'Reel',
      topic: '¿Camina en puntillas? Cuándo es costumbre y cuándo consultar',
      type: 'You Content',
      hookVariants: [
        'A) ¿Tu hijo camina en puntas de pie? Te cuento lo que pocos explican.',
        'B) No siempre es un problema de tendón: la marcha en puntillas y su origen sensorial.',
        'C) Si tiene más de 3 años y sigue caminando en puntillas, mira este video.'
      ],
      hookScript: '"¿Tu hijo camina en puntas de pie? Te cuento lo que pocos explican."',
      needScript: '"Hasta los 2-3 años puede ser una fase exploratoria normal. Pero si persiste, hay dos causas principales que evaluamos en kinesiología: tensión del tendón de Aquiles O búsqueda sensorial propioceptiva."',
      valuePoints: [
        'Causa 1: Acortamiento de gemelos y restricción de dorsiflexión de tobillo.',
        'Causa 2: Hipersensibilidad táctil (no tolera apoyar la planta completa en el suelo).',
        'Causa 3: Búsqueda de impacto en articulaciones para sentir dónde está su cuerpo.',
        'Por qué tratarlo: caminar en puntillas prolongado altera rodillas, caderas y postura.'
      ],
      ctaScript: '"Evaluamos la marcha y el perfil sensorial en KinesFera Copiapó. Escríbenos si tienes dudas con tu hijo."',
      caption: 'La marcha en puntillas es una de las consultas más frecuentes en kinesiología infantil. 🧩 No siempre es falta de costumbre: muchas veces hay una causa biomecánica o sensorial que necesita abordaje.\n\n🧩 En KinesFera evaluamos movilidad de tobillo y procesamiento sensorial.\n🧩 Copiapó | Escríbenos para coordinar',
      hashtags: ['#MarchaEnPuntillas', '#KinesiologiaInfantil', '#Copiapo', '#DesarrolloMotor', '#KinesFera', '#PieInfantil'],
      productionNotes: ['Demostración breve de medición de ángulo de tobillo sin calzado.'],
      dataDrivenReason: 'Motivo de consulta recurrente en pediatras de la red de Copiapó.'
    },
    {
      id: 'nov-p6',
      monthId: 'noviembre_mes_actual',
      postNumber: 6,
      weekDay: 'S2 – Viernes',
      format: 'Post foto',
      topic: 'El valor de la familia: la terapia no termina en la consulta',
      type: 'Me Content',
      hookVariants: ['"Lo que logramos en 60 minutos se multiplica en casa."'],
      hookScript: '"Lo que logramos en 60 minutos se multiplica en casa."',
      needScript: 'Agradecer a las familias de KinesFera que han sido constantes durante el año.',
      valuePoints: [
        'Los papás no son acompañantes pasivos en KinesFera: son co-terapeutas.',
        'Enseñar juegos sencillos para replicar en el living o en la plaza.',
        'Celebrar cada pequeño hito conquistado juntos este 2026.'
      ],
      ctaScript: '"A todas las familias que han confiado este año: gracias. Y si estás pensando en sumarte, las puertas están abiertas en Copiapó."',
      caption: 'Lo que pasa en 60 minutos en la consulta es solo el punto de partida. 🧩 El verdadero cambio ocurre cuando los papás aprenden las pautas y las integran en la rutina del hogar jugando.\n\nGracias a cada familia que este año confió en KinesFera para acompañar el desarrollo de sus hijos. Estamos en Copiapó para ustedes.\n\n🧩 Copiapó, Chile | @kinesferachile',
      hashtags: ['#KinesFera', '#FamiliaKinesfera', '#KinesiologiaInfantil', '#Copiapo', '#Neurorehabilitacion'],
      productionNotes: ['Foto cálida de materiales de juego y pautas ilustradas en mesa de trabajo.'],
      dataDrivenReason: 'Fomenta la fidelización de ex-pacientes y el boca a boca.'
    },
    {
      id: 'nov-p7',
      monthId: 'noviembre_mes_actual',
      postNumber: 7,
      weekDay: 'S3 – Lunes',
      format: 'Carrusel',
      topic: '3 pruebas estandarizadas que aplicamos en KinesFera (HINE, Arnaiz, SPM)',
      type: 'You Content',
      hookVariants: ['"Cómo evaluamos científicamente a tu hijo en KinesFera (sin adivinar)"'],
      hookScript: '"Cómo evaluamos científicamente a tu hijo en KinesFera. No adivinamos: usamos protocolos validados."',
      needScript: 'Diferenciador clínico: KinesFera no hace "ejercicios genéricos", aplica tests reconocidos internacionalmente.',
      valuePoints: [
        '1. Examen de Hammersmith (HINE): 78 puntos para neurodesarrollo en menores de 2 años.',
        '2. Pauta de Pilar Arnaiz: observación motriz en sesión de juego libre y psicomotricidad.',
        '3. Batería Da Fonseca (BPM): 7 factores psicomotores si el niño sigue órdenes.',
        '4. SPM-2 (Sensory Processing Measure): perfil sensorial completo en hogar y escuela.'
      ],
      ctaScript: 'Una evaluación con datos objetivos te da certeza diagnóstica y tranquilidad. Agenda la de tu hijo en Copiapó.',
      caption: 'En kinesiología infantil no trabajamos al ojo ni con recetas estándar. 🧩 En KinesFera aplicamos protocolos validados internacionalmente que miden hitos motores, tono y perfil sensorial con rigurosidad.\n\nPara que tengas un informe claro, objetivo y útil para su médico o colegio.\n\n🧩 Copiapó, Chile | Escríbenos para agendar',
      hashtags: ['#EvaluacionEstandarizada', '#HINE', '#SPM2', '#DaFonseca', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera'],
      productionNotes: ['Muestra capturas de gráficos y tablas de la app de Kinesfera para reforzar innovación.'],
      dataDrivenReason: 'Refuerza la autoridad técnica del centro frente a derivadores médicos y colegios.'
    },
    {
      id: 'nov-p8',
      monthId: 'noviembre_mes_actual',
      postNumber: 8,
      weekDay: 'S3 – Miércoles',
      format: 'Reel',
      topic: '★ Mensaje para fonoaudiólogos y psicólogos infantiles de Copiapó',
      type: 'Referidos Médicos',
      hookVariants: [
        'A) Para los fonoaudiólogos y psicólogos que atienden niños en Copiapó: esto les va a interesar.',
        'B) Cuando el lenguaje o la conducta se estancan, miren el cuerpo.',
        'C) ¿Cómo se complementa la kinesiología con la fonoaudiología y psicología infantil?'
      ],
      hookScript: '"Para los fonoaudiólogos y psicólogos infantiles de Copiapó: esto les va a interesar."',
      needScript: '"Muchas veces trabajamos con el mismo niño. El fonoaudiólogo busca la comunicación, el psicólogo la regulación emocional... y nosotros trabajamos la base corporal que sostiene a ambas."',
      valuePoints: [
        'Un niño con tono postural bajo se fatiga en la silla y no mantiene la atención en sesión de fono.',
        'La dispraxia motriz general muchas veces acompaña a la dispraxia verbal y retraso del habla.',
        'La regulación sensorial en sala kinésica desbloquea la disposición del niño para interactuar.',
        'Propuesta de alianza interdisciplinar y derivación cruzada en Copiapó.'
      ],
      ctaScript: '"Si atiendes niños en Copiapó y quieres articular una red de derivación directa con informes compartidos, hablemos. Escríbeme directo."',
      caption: 'El neurodesarrollo no es un territorio aislado: es un equipo. 🧩 Para mis colegas fonoaudiólogos, psicólogos infantiles y terapeutas ocupacionales de Copiapó: cuando sumamos el trabajo del cuerpo, los resultados en habla y conducta se aceleran.\n\nTrabajemos en red por los niños de nuestra ciudad.\n\n🧩 Aldo Olivares · KinesFera Copiapó\n🧩 Contáctame directo por mensaje',
      hashtags: ['#FonoaudiologiaCopiapo', '#PsicologiaInfantil', '#Interdisciplina', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera'],
      productionNotes: [
        'Aldo en tono colaborativo y profesional dirigiéndose a los profesionales del directorio comercial (Rodrigo Castro, Estefanía Jorquera, Ingrid Miranda, etc.).'
      ],
      dataDrivenReason: 'Activa la red de 10 fonoaudiólogos y psicólogos del directorio comercial de Kinesfera.'
    },
    {
      id: 'nov-p9',
      monthId: 'noviembre_mes_actual',
      postNumber: 9,
      weekDay: 'S3 – Viernes',
      format: 'Carrusel',
      topic: '3 juegos de living que ayudan a regular a niños con TDA y autismo',
      type: 'You Content',
      hookVariants: ['"3 juegos de living que ayudan a regular el sistema nervioso de tu hijo este fin de semana"'],
      hookScript: '"3 juegos de living que ayudan a regular el sistema nervioso de tu hijo este fin de semana sin gastar en juguetes caros."',
      needScript: 'Consejos prácticos y aterrizados para que los papás apliquen en casa durante el fin de semana.',
      valuePoints: [
        '1. La oruga en la alfombra: rodar apretado entre frazadas (estímulo propioceptivo profundo).',
        '2. Empujar la pared o el sillón: trabajo de fuerza isométrica que descarga la inquietud motriz.',
        '3. El piso de lava con cojines: entrenamiento de equilibrio, planificación motora y saltos precisos.'
      ],
      ctaScript: '¿Probaste alguno de estos juegos? Cuéntame en comentarios cómo reaccionó tu hijo. Y guarda este carrusel para el fin de semana.',
      caption: 'No necesitas materiales caros para ayudar a tu hijo a regularse en casa. 🧩 Con cojines, frazadas y el suelo del living puedes estimular el equilibrio y la propiocepción de forma divertida.\n\n🧩 Guarda estos 3 juegos para este fin de semana.\n🧩 Copiapó, Chile',
      hashtags: ['#JuegosEnCasa', '#RegulacionSensorial', '#TDAH', '#AutismoChile', '#KinesiologiaInfantil', '#Copiapo'],
      productionNotes: ['Ilustraciones claras paso a paso de cada juego casero.'],
      dataDrivenReason: 'Genera interacción masiva y comentarios orgánicos de mamás.'
    },
    {
      id: 'nov-p10',
      monthId: 'noviembre_mes_actual',
      postNumber: 10,
      weekDay: 'S4 – Lunes',
      format: 'Reel',
      topic: '¿Sesión suelta o Pack de Tratamiento? La diferencia real en resultados',
      type: 'Conversión',
      hookVariants: [
        'A) ¿Por qué en kinesiología infantil no recomendamos venir a una sola sesión suelta?',
        'B) Lo que nadie te explica sobre cómo se consolida un cambio motor en el cerebro de un niño.',
        'C) ¿Vale la pena comprar un pack de sesiones o pagar una por una?'
      ],
      hookScript: '"¿Por qué en kinesiología infantil no recomendamos venir a una sola sesión suelta?"',
      needScript: '"A veces los papás me preguntan si pueden venir a una sesión a ver si se le quita la maña o el dolor. Y mi respuesta es muy honesta: la plasticidad cerebral requiere frecuencia y repetición."',
      valuePoints: [
        'La primera sesión evalúa y traza el mapa; no es una intervención mágica aislada.',
        'Un pack de 4 u 8 sesiones permite consolidar el patrón motor nuevo y que el cerebro no vuelva a compensar.',
        'El pack incluye reevaluaciones con mediciones numéricas exactas (grados de giro, milímetros de asimetría) sin costo extra.',
        'Garantiza compromiso familiar y ahorro económico significativo.'
      ],
      ctaScript: '"Conoce nuestros paquetes de tratamiento y cómo estructuramos el camino de tu hijo. Escríbenos en Copiapó."',
      caption: 'En neurodesarrollo los cambios reales no ocurren por magia en una sola cita. 🧩 Ocurren por constancia, repetición y trabajo conjunto entre la clínica y el hogar. Por eso diseñamos programas estructurados con seguimiento continuo.\n\n🧩 Escríbenos para conocer los packs y opciones en Copiapó.\n🧩 KinesFera',
      hashtags: ['#PaquetesTerapeuticos', '#KinesiologiaInfantil', '#Copiapo', '#Neurodesarrollo', '#KinesFera'],
      productionNotes: ['Aldo explicando con claridad y convicción el valor del tratamiento continuo.'],
      dataDrivenReason: 'Alineado a la meta comercial de cerrar packs de 4 y 8 sesiones frente a consultas sueltas.'
    },
    {
      id: 'nov-p11',
      monthId: 'noviembre_mes_actual',
      postNumber: 11,
      weekDay: 'S4 – Miércoles',
      format: 'Carrusel',
      topic: 'Checklist Motor del Niño de 2 a 5 años: ¿qué debería hacer?',
      type: 'You Content',
      hookVariants: ['"Checklist del Desarrollo Motor (2 a 5 años): señales esperables por edad"'],
      hookScript: '"Checklist del Desarrollo Motor de 2 a 5 años. Revisa si tu hijo cumple estos hitos o si necesita estimulación."',
      needScript: 'Dudas comunes de familias sobre cuándo un niño debería saltar en dos pies, correr sin caerse o subir escaleras alternando.',
      valuePoints: [
        '2 años: corre con soltura, patea una pelota sin caerse, sube escaleras con apoyo.',
        '3 años: se mantiene en un pie por breves segundos, pedalea en triciclo, salta hacia adelante.',
        '4 años: sube y baja escaleras alternando pies, atrapa una pelota grande con ambas manos.',
        '5 años: salta en un pie repetidamente, marcha coordinada, equilibrio dinámico en vigas.'
      ],
      ctaScript: 'Si tu hijo presenta rezago en alguno de estos hitos, una evaluación kinésica temprana marca la diferencia. Escríbenos en Copiapó.',
      caption: 'Cada niño tiene su propio ritmo, pero hay hitos motores que nos indican si su sistema neuromuscular está madurando adecuadamente. 🧩 Revisa este checklist y guarda la información.\n\n🧩 Copiapó, Chile | Escríbenos para evaluar',
      hashtags: ['#ChecklistMotor', '#DesarrolloInfantil', '#HitosMotores', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera'],
      productionNotes: ['Formato semáforo o checklist visual con casillas interactivas.'],
      dataDrivenReason: 'Gran tracción en padres primerizos y educadoras de párvulos.'
    },
    {
      id: 'nov-p12',
      monthId: 'noviembre_mes_actual',
      postNumber: 12,
      weekDay: 'S4 – Viernes',
      format: 'Reel',
      topic: '★ Cierre Noviembre: Cupos abiertos para Diciembre y Taller de Verano',
      type: 'CTA Directo',
      hookVariants: [
        'A) Cerramos noviembre y abrimos los últimos cupos de evaluación del año.',
        'B) Si querías evaluar a tu hijo antes de que termine el año escolar, este es el momento.',
        'C) Quedan solo 6 cupos para evaluaciones en diciembre en KinesFera.'
      ],
      hookScript: '"Cerramos noviembre y abrimos los últimos cupos de evaluación del año en KinesFera Copiapó."',
      needScript: '"Diciembre se pasa volando con licenciaturas, fiestas y paseos. Si dejas la evaluación para el próximo año, son 3 meses más de dudas e incertidumbre."',
      valuePoints: [
        'Evaluación inicial completa de 60 minutos con entrega de informe.',
        'Plan estructurado para comenzar de inmediato o pre-inscribirte al Taller Grupal de Verano.',
        'Atendemos de lunes a viernes en Copiapó.'
      ],
      ctaScript: '"Escríbenos ahora directo por WhatsApp o mensaje privado para asegurar tu hora antes del cierre de agenda."',
      caption: 'Cerramos noviembre con agenda abierta para evaluaciones de diciembre y pre-inscripción al Taller de Verano. 🧩 No dejes la salud motriz de tu hijo para el próximo año.\n\n🧩 Copiapó, Chile\n🧩 Escríbenos ahora para agendar tu evaluación',
      hashtags: ['#CuposDiciembre', '#KinesiologiaInfantil', '#Copiapo', '#KinesFera', '#EvaluacionPediátrica'],
      productionNotes: ['Reel directo a cámara con CTA enfático y sentido de urgencia real.'],
      dataDrivenReason: 'Cierre comercial de fin de mes y llenado de la agenda para el último mes del año.'
    }
  ]
};

// ============================================================================
// COLECCIÓN CONSOLIDADA DE PLANES DISPONIBLES
// ============================================================================
export const ALL_MONTHLY_PLANS: MonthlyContentPlan[] = [
  PLAN_MES_NOVIEMBRE, // Default / Mes Actual
  PLAN_MES_1,
  PLAN_MES_2
];
