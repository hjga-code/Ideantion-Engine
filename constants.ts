
import { ModuleType, PresetType, TargetLanguage, OutputFormat } from "./types";

// --- THE ORCHESTRATOR PROMPT ---
export const THINKLAB_ORCHESTRATOR_PROMPT = `
[[SYSTEM BOOT SEQUENCE: 2026 KERNEL]]
>> ORCHESTRATION MODE: STRICT COMPILER
>> INTERPRETATION LEVEL: LITERAL

YOU ARE AN INTENT TRANSLATION ENGINE, NOT A CHATBOT.
Your objective is to take an INPUT (Text, Audio, Image) and convert it into an OUTPUT in the exact format requested.

ABSOLUTE RULES:
1. **ZERO PREAMBLE:** Do not greet. Do not say "Here you go". Do not explain what you did.
2. **EXTREME FIDELITY:** If the user provides an audio instruction, translate it into the requested format without losing a single technical parameter.
3. **IDENTITY:** Assume the loaded "SKILL" below and do not stray from its operational scope.
4. **FORMAT:** If CSV is requested, return ONLY CSV. If JSON is requested, return ONLY JSON. If Markdown is requested, return pure Markdown.
5. **⚠️ MANDATORY LANGUAGE RULE — HIGHEST PRIORITY:** Detect the language of the user's message. Output EVERYTHING — every word, label, column header, section title, table cell, list item, and sentence — in THAT EXACT SAME LANGUAGE. This is NON-NEGOTIABLE. If the user writes in English → respond 100% in English. If the user writes in Spanish → respond 100% in Spanish. A mixed-language output is a critical failure. The only exception is if a specific TARGET LANGUAGE runtime parameter overrides this.

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

export const LOCALIZED_PRESETS: Record<'en' | 'es', Record<PresetType, string>> = {
  en: {
    'GENERAL': 'General / Auto-Detect',
    'EMAIL': 'Email / Comms',
    'COPYWRITING': 'Persuasive Copy (Sales)',
    'FOUNDER_MODE': 'Founder Mode (Terse/Direct)',
    'UX_MICROCOPY': 'UX Microcopy / UI Text',
    'STORYTELLING_MASTER': 'Storytelling (Hero Journey)',
    'PROMPT': 'Midjourney / Flux V6',
    'SYSTEM_PROMPT': 'System Instruction (XML)',
    'SUPER_AGENT_SYSTEM': 'Super Agent Architect',
    'VIDEO_GEN_SCRIPT': 'Video Gen (Sora/Veo)',
    'COT_OPTIMIZATION': 'Chain-of-Thought Optimizer',
    'NOTES': 'Notes / Voice-to-Text (MD)',
    'JSON_SCHEMA': 'Strict JSON Schema',
    'KNOWLEDGE_GRAPH': 'Knowledge Graph (Obsidian)',
    'MEETING_INTEL': 'Meeting Intel & Actions',
    'LEGAL_EXTRACT': 'Legal Extraction',
    'CALENDAR_CONTENT': 'Social Media Content Calendar',
    'CALENDAR_TASKS': 'Task Calendar (GTD)',
    'CALENDAR_PROJECT': 'Project / Sprint Calendar',
    'CALENDAR_LAUNCH': 'Launch Calendar',
    'CALENDAR_WEEKLY': 'Weekly Planning',
    'SOCIAL_REEL': 'Reel / TikTok (Hook + Script + Caption)',
    'SOCIAL_CAROUSEL': 'Multi-Slide Educational Carousel',
    'SOCIAL_POST_COPY': 'Static Post + Caption',
    'CONTENT_EDUCATIONAL': 'Educational Content (Tips/Tutorials)',
    'CONTENT_ADVERTISING': 'Advertising Content (Ads)',
    'CONTENT_PERSONAL_BRAND': 'Personal Brand (Authority)',
    'CONTENT_CREATOR': 'Creators (YouTube / Podcast / Newsletter)',
    'CONTENT_CALENDAR': 'Content Calendar',
    'DATA_TABLE': 'General Data Table',
    'PRICING_TABLE': 'Pricing Table',
    'FINANCIAL_MODEL': 'Financial Model (P&L)',
    'PRODUCT_ROADMAP': 'Product Roadmap (RICE)',
    'COMPARISON_MATRIX': 'Comparison Matrix',
    'SEO_AUDIT': 'SEO Technical Audit',
    'AD_CAMPAIGN': 'Ad Campaign (Google/Meta)',
    'KEYWORD_STRATEGY': 'Keyword Strategy',
    'LANDING_COPY': 'Landing Page Copy',
    'GEO_OPTIMIZATION': 'AI Search Optimization (GEO)',
    'LINKEDIN_AUTHORITY': 'LinkedIn Authority Arch.',
    'PROGRAMMATIC_SEO_STRUCT': 'Programmatic SEO Structure',
    'BLUE_OCEAN': 'Blue Ocean Strategy',
    'STARTUP_VALIDATION': 'Startup Validation (Mom Test)',
    'PRE_MORTEM': 'Pre-Mortem Analysis',
  },
  es: {
    'GENERAL': 'General / Auto-Detectar',
    'EMAIL': 'Email / Comunicaciones',
    'COPYWRITING': 'Copy Persuasivo (Ventas)',
    'FOUNDER_MODE': 'Founder Mode (Directo)',
    'UX_MICROCOPY': 'Microcopy UX / Texto UI',
    'STORYTELLING_MASTER': 'Storytelling (Viaje del Héroe)',
    'PROMPT': 'Midjourney / Flux V6',
    'SYSTEM_PROMPT': 'System Instruction (XML)',
    'SUPER_AGENT_SYSTEM': 'Arquitectura de Agente',
    'VIDEO_GEN_SCRIPT': 'Prompt de Video (Sora/Veo)',
    'COT_OPTIMIZATION': 'Prompt Optimizado (CoT)',
    'NOTES': 'Notas / Voz a Texto (MD)',
    'JSON_SCHEMA': 'Esquema JSON Estricto',
    'KNOWLEDGE_GRAPH': 'Grafo de Conocimiento (Obsidian)',
    'MEETING_INTEL': 'Actas de Reunión y Acuerdos',
    'LEGAL_EXTRACT': 'Extracción de Información Legal',
    'CALENDAR_CONTENT': 'Calendario de Contenidos RRSS',
    'CALENDAR_TASKS': 'Calendario de Tareas (GTD)',
    'CALENDAR_PROJECT': 'Calendario de Proyecto / Sprints',
    'CALENDAR_LAUNCH': 'Calendario de Lanzamiento',
    'CALENDAR_WEEKLY': 'Planificación Semanal',
    'SOCIAL_REEL': 'Reel / TikTok (Gancho + Script + Caption)',
    'SOCIAL_CAROUSEL': 'Carrusel Educativo Multi-Slide',
    'SOCIAL_POST_COPY': 'Post Estático + Caption',
    'CONTENT_EDUCATIONAL': 'Contenido Educativo (Tips/Tutoriales)',
    'CONTENT_ADVERTISING': 'Contenido Publicitario (Ads)',
    'CONTENT_PERSONAL_BRAND': 'Marca Personal (Autoridad)',
    'CONTENT_CREATOR': 'Creadores (YouTube / Podcast / Newsletter)',
    'CONTENT_CALENDAR': 'Calendario de Contenidos',
    'DATA_TABLE': 'Tabla de Datos General',
    'PRICING_TABLE': 'Tabla de Precios',
    'FINANCIAL_MODEL': 'Modelo Financiero (P&L)',
    'PRODUCT_ROADMAP': 'Product Roadmap (RICE)',
    'COMPARISON_MATRIX': 'Matriz Comparativa',
    'SEO_AUDIT': 'Auditoría Técnica SEO',
    'AD_CAMPAIGN': 'Campaña Ads (Google/Meta)',
    'KEYWORD_STRATEGY': 'Estrategia de Keywords',
    'LANDING_COPY': 'Copy para Landing Page',
    'GEO_OPTIMIZATION': 'Optimización de Búsqueda AI (GEO)',
    'LINKEDIN_AUTHORITY': 'Arquitectura LinkedIn',
    'PROGRAMMATIC_SEO_STRUCT': 'Estructura SEO Programático',
    'BLUE_OCEAN': 'Estrategia Blue Ocean',
    'STARTUP_VALIDATION': 'Validación de Startup (Mom Test)',
    'PRE_MORTEM': 'Análisis Pre-Mortem',
  }
};

export const LOCALIZED_LANGUAGES: Record<'en' | 'es', Record<TargetLanguage, string>> = {
  en: {
    'AUTO': 'Auto (Input)',
    'ES': 'Spanish',
    'EN': 'English',
    'FR': 'French',
    'DE': 'German',
    'IT': 'Italian',
    'PT': 'Portuguese'
  },
  es: {
    'AUTO': 'Auto (Original)',
    'ES': 'Español',
    'EN': 'Inglés',
    'FR': 'Francés',
    'DE': 'Alemán',
    'IT': 'Italiano',
    'PT': 'Portugués'
  }
};

export const LOCALIZED_FORMATS: Record<'en' | 'es', Record<OutputFormat, string>> = {
  en: {
    'MARKDOWN': 'Rich Text (MD)',
    'PLAIN_TEXT': 'Plain Text',
    'JSON': 'Pure JSON',
    'XML': 'Structured XML',
    'CODE': 'Code (React/Tailwind)',
    'CSV': 'CSV (Excel/Sheets)'
  },
  es: {
    'MARKDOWN': 'Texto Rico (MD)',
    'PLAIN_TEXT': 'Texto Plano',
    'JSON': 'JSON Puro',
    'XML': 'XML Estructurado',
    'CODE': 'Código (React/Tailwind)',
    'CSV': 'CSV (Excel/Sheets)'
  }
};

// Legacy compatibility aliases (default to english)
export const PRESETS = LOCALIZED_PRESETS.en;
export const LANGUAGES = LOCALIZED_LANGUAGES.en;
export const FORMATS = LOCALIZED_FORMATS.en;

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
    'gemini-3.5-flash': 'Gemini 3.5 Flash ⚡ (Fast · Agents)',
    'gemini-3.5-pro': 'Gemini 3.5 Pro 🧠 (Complex Reasoning)',
    'gemini-3.1-pro': 'Gemini 3.1 Pro (Stable · Production)',
    'gemini-3.1-flash-lite': 'Gemini 3.1 Flash Lite 🪶 (Lightweight · Economical)',
    'gemini-2.5-flash-preview-05-20': 'Gemini 2.5 Flash (Stable)',
};

export const OPENROUTER_MODELS = {
    'anthropic/claude-sonnet-4-6': 'Claude Sonnet 4.6 🏆 (Code · Writing)',
    'google/gemini-3.5-flash': 'Gemini 3.5 Flash ⚡ (Speed)',
    'google/gemini-3.5-pro': 'Gemini 3.5 Pro 🧠 (Reasoning)',
    'openai/gpt-4.5': 'GPT-4.5 (OpenAI)',
    'deepseek/deepseek-r1': 'DeepSeek R1 🔍 (Reasoning)',
    'qwen/qwen3-235b-a22b': 'Qwen 3.7 Plus (Multimodal)',
    'mistralai/mistral-large': 'Mistral Large (European)',
    'openrouter/free': 'Free Tier (Auto-Select)',
};
