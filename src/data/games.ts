import type { MirrorFragment, RouletteCategory, TruthQuestion, MysteryBox, WYRQuestion, GameConfig } from "@/types/games";

export const GAME_CONFIGS: GameConfig[] = [
  { id: "mirror", title: "Rompe el Espejo", description: "12 fragmentos de recuerdos, preguntas y confesiones", icon: "🪞", color: "from-purple-600 to-fuchsia-600" },
  { id: "roulette", title: "Ruleta del Destino", description: "Gira y descubre qué pregunta te espera", icon: "🎡", color: "from-amber-600 to-rose-600" },
  { id: "truth", title: "Verdad o Mentira", description: "Adivina si la afirmación es verdadera o falsa", icon: "🔍", color: "from-emerald-600 to-cyan-600" },
  { id: "mystery-box", title: "Caja Misteriosa", description: "Elige una caja y descubre tu sorpresa", icon: "🎁", color: "from-violet-600 to-pink-600" },
  { id: "would-you-rather", title: "Qué Prefieres", description: "Dos opciones, una elección", icon: "⚡", color: "from-orange-600 to-yellow-600" },
];

export const FRAGMENTOS: MirrorFragment[] = [
  { id: 1, type: "pregunta", content: "Si pudieras volver al pasado y cambiar una decisión, ¿cuál sería y por qué?", used: false },
  { id: 2, type: "confesion", content: "Confieso que una vez fingí ser otra persona en una entrevista para causar mejor impresión.", used: false },
  { id: 3, type: "reto", content: "RETO: Durante los próximos 30 segundos, solo puedes hablar en rimas. ¡Empieza ahora!", used: false },
  { id: 4, type: "historia", content: "Cuenta la historia de cómo obtuviste tu primer trabajo en el mundo del entretenimiento.", used: false },
  { id: 5, type: "recuerdo", content: "¿Cuál es tu recuerdo más preciado de la infancia?描述 los detalles que lo hacen especial.", used: false },
  { id: 6, type: "pregunta", content: "¿Qué es lo que más miedo te da perder en este momento de tu vida?", used: false },
  { id: 7, type: "confesion", content: "Nunca lo he dicho en público, pero hubo un momento en que quise renunciar a todo y empezar de cero.", used: false },
  { id: 8, type: "reto", content: "RETO: Llama a tu mejor amigo(a) y dile 'te quiero' sin contexto. No puedes explicar nada.", used: false },
  { id: 9, type: "historia", content: "Comparte la anécdota más divertida que te haya pasado en un evento o presentación en vivo.", used: false },
  { id: 10, type: "recuerdo", content: "¿Cuál fue el momento más feliz de tu carrera? ¿Qué lo hizo tan especial?", used: false },
  { id: 11, type: "pregunta", content: "Si supieras que el mundo se acaba en un año, ¿qué harías diferente?", used: false },
  { id: 12, type: "confesion", content: "Confieso que a veces leo los comentarios negativos y aunque duelan, me motivan a mejorar.", used: false },
];

export const CATEGORIAS_RULETA: RouletteCategory[] = [
  { label: "Amor", emoji: "❤️", color: "#ff1744", questions: [
    "¿Cuál fue tu primer amor y qué pasó?",
    "¿Has vuelto con un ex? ¿Por qué?",
    "¿Qué es lo más romántico que has hecho por alguien?",
    "¿Crees en el amor para siempre?",
    "¿Qué prefieres: amor intenso y corto o amor tranquilo y duradero?",
  ]},
  { label: "Fama", emoji: "👑", color: "#ffd700", questions: [
    "¿Cómo manejas la presión de estar en el ojo público?",
    "¿Qué fue lo más extraño que un fan hizo por ti?",
    "¿Perderías tu privacidad por más fama?",
    "¿Cuál es el mayor mito sobre la fama?",
    "¿Qué harías si dejaras de ser famoso mañana?",
  ]},
  { label: "Carrera", emoji: "🎤", color: "#7c4dff", questions: [
    "¿Cuál fue el momento más difícil de tu carrera?",
    "Si no te dedicaras a esto, ¿qué serías?",
    "¿Qué consejo te darías a ti mismo(a) al empezar?",
    "¿Cuál es tu mayor logro profesional hasta ahora?",
    "¿Has sentido el síndrome del impostor? ¿Cómo lo superaste?",
  ]},
  { label: "Secretos", emoji: "🤫", color: "#00e5ff", questions: [
    "¿Qué secreto nunca le has contado a nadie?",
    "¿Alguna vez tomaste algo que no era tuyo?",
    "¿Qué mentira blanca dices con frecuencia?",
    "¿Qué esconde tu galería de fotos?",
    "¿Alguna vez creaste un perfil falso en redes?",
  ]},
  { label: "Confesiones", emoji: "🔥", color: "#ff6d00", questions: [
    "Confiesa algo que hiciste y de lo que NO te arrepientes.",
    "¿Alguna vez le deseaste mal a alguien?",
    "¿Qué harías si supieras que no habrá consecuencias?",
    "¿Cuál es tu mayor pecado?",
    "Confiesa: ¿alguna vez copiaste en un examen importante?",
  ]},
  { label: "Sueños", emoji: "✨", color: "#e040fb", questions: [
    "¿Cuál es tu sueño más loco que aún no has cumplido?",
    "Si el dinero no importara, ¿qué harías con tu vida?",
    "¿Qué sueño recurrente tienes?",
    "¿Cuál es tu mayor meta para los próximos 5 años?",
    "Si pudieras pedir un deseo ahora mismo, ¿cuál sería?",
  ]},
  { label: "Dinero", emoji: "💸", color: "#00c853", questions: [
    "¿Cuál fue la compra más cara que hiciste por impulso?",
    "¿Qué harías si ganaras la lotería?",
    "¿Prefieres ser rico y famoso o rico y anónimo?",
    "¿Cuál es tu mayor gasto mensual?",
    "¿Invertirías todo tu dinero en un proyecto arriesgado?",
  ]},
  { label: "Drag Life", emoji: "🎭", color: "#d500f9", questions: [
    "¿Cómo descubriste tu identidad drag?",
    "¿Qué personaje famoso sería tu drag madre?",
    "¿Cuál es tu mayor inspiración en el mundo drag?",
    "¿Qué canción sería el soundtrack de tu vida drag?",
    "Si pudieras intercambiar armario con otra drag, ¿con quién?",
  ]},
];

export const PREGUNTAS_TRUTH: TruthQuestion[] = [
  { id: 1, statement: "El 90% de las personas habla sola cuando está en casa.", truth: true, explanation: "Estudios muestran que más del 90% de las personas admiten hablar solas regularmente." },
  { id: 2, statement: "Las huellas dactilares de los koalas son indistinguibles de las humanas.", truth: true, explanation: "Los koalas tienen huellas dactilares tan similares a las humanas que pueden confundir a los forenses." },
  { id: 3, statement: "Los flamencos nacen de color rosa.", truth: false, explanation: "Los flamencos nacen grises y se vuelven rosas por su dieta de camarones y algas." },
  { id: 4, statement: "La miel nunca caduca.", truth: true, explanation: "Se han encontrado vasijas de miel en tumbas egipcias de hace 3000 años que aún eran comestibles." },
  { id: 5, statement: "Los elefantes pueden saltar.", truth: false, explanation: "Los elefantes son los únicos mamíferos que no pueden saltar debido a su estructura ósea." },
  { id: 6, statement: "El corazón humano late aproximadamente 100,000 veces al día.", truth: true, explanation: "El corazón late entre 60 y 100 veces por minuto, sumando más de 100,000 latidos diarios." },
  { id: 7, statement: "El agua congelada se expande, por eso el hielo flota.", truth: true, explanation: "El agua es una de las pocas sustancias que se expande al congelarse, haciéndola menos densa." },
  { id: 8, statement: "Los humanos tienen 5 sentidos.", truth: false, explanation: "Los humanos tienen al menos 9 sentidos: equilibrio, temperatura, dolor, propiocepción, etc." },
  { id: 9, statement: "El Monte Everest es la montaña más alta del mundo.", truth: false, explanation: "El Mauna Kea en Hawái es más alto si se mide desde el fondo oceánico." },
  { id: 10, statement: "Las bananas son bayas, pero las fresas no.", truth: true, explanation: "Botánicamente, las bananas clasifican como bayas y las fresas como frutos agregados." },
  { id: 11, statement: "Los dinosaurios aún existen hoy en día.", truth: true, explanation: "Las aves son descendientes directas de los dinosaurios terópodos." },
  { id: 12, statement: "El sol es una estrella amarilla.", truth: false, explanation: "El sol es una estrella blanca; la atmósfera lo hace ver amarillo desde la Tierra." },
  { id: 13, statement: "La Gran Muralla China es visible desde el espacio.", truth: false, explanation: "Ningún astronauta ha podido ver la Gran Muralla a simple vista desde el espacio." },
  { id: 14, statement: "Los pulpos tienen tres corazones.", truth: true, explanation: "Dos corazones bombean sangre a las branquias y uno al resto del cuerpo." },
  { id: 15, statement: "El dinero está hecho de papel.", truth: false, explanation: "Los billetes modernos están hechos de fibra de algodón, no de pulpa de madera." },
];

export const CAJAS_MISTERIOS: MysteryBox[] = [
  { id: 1, type: "premio", content: "🎉 ¡GANASTE! El privilegio de saltarte la siguiente pregunta. ¡Disfrútalo!" },
  { id: 2, type: "reto", content: "🔥 RETO: Tienes 30 segundos para hacer reír a alguien del público. ¡No puedes reírte tú!" },
  { id: 3, type: "confesion", content: "🤫 CONFIESA: ¿Cuál es el rumor más falso que han dicho sobre ti y por qué te molestó?" },
  { id: 4, type: "pregunta", content: "💜 PREGUNTA: ¿Cuál es tu mayor inseguridad y cómo la enfrentas?" },
  { id: 5, type: "karaoke", content: "🎤 KARAOKE: Tienes que cantar 15 segundos de tu canción favorita. ¡Con todo el sentimiento!" },
  { id: 6, type: "bonus", content: "👑 BONUS: Puedes robarle una pregunta a cualquier otra jugadora. ¡Ella tiene que responder!" },
  { id: 7, type: "premio", content: "🎉 ¡GANASTE! El derecho a elegir la siguiente categoría de la ruleta. ¿Cuál será?" },
  { id: 8, type: "reto", content: "🔥 RETO: Habla durante 20 segundos sin parar sobre el primer tema que se te venga a la mente. ¡Ahora!" },
  { id: 9, type: "confesion", content: "🤫 CONFIESA: ¿Alguna vez has traicionado la confianza de alguien? ¿Qué pasó?" },
  { id: 10, type: "pregunta", content: "💜 PREGUNTA: ¿Qué significa para ti 'Detrás del Espejo'? ¿Qué ves cuando te miras?" },
  { id: 11, type: "karaoke", content: "🎤 KARAOKE: Interpreta un comercial inventado en 15 segundos. ¡Que sea creativo!" },
  { id: 12, type: "bonus", content: "👑 BONUS: Puedes hacerle una pregunta directa a cualquiera de las presentes. Respuesta obligatoria." },
];

export const PREGUNTAS_WYR: WYRQuestion[] = [
  { id: 1, optionA: "Fama mundial pero sin privacidad", optionB: "Anonimato total pero con mucho dinero", votesA: 0, votesB: 0 },
  { id: 2, optionA: "Ser joven y pobre toda la vida", optionB: "Ser viejo y millonario toda la vida", votesA: 0, votesB: 0 },
  { id: 3, optionA: "Poder volar pero no contar con internet", optionB: "Teletransportarte pero sin redes sociales", votesA: 0, votesB: 0 },
  { id: 4, optionA: "Saber la fecha exacta de tu muerte", optionB: "Saber la causa exacta de tu muerte", votesA: 0, votesB: 0 },
  { id: 5, optionA: "Ser la persona más divertida del mundo", optionB: "Ser la persona más inteligente del mundo", votesA: 0, votesB: 0 },
  { id: 6, optionA: "Leer la mente de todos", optionB: "Que nadie pueda leer tu mente", votesA: 0, votesB: 0 },
  { id: 7, optionA: "Vivir en el pasado para siempre", optionB: "Vivir en el futuro para siempre", votesA: 0, votesB: 0 },
  { id: 8, optionA: "Tener un talento increíble pero ser odiado", optionB: "Tener talento promedio pero ser amado por todos", votesA: 0, votesB: 0 },
  { id: 9, optionA: "Cometer el error más vergonzoso en público", optionB: "Cometer un error grave en privado", votesA: 0, votesB: 0 },
  { id: 10, optionA: "Perder todos tus recuerdos", optionB: "Nunca poder crear nuevos recuerdos", votesA: 0, votesB: 0 },
];

export const FRAGMENT_TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pregunta: { label: "Pregunta", color: "from-blue-500 to-cyan-500", icon: "❓" },
  confesion: { label: "Confesión", color: "from-red-500 to-rose-500", icon: "🤫" },
  reto: { label: "Reto", color: "from-orange-500 to-amber-500", icon: "🔥" },
  historia: { label: "Historia", color: "from-emerald-500 to-teal-500", icon: "📖" },
  recuerdo: { label: "Recuerdo", color: "from-violet-500 to-purple-500", icon: "💜" },
};

export const MYSTERY_TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  premio: { label: "¡Premio!", color: "from-yellow-500 to-amber-500", icon: "🎉" },
  reto: { label: "Reto", color: "from-red-500 to-orange-500", icon: "🔥" },
  confesion: { label: "Confesión", color: "from-fuchsia-500 to-pink-500", icon: "🤫" },
  pregunta: { label: "Pregunta", color: "from-purple-500 to-violet-500", icon: "💜" },
  karaoke: { label: "Karaoke", color: "from-cyan-500 to-blue-500", icon: "🎤" },
  bonus: { label: "Bonus", color: "from-amber-500 to-yellow-500", icon: "👑" },
};
