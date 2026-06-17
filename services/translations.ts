export type UILanguage = 'en' | 'es';

export const TRANSLATIONS = {
  en: {
    // Header
    ideation_engine: 'IDEATION ENGINE',
    chats: 'chats',
    widget: 'WIDGET',
    logout_title: 'Sign out',
    loading: 'Loading...',

    // Sidebar
    new_chat: 'New Session',
    history: 'HISTORY',
    no_sessions: 'No sessions yet',
    rename_chat: 'Rename Chat',
    delete_chat: 'Delete Chat',
    confirm_delete: 'Are you sure you want to delete this session?',
    save: 'Save',
    cancel: 'Cancel',

    // Workflow Grid Title & Descriptions
    workflow_1_title: 'Content Generation',
    workflow_1_desc: 'Reels, carousels, posts, and captions. Content ready to publish with strategic planning included.',
    
    workflow_2_title: 'Smart Calendar',
    workflow_2_desc: 'Content calendars, tasks, projects, and launches. Your plan, structured instantly.',
    
    workflow_3_title: 'SEO & Growth',
    workflow_3_desc: 'Organic and Paid dominance. Technical audits, EEAT strategy, and ad copy designed to convert.',
    
    workflow_4_title: 'Voice to Structure',
    workflow_4_desc: 'Chaos to Order. Synthesize messy voice notes into rigid data structures, valid JSON, or technical documentation.',
    
    workflow_5_title: 'Pro Refinement',
    workflow_5_desc: 'Persuasive Engineering. Elevate drafts to hypnotic narratives using psychological frameworks (AIDA, PAS).',
    
    workflow_6_title: 'Table Engine',
    workflow_6_desc: 'Data Intelligence. Analyze raw data, build budgets, write formulas, design databases and complex inventories.',
    
    workflow_7_title: 'Universal Prompt',
    workflow_7_desc: 'Meta-Programming. Design master instructions to dominate Midjourney v6, Flux, or XML Systems.',
    
    workflow_8_title: 'Brainstorming',
    workflow_8_desc: 'Creative Unlocking. Expand horizons with lateral thinking, SCAMPER, and First Principles.',

    // Input Panel Toggle Tab
    input_panel: 'INPUT PANEL',
    hide: 'HIDE',

    // Input Panel Settings
    provider: 'Provider',
    api_key_placeholder: 'Enter API Key...',
    model: 'Model',
    language: 'Language',
    preset: 'Preset',
    format: 'Format',
    test_connection: 'Test Connection',
    testing: 'Testing...',
    success: 'Success',
    error: 'Error',
    custom_model_placeholder: 'Enter custom model ID (e.g. anthropic/claude-3-5-sonnet)...',
    
    // Connection alerts
    success_alert: 'Connection successful!',
    error_alert: 'Connection failed. Please check your API key.',

    // Input panel text area
    textarea_placeholder: 'Type a prompt, paste files, or record audio...',
    
    // Trial Banner / Audio notification
    audio_input: 'AUDIO INPUT',
    audio_processing: 'Processing audio...',
    max_duration_hint: 'Max duration 10 min',
    image_attached: 'Image attached',

    // Toast notifications
    copy_success: 'Copied to clipboard!',
    clear_images: 'Clear attached images',

    // Widget Mode
    widget_title: 'THINKLAB WIDGET',
    widget_placeholder: 'Speak or type your idea...',
    copy_result: 'COPY RESULT',
  },
  es: {
    // Header
    ideation_engine: 'IDEATION ENGINE',
    chats: 'chats',
    widget: 'WIDGET',
    logout_title: 'Cerrar sesión',
    loading: 'Cargando...',

    // Sidebar
    new_chat: 'Nueva Sesión',
    history: 'HISTORIAL',
    no_sessions: 'Sin sesiones aún',
    rename_chat: 'Renombrar Chat',
    delete_chat: 'Eliminar Chat',
    confirm_delete: '¿Estás seguro de que quieres eliminar esta sesión?',
    save: 'Guardar',
    cancel: 'Cancelar',

    // Workflow Grid Title & Descriptions
    workflow_1_title: 'Generación de Contenido',
    workflow_1_desc: 'Reels, carruseles, posts y captions. Contenido listo para publicar con estrategia incluida.',
    
    workflow_2_title: 'Calendario Inteligente',
    workflow_2_desc: 'Calendarios de contenido, tareas, proyectos y lanzamientos. Tu plan, estructurado al instante.',
    
    workflow_3_title: 'SEO y Crecimiento',
    workflow_3_desc: 'Dominio orgánico y pago. Auditorías técnicas, estrategia EEAT y textos publicitarios para convertir.',
    
    workflow_4_title: 'Voz a Estructura',
    workflow_4_desc: 'Del caos al orden. Sintetiza notas de voz en estructuras de datos rígidas, JSON válido o documentación técnica.',
    
    workflow_5_title: 'Refinamiento Pro',
    workflow_5_desc: 'Ingeniería persuasiva. Eleva borradores a narrativas hipnóticas usando marcos psicológicos (AIDA, PAS).',
    
    workflow_6_title: 'Motor de Tablas',
    workflow_6_desc: 'Inteligencia de Datos. Análisis de datos, presupuestos, fórmulas, bases de datos e inventarios complejos.',
    
    workflow_7_title: 'Prompt Universal',
    workflow_7_desc: 'Meta-programación. Diseña instrucciones maestras para dominar Midjourney v6, Flux o sistemas XML.',
    
    workflow_8_title: 'Lluvia de Ideas',
    workflow_8_desc: 'Desbloqueo creativo. Expande horizontes con pensamiento lateral, SCAMPER y primeros principios.',

    // Input Panel Toggle Tab
    input_panel: 'PANEL DE ENTRADA',
    hide: 'OCULTAR',

    // Input Panel Settings
    provider: 'Proveedor',
    api_key_placeholder: 'Ingresa la API Key...',
    model: 'Modelo',
    language: 'Idioma',
    preset: 'Preset',
    format: 'Formato',
    test_connection: 'Probar Conexión',
    testing: 'Probando...',
    success: 'Éxito',
    error: 'Error',
    custom_model_placeholder: 'Ingresa el ID del modelo personalizado...',

    // Connection alerts
    success_alert: '¡Conexión exitosa!',
    error_alert: 'Conexión fallida. Por favor verifica tu API key.',

    // Input panel text area
    textarea_placeholder: 'Escribe una instrucción, pega imágenes o graba audio...',

    // Trial Banner / Audio notification
    audio_input: 'ENTRADA DE AUDIO',
    audio_processing: 'Procesando audio...',
    max_duration_hint: 'Máx. duración 10 min',
    image_attached: 'Imagen adjunta',

    // Toast notifications
    copy_success: '¡Copiado al portapapeles!',
    clear_images: 'Limpiar imágenes adjuntas',

    // Widget Mode
    widget_title: 'WIDGET THINKLAB',
    widget_placeholder: 'Habla o escribe tu idea...',
    copy_result: 'COPIAR RESULTADO',
  }
};
