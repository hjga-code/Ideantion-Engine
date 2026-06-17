# MANUAL COMPLETO DE USUARIO: IDEATION ENGINE v2.0
El **Ideation Engine** es una plataforma de orquestación de inteligencia artificial de alto rendimiento diseñada para estructurar ideas, refinar contenido, analizar datos, automatizar prompts y organizar planes de forma profesional.

Este manual ofrece un análisis masivo y detallado de cada uno de los 8 workflows de la aplicación, sus respectivos presets (configuraciones preestablecidas) y flujos de trabajo sugeridos.

---

## 🎛️ ESTRUCTURA GENERAL DE LA APLICACIÓN

La aplicación funciona mediante un pipeline de procesamiento inteligente:
1. **Entrada Multimodal:** Admite texto, notas de voz (transcritas automáticamente) e imágenes adjuntas.
2. **Selección de Workflow:** 8 bots especializados con directrices de sistema (System Prompts) aisladas y optimizadas.
3. **Filtro de Presets:** Cada workflow cuenta con sub-configuraciones que fuerzan a la IA a seguir una estructura lógica estricta (e.g., matrices ponderadas, frameworks psicológicos).
4. **Formatos de Salida:** Las respuestas se estructuran automáticamente (HTML, Markdown, JSON, XML o CSV) y pueden descargarse directamente.

---

## 📂 ANÁLISIS DE WORKFLOWS Y PRESETS

### 1. Generación de Contenido (`content-generation`)
*Diseñado para la creación ágil de contenido de marca, copys de redes sociales y scripts multimedia.*

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `SOCIAL_REEL` | Reel / TikTok | Genera un guion detallado que incluye Gancho (Hook), desarrollo visual, guion de voz en off (Voice-over) y pie de foto (Caption) con hashtags. | Videos cortos en Instagram, TikTok o YouTube Shorts. |
| `SOCIAL_CAROUSEL` | Carrusel Educativo | Estructura el contenido diapositiva por diapositiva (Multi-Slide), definiendo la portada, el flujo didáctico y el slide final de llamada a la acción (CTA). | Carruseles informativos para LinkedIn o Instagram. |
| `SOCIAL_POST_COPY` | Post Estático + Caption | Escribe copys directos y persuasivos para acompañar imágenes estáticas o infografías. | Actualizaciones de estado en redes sociales corporativas. |
| `CONTENT_EDUCATIONAL` | Contenido Educativo | Tutoriales y guías paso a paso optimizados para la retención y el aprendizaje del usuario. | Hilos de Twitter (X) o boletines formativos. |
| `CONTENT_ADVERTISING` | Contenido Publicitario | Copys orientados a la conversión directa utilizando ganchos comerciales agresivos y CTAs de compra. | Anuncios patrocinados de pago en Meta Ads. |
| `CONTENT_PERSONAL_BRAND`| Marca Personal | Contenido en primera persona centrado en la autoridad, lecciones de vida, fallos y éxitos profesionales. | Publicaciones orgánicas de liderazgo de opinión en LinkedIn. |
| `CONTENT_CREATOR` | Creadores | Guiones estructurados de formato largo para plataformas de streaming o podcasts. | Introducciones de YouTube o guiones para podcasts. |
| `GENERAL` | General / Auto-Detectar | Estructura libre adaptada automáticamente al texto ingresado por el usuario. | Borradores rápidos y notas sueltas. |

---

### 2. Calendario Inteligente (`smart-calendar`)
*Organización temporal, planeación táctica de publicaciones y gestión de proyectos.*

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `CALENDAR_CONTENT` | Calendario de Contenidos | Tablas cronológicas de planificación para redes sociales que organizan: Fecha, Plataforma, Pilar de Contenido, Idea y Estatus. | Grid de publicaciones mensuales. |
| `CALENDAR_TASKS` | Calendario de Tareas (GTD) | Estructura tareas complejas bajo la metodología Getting Things Done, definiendo contexto, prioridad y fechas límite. | Organización del trabajo semanal. |
| `CALENDAR_PROJECT` | Calendario de Proyecto | Planificación de sprints de desarrollo o hitos de entrega con asignación de responsables y dependencias. | Sprints de desarrollo de software o diseño. |
| `CALENDAR_LAUNCH` | Calendario de Lanzamiento | Hoja de ruta para el prelanzamiento, lanzamiento y post-lanzamiento de productos o servicios. | Lanzamientos de productos SaaS o infoproductos. |
| `CALENDAR_WEEKLY` | Planificación Semanal | Agenda personal organizada en bloques de tiempo enfocada en el balance de productividad y descanso. | Rutina de enfoque semanal. |

---

### 3. SEO y Crecimiento (`seo-growth`)
*Optimización de la visibilidad orgánica en motores de búsqueda tradicionales y sistemas de búsqueda por IA.*

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `SEO_AUDIT` | Auditoría Técnica SEO | Análisis de optimizaciones On-Page y Off-Page: metaetiquetas, encabezados H1-H3, enlaces internos y velocidad. | Optimización de artículos de blog o landing pages. |
| `AD_CAMPAIGN` | Campaña Ads | Copys estructurados para anuncios pagados que respetan las limitaciones de caracteres oficiales (títulos de 30 carac., descripciones de 90 carac.). | Estructuras de Google Ads o Facebook Ads. |
| `KEYWORD_STRATEGY` | Estrategia de Keywords | Agrupación de palabras clave por intención de búsqueda (Informativa, Transaccional) y nivel de volumen/dificultad. | Planificación de contenidos web. |
| `LANDING_COPY` | Copy para Landing Page | Estructuración del flujo visual de una página de destino: Título (H1), propuesta de valor, beneficios, testimonios y llamada a la acción. | Páginas de captura de leads. |
| `GEO_OPTIMIZATION` | Optimización de IA (GEO) | Formateo de contenidos específicos para ser citados por motores de búsqueda basados en inteligencia artificial (Google SGE, Perplexity). | Artículos informativos con alta densidad semántica. |
| `LINKEDIN_AUTHORITY` | Arquitectura LinkedIn | Estrategia de embudo de perfil para convertir visitas en leads de forma orgánica en la red profesional. | Optimización del perfil de ejecutivos. |
| `PROGRAMMATIC_SEO_STRUCT`| Estructura SEO Programático| Diseño de plantillas de datos escalables para generar miles de páginas optimizadas de manera masiva. | Directorios web, comparadores y bases de datos públicas. |

---

### 4. Voz a Estructura (`voice-to-structure`)
*Conversión de discursos o audios desordenados en documentos estructurados, esquemas técnicos u objetos JSON.*

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `NOTES` | Notas / Voz a Texto | Limpieza de transcripciones de audio para organizarlas en notas Markdown limpias con viñetas lógicas. | Dictado rápido de ideas en movimiento. |
| `JSON_SCHEMA` | Esquema JSON Estricto | Convierte una descripción hablada o escrita directamente en un esquema de datos JSON válido y tipado. | Integraciones de software y desarrollo de APIs. |
| `KNOWLEDGE_GRAPH` | Grafo de Conocimiento | Mapea conceptos y entidades conectándolos mediante enlaces bidireccionales compatibles con Obsidian o Roam Research. | Mapeo mental y bases de datos personales. |
| `MEETING_INTEL` | Actas de Reunión | Transforma la transcripción de una llamada en un acta ejecutiva que resalta: Temas, Acuerdos, Responsables y Fechas límite. | Minutas de videollamadas en Teams/Zoom. |
| `LEGAL_EXTRACT` | Extracción Legal | Escaneo y extracción rápida de cláusulas clave, obligaciones de las partes, penalizaciones y fechas de renovación de contratos. | Revisión veloz de acuerdos de confidencialidad (NDA). |

---

### 5. Refinamiento Pro (`pro-refinement`)
*Ingeniería de la escritura. Edición estilística avanzada basada en psicología de la persuasión.*

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `EMAIL` | Email Profesional | Redacción de correos electrónicos corporativos, manteniendo un tono pulido, asertivo y enfocado al grano. | Negociaciones con clientes o comunicaciones internas. |
| `COPYWRITING` | Copy Persuasivo | Estructuración de textos de venta bajo frameworks de conversión como AIDA (Atención, Interés, Deseo, Acción) o PAS (Problema, Agitación, Solución). | Páginas de ventas o correos de marketing. |
| `FOUNDER_MODE` | Founder Mode | Mensajes ultradirectos, honestos y transparentes, libres de corporativismo o adornos innecesarios. | Comunicados clave de fundadores a equipos o inversores. |
| `UX_MICROCOPY` | Microcopy UX | Textos breves para interfaces de usuario (botones, mensajes de error, tooltips) enfocados en guiar al usuario sin fricción. | Copys para aplicaciones web o móviles. |
| `STORYTELLING_MASTER` | Storytelling | Estructuración de discursos bajo la metodología del "Viaje del Héroe" para crear conexiones emocionales con la audiencia. | Presentaciones de marca o discursos de Pitch. |

---

### 6. Motor de Tablas (`table-engine`)
*Procesamiento cuantitativo, bases de datos relacionales, modelos financieros y fórmulas avanzadas.*

> [!IMPORTANT]
> **Integración con Hojas de Cálculo (Excel/Sheets):** El Motor de Tablas genera fórmulas reales y funcionales que comienzan con `=`. Al exportar a CSV y abrir en Excel/Google Sheets, estas fórmulas se calcularán automáticamente en tiempo real.

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `FINANCIAL_MODEL` | Modelo Financiero (P&L) | Genera proyecciones de Pérdidas y Ganancias (P&L), ingresos, COGS y EBITDA con fórmulas reales enlazadas. | Proyecciones financieras de startups. |
| `PRODUCT_ROADMAP` | Product Roadmap | Priorización de funcionalidades ordenadas mediante el framework RICE (Reach, Impact, Confidence, Effort) e indicando estatus y dueños. | Planificación del roadmap de producto. |
| `COMPARISON_MATRIX` | Matriz Comparativa | Matriz de decisión ponderada que evalúa diferentes opciones según criterios personalizados y calcula el ganador aritméticamente. | Evaluación de proveedores o tecnologías. |
| `DATA_ANALYSIS` | Análisis de Datos | Limpieza de datos en bruto, tabla de distribución estadística (promedio, desviación estándar) y conclusiones clave. | Análisis de reportes de ventas o comportamiento web. |
| `PRODUCT_INVENTORY` | Inventario de Productos | Tabla de control de existencias con SKU, costos, precios, valores totales, y alarmas automáticas de reorden. | Gestión de inventario de e-commerce. |
| `FORMULA_INTELLIGENCE` | Generador de Fórmulas | Escribe y diagnostica fórmulas complejas de Excel (INDEX-MATCH, XLOOKUP, QUERY), SQL y expresiones RegEx de forma guiada. | Automatización de hojas de cálculo de analistas de datos. |
| `DATA_VISUALIZATION` | Visualización de Datos | Especificación de gráficos y generación de visualizaciones ASCII dinámicas en formato texto para una lectura visual rápida. | Reportes express en Markdown. |
| `BUDGET_PLANNER` | Presupuestos y Costes | Seguimiento de presupuestos planeados contra gastos reales, calculando desviaciones (varianzas) y ofreciendo acciones de mitigación. | Control de costes de proyectos. |
| `DATABASE_DESIGN` | Diseño de Bases de Datos | Mapeo de tablas de bases de datos relacionales, tipos de datos, llaves primarias/foráneas y scripts de creación SQL DDL. | Arquitectura inicial de bases de datos para desarrollo. |
| `DATA_TABLE` | Tabla de Datos General | Estructuración rápida de información desorganizada en filas y columnas limpias. | Organización de datos en bruto. |
| `PRICING_TABLE` | Tabla de Precios | Estructura de planes de suscripción (e.g. Basic, Pro, Enterprise) comparando características y límites. | Definición del pricing de servicios SaaS. |

---

### 7. Prompt Universal (`universal-prompt`)
*Meta-programación e ingeniería de instrucciones avanzada.*

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `SYSTEM_PROMPT` | System Instruction (XML) | Diseña instrucciones de sistema de nivel corporativo utilizando etiquetas XML limpias para guiar el comportamiento a largo plazo de un LLM. | Configuración de agentes de IA o chatbots de soporte. |
| `PROMPT` | Midjourney / Flux v6 | Diseña prompts visuales ultradetallados especificando estilo, cámara, iluminación y parámetros técnicos (e.g. `--ar 16:9`). | Generación de imágenes publicitarias o Mockups. |
| `VIDEO_GEN_SCRIPT` | Prompt de Video | Prompts cinemáticos altamente descriptivos optimizados para modelos de generación de video modernos (Sora, Luma, Veo). | Generación de reels o cinemáticas sintéticas. |
| `COT_OPTIMIZATION` | Chain of Thought | Reestructura prompts comunes en cadenas lógicas de razonamiento (paso a paso) para obtener respuestas con menor alucinación. | Resolución de problemas lógicos o matemáticos complejos. |
| `SUPER_AGENT_SYSTEM` | Arquitectura de Agente | Estructuración de flujos de trabajo multi-agente, definiendo roles, canales de comunicación y políticas de decisión. | Automatizaciones complejas de software. |

---

### 8. Lluvia de Ideas (`brainstorming`)
*Pensamiento lateral y marcos lógicos de innovación estratégica.*

| Preset | Nombre Localizado | Descripción y Estructura de Salida | Caso de Uso Ideal |
| :--- | :--- | :--- | :--- |
| `BLUE_OCEAN` | Estrategia Blue Ocean | Analiza mercados competitivos y define una propuesta de valor única eliminando, reduciendo, incrementando y creando variables. | Estrategia de posicionamiento de startups. |
| `STARTUP_VALIDATION` | Validación (Mom Test) | Diseña cuestionarios empíricos de validación de problemas enfocados en evitar respuestas condescendientes o sesgadas. | Investigación de mercado de fundadores. |
| `PRE_MORTEM` | Análisis Pre-Mortem | Asume de forma retrospectiva el fracaso catastrófico de un proyecto para mapear de antemano las causas y planificar defensas. | Evaluación de riesgos en el lanzamiento de un proyecto. |

---

## 💾 FORMATOS DE EXPORTACIÓN Y EXCELENCIA VISUAL

- **Rendimiento de Tablas en Pantalla:**
  Las tablas se renderizan en el navegador como cuadrículas HTML interactivas con sombreado de filas y hover. En móviles, cuentan con deslizamiento horizontal táctil para evitar saltos de línea molestos.
- **Exportar a Excel / Google Sheets (CSV):**
  Al seleccionar la descarga en formato CSV, la aplicación extrae la tabla automáticamente (limpiando formatos markdown) y exporta un documento que Excel abrirá reconociendo todas las fórmulas dinámicas.
- **Exportar a PDF y Word:**
  La exportación a PDF formatea el documento con hojas de estilo personalizadas limpias, fuentes profesionales (Inter y JetBrains Mono) y márgenes de impresión óptimos.

---

## 💡 USO DEL PROMPT MAESTRO (LLM EXTERNO)

Si necesitas estructurar una idea antes de trabajarla en la aplicación, utiliza el botón **Prompt Maestro** en la cabecera:
1. Haz clic en el botón `Prompt Maestro` (💡) de la cabecera (se adaptará a tu idioma seleccionado, EN o ES).
2. Pégalo en tu LLM externo preferido (e.g. Claude, GPT-4).
3. El LLM te guiará en un breve cuestionario técnico para reunir los datos precisos de tu idea.
4. Al finalizar la entrevista, el LLM te entregará un prompt perfectamente optimizado y te indicará exactamente qué **Workflow**, **Preset** y **Formato de salida** configurar en el Ideation Engine para pegar tu prompt estructurado y obtener tu resultado dinámico profesional.
