
import { ModuleType, PresetType, TargetLanguage, OutputFormat } from "./types";

// --- THE ORCHESTRATOR PROMPT ---
export const THINKLAB_ORCHESTRATOR_PROMPT = `
[[SYSTEM BOOT SEQUENCE: 2026 KERNEL]]
>> ORCHESTRATION MODE: STRICT COMPILER
>> INTERPRETATION LEVEL: LITERAL

ERES UN MOTOR DE TRADUCCIÓN DE INTENCIÓN, NO UN CHATBOT.
Tu objetivo es tomar un INPUT (Texto, Audio, Imagen) y convertirlo en un OUTPUT con un formato exacto.

REGLAS ABSOLUTAS:
1. **CERO PREÁMBULOS:** No saludes. No digas "Aquí tienes". No expliques lo que hiciste.
2. **FIDELIDAD EXTREMA:** Si el usuario da una instrucción en audio, tradúcela al formato solicitado sin perder ni un solo parámetro técnico.
3. **IDENTIDAD:** Asume la "SKILL" cargada a continuación y no te salgas de su marco operativo.
4. **FORMATO:** Si se pide CSV, devuelve SOLO CSV. Si se pide JSON, devuelve SOLO JSON. Si se pide Markdown, devuelve Markdown puro.

[[LOADED SKILL FOLLOWS]]
`;

export const MODULE_DESCRIPTIONS = {
  [ModuleType.IDEATION]: "Brainstorming & SCAMPER",
  [ModuleType.WRITING]: "Pro Refinement & Copy",
  [ModuleType.STRUCTURE]: "Voice to Structure",
  [ModuleType.CODE]: "Content Generation",
  [ModuleType.DESIGN]: "Smart Calendar",
  [ModuleType.PROMPT]: "Universal Prompt",
  [ModuleType.TABLES]: "Table Engine",
  [ModuleType.SEO]: "SEO & Growth"
};

export const MODULE_ICONS = {
  [ModuleType.IDEATION]: "💡", 
  [ModuleType.WRITING]: "✒️", 
  [ModuleType.STRUCTURE]: "🧊", 
  [ModuleType.CODE]: "🎬", 
  [ModuleType.DESIGN]: "🗓️", 
  [ModuleType.PROMPT]: "🧠",
  [ModuleType.TABLES]: "📊",
  [ModuleType.SEO]: "🚀"
};

export const PRESETS: Record<PresetType, string> = {
  'GENERAL': 'General / Auto-Detect',
  
  // WRITING
  'EMAIL': 'Email / Comms',
  'COPYWRITING': 'Copy Persuasivo (Sales)',
  'FOUNDER_MODE': 'Founder Mode (Terse/Direct)',
  'UX_MICROCOPY': 'UX Microcopy / UI Text',
  'STORYTELLING_MASTER': 'Storytelling (Hero Journey)',
  
  // PROMPT
  'PROMPT': 'Midjourney / Flux V6', 
  'SYSTEM_PROMPT': 'System Instruction (XML)', 
  'SUPER_AGENT_SYSTEM': 'Super Agent Architect',
  'VIDEO_GEN_SCRIPT': 'Video Gen (Sora/Veo)',
  'COT_OPTIMIZATION': 'Chain-of-Thought Optimizer',
  
  // STRUCTURE
  'NOTES': 'Notas/Voz a Texto (MD)',
  'JSON_SCHEMA': 'Strict JSON Schema',
  'KNOWLEDGE_GRAPH': 'Knowledge Graph (Obsidian)',
  'MEETING_INTEL': 'Meeting Intel & Actions',
  'LEGAL_EXTRACT': 'Legal Extraction',

  // SMART CALENDAR
  'CALENDAR_CONTENT': 'Calendario de Contenidos RRSS',
  'CALENDAR_TASKS': 'Calendario de Tareas (GTD)',
  'CALENDAR_PROJECT': 'Calendario de Proyecto / Sprints',
  'CALENDAR_LAUNCH': 'Calendario de Lanzamiento',
  'CALENDAR_WEEKLY': 'Planificación Semanal',

  // CONTENT GENERATION
  'SOCIAL_REEL': 'Reel / TikTok (Hook + Script + Caption)',
  'SOCIAL_CAROUSEL': 'Carrusel Educativo Multi-Slide',
  'SOCIAL_POST_COPY': 'Post Estático + Caption',
  'CONTENT_EDUCATIONAL': 'Contenido Educativo (Tips/Tutoriales)',
  'CONTENT_ADVERTISING': 'Contenido Publicitario (Ads)',
  'CONTENT_PERSONAL_BRAND': 'Marca Personal (Autoridad)',
  'CONTENT_CREATOR': 'Creadores (YouTube / Podcast / Newsletter)',

  // TABLES
  'CONTENT_CALENDAR': 'Calendario de Contenidos',
  'DATA_TABLE': 'Tabla de Datos General',
  'PRICING_TABLE': 'Tabla de Precios',
  'FINANCIAL_MODEL': 'Financial Model (P&L)',
  'PRODUCT_ROADMAP': 'Product Roadmap (RICE)',
  'COMPARISON_MATRIX': 'Comparison Matrix',

  // SEO
  'SEO_AUDIT': 'Auditoría Técnica SEO',
  'AD_CAMPAIGN': 'Campaña Ads (Google/Meta)',
  'KEYWORD_STRATEGY': 'Estrategia de Keywords',
  'LANDING_COPY': 'Copy para Landing Page',
  'GEO_OPTIMIZATION': 'AI Search Optimization (GEO)',
  'LINKEDIN_AUTHORITY': 'LinkedIn Authority Arch.',
  'PROGRAMMATIC_SEO_STRUCT': 'Programmatic SEO Structure',

  // IDEATION
  'BLUE_OCEAN': 'Blue Ocean Strategy',
  'STARTUP_VALIDATION': 'Startup Validation (Mom Test)',
  'PRE_MORTEM': 'Pre-Mortem Analysis',
};

export const LANGUAGES: Record<TargetLanguage, string> = {
  'AUTO': 'Auto (Input)',
  'ES': 'Español',
  'EN': 'Inglés',
  'FR': 'Francés',
  'DE': 'Alemán',
  'IT': 'Italiano',
  'PT': 'Portugués'
};

export const FORMATS: Record<OutputFormat, string> = {
  'MARKDOWN': 'Texto Rico (MD)',
  'PLAIN_TEXT': 'Texto Plano',
  'JSON': 'JSON Puro',
  'XML': 'XML Estructurado',
  'CODE': 'Código (React/Tailwind)',
  'CSV': 'CSV (Excel/Sheets)'
};

// --- CONFIGURACIÓN ESTRICTA POR MÓDULO (2026 UX) ---
export const MODULE_SPECIFIC_CONFIG: Record<ModuleType, { validPresets: PresetType[], validFormats: OutputFormat[] }> = {
    [ModuleType.CODE]: {
        validPresets: ['SOCIAL_REEL', 'SOCIAL_CAROUSEL', 'SOCIAL_POST_COPY', 'CONTENT_EDUCATIONAL', 'CONTENT_ADVERTISING', 'CONTENT_PERSONAL_BRAND', 'CONTENT_CREATOR', 'GENERAL'],
        validFormats: ['MARKDOWN', 'PLAIN_TEXT']
    },
    [ModuleType.DESIGN]: {
        validPresets: ['CALENDAR_CONTENT', 'CALENDAR_TASKS', 'CALENDAR_PROJECT', 'CALENDAR_LAUNCH', 'CALENDAR_WEEKLY', 'GENERAL'],
        validFormats: ['MARKDOWN', 'CSV']
    },
    [ModuleType.WRITING]: {
        validPresets: ['FOUNDER_MODE', 'STORYTELLING_MASTER', 'UX_MICROCOPY', 'EMAIL', 'COPYWRITING', 'GENERAL'],
        validFormats: ['MARKDOWN', 'PLAIN_TEXT'] 
    },
    [ModuleType.STRUCTURE]: {
        validPresets: ['KNOWLEDGE_GRAPH', 'MEETING_INTEL', 'LEGAL_EXTRACT', 'NOTES', 'JSON_SCHEMA', 'GENERAL'],
        validFormats: ['JSON', 'MARKDOWN', 'PLAIN_TEXT'] 
    },
    [ModuleType.PROMPT]: {
        validPresets: ['VIDEO_GEN_SCRIPT', 'SUPER_AGENT_SYSTEM', 'COT_OPTIMIZATION', 'PROMPT', 'SYSTEM_PROMPT', 'GENERAL'],
        validFormats: ['MARKDOWN', 'XML', 'PLAIN_TEXT'] 
    },
    [ModuleType.IDEATION]: {
        validPresets: ['BLUE_OCEAN', 'STARTUP_VALIDATION', 'PRE_MORTEM', 'GENERAL'],
        validFormats: ['MARKDOWN', 'PLAIN_TEXT']
    },
    [ModuleType.TABLES]: {
        validPresets: ['FINANCIAL_MODEL', 'PRODUCT_ROADMAP', 'COMPARISON_MATRIX', 'CONTENT_CALENDAR', 'DATA_TABLE', 'PRICING_TABLE', 'GENERAL'],
        validFormats: ['CSV', 'MARKDOWN'] // Preferred CSV
    },
    [ModuleType.SEO]: {
        validPresets: ['GEO_OPTIMIZATION', 'LINKEDIN_AUTHORITY', 'PROGRAMMATIC_SEO_STRUCT', 'SEO_AUDIT', 'AD_CAMPAIGN', 'KEYWORD_STRATEGY', 'LANDING_COPY', 'GENERAL'],
        validFormats: ['MARKDOWN', 'JSON', 'CSV']
    }
};

export const GEMINI_MODELS = {
    'gemini-3.5-flash': 'Gemini 3.5 Flash ⚡ (Rápido · Agentes)',
    'gemini-3.5-pro': 'Gemini 3.5 Pro 🧠 (Razonamiento Complejo)',
    'gemini-3.1-pro': 'Gemini 3.1 Pro (Estable · Producción)',
    'gemini-3.1-flash-lite': 'Gemini 3.1 Flash Lite 🪶 (Liviano · Económico)',
    'gemini-2.5-flash-preview-05-20': 'Gemini 2.5 Flash (Estable)',
};

export const OPENROUTER_MODELS = {
    'anthropic/claude-sonnet-4-6': 'Claude Sonnet 4.6 🏆 (Código · Escritura)',
    'google/gemini-3.5-flash': 'Gemini 3.5 Flash ⚡ (Velocidad)',
    'google/gemini-3.5-pro': 'Gemini 3.5 Pro 🧠 (Razonamiento)',
    'openai/gpt-4.5': 'GPT-4.5 (OpenAI)',
    'deepseek/deepseek-r1': 'DeepSeek R1 🔍 (Razonamiento)',
    'qwen/qwen3-235b-a22b': 'Qwen 3.7 Plus (Multimodal)',
    'mistralai/mistral-large': 'Mistral Large (Europeo)',
    'openrouter/free': 'Free Tier (Auto-Select)',
};
