import React, { useState, useRef } from 'react';

interface OutputRendererProps {
  content: string;
  isTableContent?: boolean;
  module?: string;
  preset?: string;
  uiLanguage?: 'en' | 'es';
}

// ─── SMART TITLE ENGINE ──────────────────────────────────────────────────────
// L1: First H1/H2 heading from AI output (most specific)
// L2: Topic extraction — what is this content actually ABOUT?
// L3: Structural type detection (conservative, multi-signal)
// L4: Preset lookup (only for non-GENERAL presets)
// L5: Module default

// L4 — Preset lookup table (GENERAL always tries to derive title from content)
const PRESET_TITLES: Record<'en' | 'es', Record<string, string>> = {
  en: {
    // Content Generation
    SOCIAL_REEL:            'Reel Script',
    SOCIAL_CAROUSEL:        'Content Carousel',
    SOCIAL_POST_COPY:       'Post + Caption',
    CONTENT_EDUCATIONAL:    'Educational Content',
    CONTENT_ADVERTISING:    'Advertising Content',
    CONTENT_PERSONAL_BRAND: 'Personal Brand',
    CONTENT_CREATOR:        'Creator Script',
    // Smart Calendar
    CALENDAR_CONTENT: 'Content Calendar',
    CALENDAR_TASKS:   'Task Plan',
    CALENDAR_PROJECT: 'Project Calendar',
    CALENDAR_LAUNCH:  'Launch Plan',
    CALENDAR_WEEKLY:  'Weekly Planning',
    // SEO & Growth
    SEO_AUDIT:               'SEO Audit',
    AD_CAMPAIGN:             'Ad Campaign',
    KEYWORD_STRATEGY:        'Keyword Strategy',
    LANDING_COPY:            'Landing Page Copy',
    GEO_OPTIMIZATION:        'GEO / AI Search Optimization',
    LINKEDIN_AUTHORITY:      'LinkedIn Architecture',
    PROGRAMMATIC_SEO_STRUCT: 'Programmatic SEO',
    // Voice to Structure
    NOTES:          'Structured Transcription',
    JSON_SCHEMA:    'JSON Schema',
    KNOWLEDGE_GRAPH:'Knowledge Graph',
    MEETING_INTEL:  'Meeting Minutes',
    LEGAL_EXTRACT:  'Legal Extraction',
    // Pro Refinement
    EMAIL:                'Professional Email',
    COPYWRITING:          'Persuasive Copy',
    FOUNDER_MODE:         'Founder Message',
    UX_MICROCOPY:         'UX Microcopy',
    STORYTELLING_MASTER:  'Brand Story',
    // Table Engine
    DATA_ANALYSIS:       'Data Analysis & Insights',
    PRODUCT_INVENTORY:   'Product Inventory System',
    FORMULA_INTELLIGENCE:'Formula Builder & Analyzer',
    DATA_VISUALIZATION:  'Mass Data Visualization',
    BUDGET_PLANNER:      'Budget & Cost Planner',
    DATABASE_DESIGN:     'Database & Schema Design',
    DATA_TABLE:       'Data Table',
    PRICING_TABLE:    'Pricing Table',
    FINANCIAL_MODEL:  'Financial Model',
    PRODUCT_ROADMAP:  'Product Roadmap',
    COMPARISON_MATRIX:'Comparison Matrix',
    // Universal Prompt
    PROMPT:              'Image Prompt',
    SYSTEM_PROMPT:       'System Instruction',
    SUPER_AGENT_SYSTEM:  'Agent Architecture',
    VIDEO_GEN_SCRIPT:    'Video Prompt',
    COT_OPTIMIZATION:    'Optimized Prompt',
    // Ideation
    BLUE_OCEAN:          'Blue Ocean Strategy',
    STARTUP_VALIDATION:  'Startup Validation',
    PRE_MORTEM:          'Pre-Mortem Analysis',
    // General — empty string means: always derive from content
    GENERAL: '',
  },
  es: {
    // Content Generation
    SOCIAL_REEL:            'Script de Reel',
    SOCIAL_CAROUSEL:        'Carrusel de Contenido',
    SOCIAL_POST_COPY:       'Post + Caption',
    CONTENT_EDUCATIONAL:    'Contenido Educativo',
    CONTENT_ADVERTISING:    'Contenido Publicitario',
    CONTENT_PERSONAL_BRAND: 'Marca Personal',
    CONTENT_CREATOR:        'Guion de Creador',
    // Smart Calendar
    CALENDAR_CONTENT: 'Calendario de Contenidos',
    CALENDAR_TASKS:   'Plan de Tareas',
    CALENDAR_PROJECT: 'Calendario de Proyecto',
    CALENDAR_LAUNCH:  'Plan de Lanzamiento',
    CALENDAR_WEEKLY:  'Planificación Semanal',
    // SEO & Growth
    SEO_AUDIT:               'Auditoría SEO',
    AD_CAMPAIGN:             'Campaña Publicitaria',
    KEYWORD_STRATEGY:        'Estrategia de Keywords',
    LANDING_COPY:            'Copy para Landing',
    GEO_OPTIMIZATION:        'Optimización GEO / AI Search',
    LINKEDIN_AUTHORITY:      'Arquitectura LinkedIn',
    PROGRAMMATIC_SEO_STRUCT: 'SEO Programático',
    // Voice to Structure
    NOTES:          'Transcripción Estructurada',
    JSON_SCHEMA:    'Esquema JSON',
    KNOWLEDGE_GRAPH:'Grafo de Conocimiento',
    MEETING_INTEL:  'Actas de Reunión',
    LEGAL_EXTRACT:  'Extracción Legal',
    // Pro Refinement
    EMAIL:                'Email Profesional',
    COPYWRITING:          'Copy Persuasivo',
    FOUNDER_MODE:         'Mensaje de Founder',
    UX_MICROCOPY:         'Microcopy UX',
    STORYTELLING_MASTER:  'Historia de Marca',
    // Table Engine
    DATA_ANALYSIS:       'Análisis de Datos e Insights',
    PRODUCT_INVENTORY:   'Inventario de Productos',
    FORMULA_INTELLIGENCE:'Generador y Analizador de Fórmulas',
    DATA_VISUALIZATION:  'Visualización Masiva de Datos',
    BUDGET_PLANNER:      'Presupuestos y Costes',
    DATABASE_DESIGN:     'Diseño de Bases de Datos',
    DATA_TABLE:       'Tabla de Datos',
    PRICING_TABLE:    'Tabla de Precios',
    FINANCIAL_MODEL:  'Modelo Financiero',
    PRODUCT_ROADMAP:  'Product Roadmap',
    COMPARISON_MATRIX:'Matriz Comparativa',
    // Universal Prompt
    PROMPT:              'Prompt para Imagen',
    SYSTEM_PROMPT:       'System Instruction',
    SUPER_AGENT_SYSTEM:  'Arquitectura de Agente',
    VIDEO_GEN_SCRIPT:    'Prompt de Video',
    COT_OPTIMIZATION:    'Prompt Optimizado',
    // Ideation
    BLUE_OCEAN:          'Estrategia Blue Ocean',
    STARTUP_VALIDATION:  'Validación de Startup',
    PRE_MORTEM:          'Análisis Pre-Mortem',
    // General — empty string means: always derive from content
    GENERAL: '',
  }
};

// L5 — Module default titles
const MODULE_TITLES: Record<'en' | 'es', Record<string, string>> = {
  en: {
    CODE:      'Generated Content',
    DESIGN:    'Planner',
    SEO:       'SEO Analysis',
    STRUCTURE: 'Data Structure',
    WRITING:   'Text Document',
    TABLES:    'Data Table',
    PROMPT:    'Prompt',
    IDEATION:  'Ideation Session',
  },
  es: {
    CODE:      'Contenido Generado',
    DESIGN:    'Planificador',
    SEO:       'Analisis SEO',
    STRUCTURE: 'Estructura de Datos',
    WRITING:   'Documento de Texto',
    TABLES:    'Tabla de Datos',
    PROMPT:    'Prompt',
    IDEATION:  'Sesion de Ideacion',
  }
};

// L2 — Topic extraction: reads the AI output to understand what it's actually about
const extractTopicFromContent = (content: string): string | null => {
  const sample = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\|[^\n]+\|/g, '')
    .replace(/[*_`#>\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 600)
    .trim();

  if (!sample || sample.length < 10) return null;

  // Check for bold title line: **Some Title**
  const boldTitle = content.match(/^\*\*([^*\n]{4,70})\*\*/m);
  if (boldTitle) {
    const cleaned = boldTitle[1].trim().replace(/[*_`]/g, '');
    if (cleaned.length > 3 && !/^(note|notes|summary|output|resultado|calendar type selected)/i.test(cleaned))
      return cleaned.slice(0, 70);
  }

  // Schedule/plan type prefix
  const scheduleMatch = sample.match(
    /\b(daily|weekly|monthly|7[\s-]day|30[\s-]day|annual|yearly|diario|semanal|mensual)\b[\s\w]{0,25}?(schedule|plan|planner|calendar|routine|program|tracker|agenda|planificacion|calendario|rutina|programa)/i
  );
  if (scheduleMatch) {
    return scheduleMatch[0].trim().replace(/\b\w/g, c => c.toUpperCase()).slice(0, 60);
  }

  const hasFitness   = /\b(exercise|workout|fitness|gym|hiit|yoga|training|entrenamiento|ejercicio|bienestar|wellness|health|salud)\b/i.test(sample);
  const hasNutrition = /\b(breakfast|meal|diet|nutrition|desayuno|comida|nutricion|alimentacion|recipe|receta)\b/i.test(sample);
  const hasReading   = /\b(reading|book|lecture|libros|lectura|aprender|learning)\b/i.test(sample);
  const hasWeekly    = /\b(weekly|week|semanal|semana)\b/i.test(sample);

  if (hasFitness && hasNutrition && hasReading) return hasWeekly ? 'Weekly Wellness & Learning Plan' : 'Wellness & Learning Plan';
  if (hasFitness && hasNutrition)               return hasWeekly ? 'Weekly Fitness & Nutrition Plan' : 'Fitness & Nutrition Plan';
  if (hasFitness && hasReading)                 return hasWeekly ? 'Weekly Fitness & Learning Plan'  : 'Fitness & Learning Plan';
  if (hasFitness)                               return hasWeekly ? 'Weekly Fitness Plan'              : 'Fitness Plan';
  if (hasNutrition && hasReading)               return 'Nutrition & Learning Plan';
  if (hasNutrition)                             return 'Meal Plan';
  if (hasReading)                               return 'Reading & Learning Plan';

  if (/\b(habit|routine|rutina|habito|morning routine|evening routine|daily routine)\b/i.test(sample))
    return 'Habit Tracker & Routine';
  if (/\b(instagram|tiktok|linkedin|twitter|youtube|reel|carousel|content pillar)\b/i.test(sample))
    return 'Social Media Plan';
  if (/\b(launch|lanzamiento|go-to-market|product launch|startup)\b/i.test(sample))
    return 'Launch Strategy';
  if (/\b(marketing|campaign|campana|ad copy|advertising|publicidad)\b/i.test(sample))
    return 'Marketing Plan';
  if (/\b(revenue|profit|ebitda|financial|financiero|budget|presupuesto|roi)\b/i.test(sample))
    return 'Financial Model';
  if (/\b(keyword|seo|serp|backlink|traffic|ranking|posicionamiento)\b/i.test(sample))
    return 'SEO Strategy';
  if (/\b(productivity|task|gtd|project|sprint|deadline|entregable|tarea|proyecto)\b/i.test(sample))
    return hasWeekly ? 'Weekly Work Plan' : 'Project Plan';

  return null;
};

// L3 — Structural type detection (conservative: only fires on strong multi-signal patterns)
const detectStructuralType = (content: string, lang: 'en' | 'es' = 'en'): string | null => {
  // Social media content calendar — requires platform names + content pillars
  if (/\b(Instagram|TikTok|LinkedIn)\b/i.test(content) &&
      /\|\s*(Platform|Plataforma|Format|Formato)\s*\|/i.test(content) &&
      /content\s+pillar|pilar\s+de\s+contenido/i.test(content))
    return lang === 'es' ? 'Calendario de Contenidos' : 'Content Calendar';
  // Project sprint — requires sprint + status columns
  if (/\|\s*(Sprint|Phase|Fase)\s*\|/i.test(content) &&
      /\|\s*(Status|Estado|Owner|Responsable)\s*\|/i.test(content))
    return lang === 'es' ? 'Calendario de Proyecto' : 'Project Calendar';
  // GTD — requires specific GTD context tags
  if (/@(computer|computadora|meeting|reunion|call|llamada)/i.test(content) ||
     (/\|\s*(P1|P2|P3)\s*\|/i.test(content) && /\|\s*(Contexto|Context)\s*\|/i.test(content)))
    return lang === 'es' ? 'Plan de Tareas GTD' : 'GTD Task Plan';
  // Launch — requires phases + KPI
  if (/(Pre-launch|Pre-lanzamiento|Post-launch)/i.test(content) &&
      /\|\s*(KPI|Canal|Channel)\s*\|/i.test(content))
    return lang === 'es' ? 'Plan de Lanzamiento' : 'Launch Plan';
  // Reel
  if (/\b(HOOK|GANCHO)\b[\s:]/i.test(content) && /\bCTA\b[\s:]/i.test(content))
    return lang === 'es' ? 'Script de Reel' : 'Reel Script';
  // Carousel
  if (/SLIDE\s+\d+|Diapositiva\s+\d+/i.test(content))
    return lang === 'es' ? 'Carrusel de Contenido' : 'Content Carousel';
  // Financial
  if (/P&(?:amp;)?L|EBITDA|Unit Economics/i.test(content))
    return lang === 'es' ? 'Modelo Financiero' : 'Financial Model';
  // Keyword strategy
  if (/\|\s*(Keyword|Palabra Clave).*\|\s*(Volume|Vol\.)/i.test(content))
    return lang === 'es' ? 'Estrategia de Keywords' : 'Keyword Strategy';
  // Ad metrics
  if (/\b(CTR|ROAS|CPM|CPA)\b/i.test(content))
    return lang === 'es' ? 'Campana Publicitaria' : 'Ad Campaign';
  // Pricing table
  if (/\|\s*(Precio|Price)\s*\|/i.test(content) && /\|\s*(Plan|Tier)\s*\|/i.test(content))
    return lang === 'es' ? 'Tabla de Precios' : 'Pricing Table';
  // JSON schema
  if (/"type"\s*:\s*"object"|"properties"\s*:|"\$schema"/i.test(content))
    return lang === 'es' ? 'Esquema JSON' : 'JSON Schema';
  // Meeting notes
  if (/Action Item|DECISIONES|Next Steps|Proximos Pasos/i.test(content))
    return lang === 'es' ? 'Actas de Reunion' : 'Meeting Minutes';
  // Image prompt
  if (/--ar\s+\d+:\d+|--style|--chaos|--seed/i.test(content))
    return lang === 'es' ? 'Prompt de Imagen' : 'Image Prompt';
  // System instruction
  if (/\[SYSTEM\]|<system>|<assistant>|\[INST\]/i.test(content))
    return 'System Instruction';
  return null;
};


// Main title resolver — intelligent, content-aware
const generateDocTitle = (content: string, preset?: string, module?: string, lang: 'en' | 'es' = 'en'): string => {
  // L1: First markdown H1/H2 heading from AI output
  const heading = content.match(/^#{1,2}\s+(.+)$/m);
  if (heading) {
    const cleaned = heading[1].trim().replace(/[*_`#]/g, '').slice(0, 80);
    if (cleaned.length > 3 && !/^(summary|resumen|output|resultado|calendar type selected)/i.test(cleaned))
      return cleaned;
  }
  // L2: Topic extraction (what is this content actually about?)
  const topic = extractTopicFromContent(content);
  if (topic) return topic;
  // L3: Structural type detection (conservative, multi-signal)
  const structural = detectStructuralType(content, lang);
  if (structural) return structural;
  // L4: Preset lookup — only for explicit non-GENERAL presets
  if (preset && preset !== 'GENERAL') {
    const presetTitle = PRESET_TITLES[lang][preset];
    if (presetTitle) return presetTitle;
  }
  // L5: Module default
  if (module && MODULE_TITLES[lang][module]) return MODULE_TITLES[lang][module];
  return lang === 'es' ? 'Documento' : 'Document';
};

// ─── DOCUMENT THEME SYSTEM ───────────────────────────────────────────────────
// Each workflow gets its own color palette for exports

interface DocTheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  label: string;
  headerGradient: string;
}

const MODULE_DOC_THEMES: Record<string, DocTheme> = {
  // Workflow #1 — Content Generation: vibrant magenta/coral
  CODE: {
    primary: '#db2777',
    primaryDark: '#9d174d',
    primaryLight: '#fdf0f8',
    accent: '#f472b6',
    label: 'Content Generation',
    headerGradient: 'linear-gradient(135deg, #9d174d 0%, #db2777 100%)',
  },
  // Workflow #2 — Smart Calendar: deep teal/emerald
  DESIGN: {
    primary: '#0f766e',
    primaryDark: '#134e4a',
    primaryLight: '#f0fdf9',
    accent: '#2dd4bf',
    label: 'Smart Calendar',
    headerGradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)',
  },
  // Workflow #3 — SEO & Growth: emerald growth green
  SEO: {
    primary: '#16a34a',
    primaryDark: '#14532d',
    primaryLight: '#f0fdf4',
    accent: '#4ade80',
    label: 'SEO & Growth',
    headerGradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
  },
  // Workflow #4 — Voice to Structure: steel blue / technical
  STRUCTURE: {
    primary: '#1d4ed8',
    primaryDark: '#1e3a8a',
    primaryLight: '#eff6ff',
    accent: '#60a5fa',
    label: 'Voice to Structure',
    headerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
  },
  // Workflow #5 — Pro Refinement / Writing: warm ink amber
  WRITING: {
    primary: '#b45309',
    primaryDark: '#78350f',
    primaryLight: '#fffbeb',
    accent: '#fbbf24',
    label: 'Pro Refinement',
    headerGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
  },
  // Workflow #6 — Table Engine: data cyan / sky
  TABLES: {
    primary: '#0369a1',
    primaryDark: '#0c4a6e',
    primaryLight: '#f0f9ff',
    accent: '#38bdf8',
    label: 'Table Engine',
    headerGradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
  },
  // Workflow #7 — Universal Prompt: electric orange / AI
  PROMPT: {
    primary: '#c2410c',
    primaryDark: '#7c2d12',
    primaryLight: '#fff7ed',
    accent: '#fb923c',
    label: 'Universal Prompt',
    headerGradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
  },
  // Workflow #8 — Brainstorming / Ideation: deep violet
  IDEATION: {
    primary: '#7c3aed',
    primaryDark: '#4c1d95',
    primaryLight: '#f5f3ff',
    accent: '#a78bfa',
    label: 'Brainstorming',
    headerGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
  },
};

const DEFAULT_THEME: DocTheme = {
  primary: '#374151',
  primaryDark: '#111827',
  primaryLight: '#f9fafb',
  accent: '#9ca3af',
  label: 'Documento',
  headerGradient: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
};

const getTheme = (module?: string): DocTheme =>
  module ? (MODULE_DOC_THEMES[module] ?? DEFAULT_THEME) : DEFAULT_THEME;

const getLocalizedThemeLabel = (label: string, lang: 'en' | 'es' = 'en'): string => {
  if (lang === 'en') {
    if (label === 'Documento') return 'Document';
    return label;
  }
  const mapping: Record<string, string> = {
    'Content Generation': 'Generación de Contenido',
    'Smart Calendar': 'Calendario Inteligente',
    'SEO & Growth': 'SEO y Crecimiento',
    'Voice to Structure': 'Voz a Estructura',
    'Pro Refinement': 'Refinamiento Pro',
    'Table Engine': 'Motor de Tablas',
    'Universal Prompt': 'Prompt Universal',
    'Brainstorming': 'Lluvia de Ideas',
    'Document': 'Documento',
    'Documento': 'Documento',
  };
  return mapping[label] || label;
};

// ─── MARKDOWN → HTML ─────────────────────────────────────────────────────────

const markdownToHTML = (md: string): string => {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced code blocks (before inline code)
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_: string, lang: string, code: string) =>
    `<pre><code class="lang-${lang || 'text'}">${code.trim()}</code></pre>`
  );

  // Headings
  html = html
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>');

  // Inline formatting
  html = html
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr/>');

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/((?:^[-*•]\s+.+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n')
      .map(l => `<li>${l.replace(/^[-*•]\s+/, '')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(/((?:^\d+\.\s+.+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n')
      .map(l => `<li>${l.replace(/^\d+\.\s+/, '')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });

  // Markdown tables
  html = html.replace(/(\|.+\|\n)([\|\s\-:]+\n)((?:\|.+\|\n?)+)/g,
    (_, header, _sep, body) => {
      const ths = header.split('|').slice(1, -1)
        .map((h: string) => `<th>${h.trim()}</th>`).join('');
      const trs = body.trim().split('\n').map((row: string) => {
        const tds = row.split('|').slice(1, -1)
          .map((c: string) => `<td>${c.trim()}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    });

  // Wrap plain lines in <p>
  const blockTags = /^(<h[1-6]|<ul|<ol|<li|<pre|<table|<blockquote|<hr)/;
  html = html.split('\n').map(line => {
    const t = line.trim();
    if (!t) return '';
    if (blockTags.test(t)) return t;
    return `<p>${t}</p>`;
  }).join('\n');

  // Clean up
  html = html
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>)/g, '$1').replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>|<ol>|<pre>|<table>|<blockquote>|<hr\/>)/g, '$1')
    .replace(/(<\/ul>|<\/ol>|<\/pre>|<\/table>|<\/blockquote>)<\/p>/g, '$1');

  return html;
};

// ─── DOCUMENT BUILDER ────────────────────────────────────────────────────────

const getTimestamp = () => new Date().toISOString().slice(0, 10);
const formatDate = (lang: 'en' | 'es' = 'en') => new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
});

const buildDocCSS = (theme: DocTheme): string => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --p:   ${theme.primary};
    --pd:  ${theme.primaryDark};
    --pl:  ${theme.primaryLight};
    --ac:  ${theme.accent};
    --txt: #1c1c1e;
    --mut: #6b7280;
    --bdr: #e5e7eb;
    --sur: #f9f9fc;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
    font-size: 13.5px;
    line-height: 1.85;
    color: var(--txt);
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page { max-width: 800px; margin: 0 auto; padding: 0; }

  /* ── Document Header (colored band) ── */
  .doc-header {
    background: ${theme.headerGradient};
    color: white;
    padding: 36px 52px 32px;
    position: relative;
    overflow: hidden;
  }
  .doc-header::after {
    content: '';
    position: absolute;
    right: -40px; top: -40px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    pointer-events: none;
  }
  .doc-header::before {
    content: '';
    position: absolute;
    right: 60px; bottom: -60px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    pointer-events: none;
  }
  .doc-workflow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.75;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 8px;
  }
  .doc-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }
  .doc-dateline {
    font-size: 11px;
    opacity: 0.65;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Body ── */
  .doc-body { padding: 44px 52px; }

  /* ── Typography ── */
  p { margin: 0 0 10px; color: var(--txt); }

  h1 {
    font-size: 20px; font-weight: 700; color: var(--pd);
    margin: 36px 0 14px; padding-bottom: 8px;
    border-bottom: 2.5px solid var(--p);
  }
  h2 {
    font-size: 15.5px; font-weight: 600; color: var(--txt);
    margin: 28px 0 10px; padding: 6px 14px;
    border-left: 4px solid var(--p);
    background: var(--pl);
  }
  h3 {
    font-size: 13.5px; font-weight: 600; color: var(--p);
    margin: 22px 0 8px;
  }
  h4, h5, h6 {
    font-size: 12px; font-weight: 600; color: var(--mut);
    text-transform: uppercase; letter-spacing: 0.07em;
    margin: 18px 0 6px;
  }

  strong { font-weight: 600; }
  em { font-style: italic; color: #374151; }

  /* ── Lists ── */
  ul, ol { margin: 8px 0 12px 22px; }
  li { margin: 4px 0; line-height: 1.75; }
  ul li::marker { color: var(--p); }
  ol li::marker { color: var(--p); font-weight: 600; }

  /* ── Blockquote ── */
  blockquote {
    border-left: 4px solid var(--ac);
    background: var(--pl);
    padding: 12px 18px;
    margin: 16px 0;
    border-radius: 0 6px 6px 0;
    font-style: italic;
    color: var(--pd);
  }

  /* ── Code ── */
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    background: var(--pl);
    border: 1px solid var(--bdr);
    border-radius: 3px;
    padding: 1px 5px;
    color: var(--p);
  }
  pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 8px;
    padding: 18px 22px;
    margin: 16px 0;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.7;
  }
  pre code { background: none; border: none; padding: 0; color: inherit; }

  /* ── Tables ── */
  table {
    width: 100%; border-collapse: collapse;
    margin: 20px 0; font-size: 12.5px;
    border: 1px solid var(--bdr);
    border-radius: 6px; overflow: hidden;
  }
  thead { background: var(--p); }
  th {
    color: white; padding: 10px 14px;
    text-align: left; font-weight: 600;
    font-size: 11px; letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  td { padding: 9px 14px; border-bottom: 1px solid var(--bdr); vertical-align: top; }
  tr:nth-child(even) td { background: var(--pl); }
  tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: var(--pl); }

  /* ── Divider ── */
  hr { border: none; border-top: 1px solid var(--bdr); margin: 28px 0; }

  /* ── Footer ── */
  .doc-footer {
    padding: 18px 52px;
    border-top: 1px solid var(--bdr);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: var(--mut);
    font-family: 'JetBrains Mono', monospace;
  }
  .doc-footer-brand {
    display: flex; align-items: center; gap: 6px;
  }
  .doc-footer-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--p);
    display: inline-block;
  }

  @media print {
    .page { max-width: 100%; }
    .doc-body { padding: 36px 44px; }
    .doc-header { padding: 28px 44px; }
    .doc-footer { padding: 14px 44px; }
    body { font-size: 12px; }
    pre { background: #0f172a !important; color: #e2e8f0 !important; }
    thead { background: var(--p) !important; }
    th { color: white !important; }
    tr:nth-child(even) td { background: var(--pl) !important; }
    blockquote { background: var(--pl) !important; }
  }
`;

const buildWordCSS = (theme: DocTheme): string => `
  :root {
    --p:   ${theme.primary};
    --pd:  ${theme.primaryDark};
    --pl:  ${theme.primaryLight};
    --ac:  ${theme.accent};
    --txt: #1c1c1e;
    --mut: #6b7280;
    --bdr: #e5e7eb;
    --sur: #f9f9fc;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Calibri, 'Segoe UI', Arial, sans-serif;
    font-size: 11pt; line-height: 1.7;
    color: var(--txt); background: #fff;
  }
  .page { max-width: 800px; margin: 0 auto; padding: 0; }
  .doc-header {
    background: ${theme.primary};
    color: white; padding: 28px 48px 24px;
  }
  .doc-workflow { font-size: 8pt; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.75; font-family: Consolas, 'Courier New', monospace; margin-bottom: 6px; }
  .doc-title { font-size: 20pt; font-weight: bold; line-height: 1.2; margin-bottom: 8px; }
  .doc-dateline { font-size: 8pt; opacity: 0.65; font-family: Consolas, 'Courier New', monospace; }
  .doc-body { padding: 40px 48px; }
  p { margin: 0 0 8pt; }
  h1 { font-size: 16pt; font-weight: bold; color: ${theme.primaryDark}; margin: 28pt 0 10pt; padding-bottom: 6pt; border-bottom: 2pt solid ${theme.primary}; }
  h2 { font-size: 13pt; font-weight: bold; color: var(--txt); margin: 22pt 0 8pt; padding: 5pt 12pt; border-left: 4pt solid ${theme.primary}; background: ${theme.primaryLight}; }
  h3 { font-size: 11pt; font-weight: bold; color: ${theme.primary}; margin: 18pt 0 6pt; }
  h4, h5, h6 { font-size: 9pt; font-weight: bold; color: var(--mut); text-transform: uppercase; letter-spacing: 0.06em; margin: 14pt 0 4pt; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  ul, ol { margin: 6pt 0 10pt 18pt; }
  li { margin: 3pt 0; }
  blockquote { border-left: 3pt solid ${theme.accent}; background: ${theme.primaryLight}; padding: 10pt 14pt; margin: 12pt 0; font-style: italic; color: ${theme.primaryDark}; }
  code { font-family: Consolas, 'Courier New', monospace; font-size: 9pt; background: ${theme.primaryLight}; border: 1pt solid #e5e7eb; padding: 1pt 4pt; color: ${theme.primary}; }
  pre { font-family: Consolas, 'Courier New', monospace; font-size: 9pt; background: #1e293b; color: #e2e8f0; padding: 14pt 18pt; margin: 12pt 0; white-space: pre-wrap; word-break: break-word; line-height: 1.6; }
  pre code { background: none; border: none; color: inherit; }
  table { width: 100%; border-collapse: collapse; margin: 16pt 0; font-size: 10pt; }
  thead { background: ${theme.primary}; }
  th { color: white; padding: 8pt 12pt; text-align: left; font-weight: bold; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.03em; }
  td { padding: 7pt 12pt; border-bottom: 1pt solid #e5e7eb; vertical-align: top; }
  tr:nth-child(even) td { background: ${theme.primaryLight}; }
  tr:last-child td { border-bottom: none; }
  hr { border: none; border-top: 1pt solid #e5e7eb; margin: 22pt 0; }
  .doc-footer { padding: 16pt 48pt; border-top: 1pt solid #e5e7eb; display: flex; justify-content: space-between; font-size: 8pt; color: var(--mut); font-family: Consolas, monospace; }
`;

const buildDocumentHTML = (content: string, label: string, theme: DocTheme, lang: 'en' | 'es' = 'en', forPrint = false): string => {
  const body = markdownToHTML(content);
  const printScript = forPrint
    ? `<script>window.addEventListener('load',()=>{setTimeout(()=>{window.print();window.onafterprint=()=>window.close();},800);});<\/script>`
    : '';
  const localizedWorkflow = getLocalizedThemeLabel(theme.label, lang);
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${label} · Ideation Engine</title>
  <style>${buildDocCSS(theme)}</style>
  ${printScript}
</head>
<body>
<div class="page">
  <div class="doc-header">
    <div class="doc-workflow">Ideation Engine · ${localizedWorkflow}</div>
    <div class="doc-title">${label}</div>
    <div class="doc-dateline">${formatDate(lang)}</div>
  </div>
  <div class="doc-body">${body}</div>
  <div class="doc-footer">
    <div class="doc-footer-brand">
      <span class="doc-footer-dot"></span>
      Ideation Engine
    </div>
    <span>${new Date().toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')}</span>
  </div>
</div>
</body>
</html>`;
};

const buildWordHTML = (content: string, label: string, theme: DocTheme, lang: 'en' | 'es' = 'en'): string => {
  const body = markdownToHTML(content);
  const localizedWorkflow = getLocalizedThemeLabel(theme.label, lang);
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40" lang="${lang}">
<head>
  <meta charset="utf-8"/>
  <title>${label}</title>
  <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
  <style>${buildWordCSS(theme)}</style>
</head>
<body>
<div class="page">
  <div class="doc-header">
    <div class="doc-workflow">Ideation Engine · ${localizedWorkflow}</div>
    <div class="doc-title">${label}</div>
    <div class="doc-dateline">${formatDate(lang)}</div>
  </div>
  <div class="doc-body">${body}</div>
  <div class="doc-footer">
    <span>Ideation Engine</span>
    <span>${new Date().toLocaleString(lang === 'es' ? 'es-ES' : 'en-US')}</span>
  </div>
</div>
</body>
</html>`;
};

// ─── EXPORT FUNCTIONS ────────────────────────────────────────────────────────

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportMarkdown = (text: string, label: string, theme: DocTheme) => {
  const header = `---\ntitle: ${label}\nworkflow: ${theme.label}\ndate: ${getTimestamp()}\nsource: Ideation Engine\n---\n\n`;
  downloadBlob(new Blob([header + text], { type: 'text/markdown;charset=utf-8' }), `${label}-${getTimestamp()}.md`);
};

const isMobileBrowser = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || ('ontouchstart' in window && window.innerWidth < 1024);
};

const exportPDF = (text: string, label: string, theme: DocTheme, lang: 'en' | 'es' = 'en') => {
  const htmlContent = buildDocumentHTML(text, label, theme, lang, false);

  if (isMobileBrowser()) {
    // Mobile: open a new tab with the HTML and trigger print from there.
    // iframe.print() is blocked on Android/iOS Chrome — new tab is the only reliable way.
    const newTab = window.open('', '_blank');
    if (!newTab) {
      alert(lang === 'es'
        ? 'Tu navegador bloqueó la ventana emergente. Permite ventanas emergentes para este sitio e intenta de nuevo.'
        : 'Your browser blocked the popup. Please allow popups for this site and try again.');
      return;
    }
    newTab.document.open();
    newTab.document.write(htmlContent);
    newTab.document.close();
    // Small delay to ensure content is fully painted before print dialog
    setTimeout(() => {
      try {
        newTab.focus();
        newTab.print();
      } catch (e) {
        // print() blocked (rare) — leave tab open so user can print manually
        console.warn('print() blocked, tab left open for manual print:', e);
      }
    }, 600);
    return;
  }

  // Desktop: use hidden iframe (original behavior)
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;outline:none;pointer-events:none;z-index:-9999';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    alert(lang === 'es' ? 'Error al generar el PDF.' : 'Error generating PDF.');
    document.body.removeChild(iframe);
    return;
  }

  iframe.onload = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error('Failed to print iframe:', e);
        alert(lang === 'es'
          ? 'Hubo un problema al abrir el diálogo de impresión. Intenta copiar el texto directamente.'
          : 'There was a problem opening the print dialog. Try copying the text directly.');
      }
      setTimeout(() => { try { document.body.removeChild(iframe); } catch (e) {} }, 5000);
    }, 500);
  };

  doc.open();
  doc.write(htmlContent);
  doc.close();
};

const exportDOC = (text: string, label: string, theme: DocTheme, lang: 'en' | 'es' = 'en') => {
  const html = buildWordHTML(text, label, theme, lang);

  if (isMobileBrowser()) {
    // Mobile: .doc files from blob URLs are not openable by mobile browsers.
    // Instead download as .html — opens natively in any mobile browser,
    // and can be shared to Google Docs / Word via the share sheet.
    downloadBlob(
      new Blob([html], { type: 'text/html;charset=utf-8' }),
      `${label}-${getTimestamp()}.html`
    );
    return;
  }

  // Desktop: original .doc download
  downloadBlob(
    new Blob(['\ufeff', html], { type: 'application/vnd.ms-word;charset=utf-8' }),
    `${label}-${getTimestamp()}.doc`
  );
};

const parseMarkdownTableToCSV = (text: string): string | null => {
  const lines = text.split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return null;
  return lines
    .filter(l => !l.match(/^\|[\s\-:]+\|/))
    .map(l => l.split('|').slice(1, -1).map(cell => {
      const c = cell.trim().replace(/\*\*/g, '').replace(/\*/g, '').replace(/"/g, '""');
      return (c.includes(',') || c.includes('"')) ? `"${c}"` : c;
    }).join(','))
    .join('\n');
};

const exportCSV = (text: string, label: string) => {
  const csv = parseMarkdownTableToCSV(text) || text;
  downloadBlob(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), `${label}-${getTimestamp()}.csv`);
};

const hasTableData = (text: string): boolean =>
  text.includes('|') && text.split('\n').filter(l => l.trim().startsWith('|')).length >= 3;

// ─── EXPORT DROPDOWN ─────────────────────────────────────────────────────────

interface ExportMenuProps { text: string; label: string; isCSV?: boolean; theme: DocTheme; lang: 'en' | 'es'; }

const ExportMenu: React.FC<ExportMenuProps> = ({ text, label, isCSV, theme, lang }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const showCSV = isCSV || hasTableData(text);

  const options = [
    ...(showCSV ? [{ id: 'csv', ext: 'CSV', name: 'Excel / Google Sheets', color: 'text-emerald-400', hover: 'hover:bg-emerald-900/20', fn: () => exportCSV(text, safeLabel) }] : []),
    { id: 'pdf', ext: 'PDF', name: lang === 'es' ? 'Documento PDF' : 'PDF Document', color: 'text-red-400', hover: 'hover:bg-red-900/20', fn: () => exportPDF(text, label, theme, lang) },
    { id: 'doc', ext: 'DOC', name: lang === 'es' ? 'Word (.doc)' : 'Word Document (.doc)', color: 'text-blue-400', hover: 'hover:bg-blue-900/20', fn: () => exportDOC(text, label, theme, lang) },
    { id: 'md', ext: 'MD', name: lang === 'es' ? 'Markdown (.md)' : 'Markdown File (.md)', color: 'text-violet-400', hover: 'hover:bg-violet-900/20', fn: () => exportMarkdown(text, safeLabel, theme) },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1 rounded-full border border-white/5 bg-black/20 text-thinklab-text hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
        </svg>
        {lang === 'es' ? 'EXPORTAR' : 'EXPORT'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 opacity-50">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.primary }}></div>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{lang === 'es' ? 'Exportar' : 'Export'} · {getLocalizedThemeLabel(theme.label, lang)}</span>
            </div>
            {options.map(opt => (
              <button key={opt.id} onClick={() => { opt.fn(); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left ${opt.hover} transition-colors group`}>
                <span className={`text-[10px] font-mono font-bold ${opt.color} w-8 shrink-0`}>{opt.ext}</span>
                <span className="text-gray-400 group-hover:text-white transition-colors">{opt.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── COPYABLE BLOCK ───────────────────────────────────────────────────────────

interface CopyableBlockProps {
  label: string; code: string;
  isProse?: boolean; isTableContent?: boolean;
  theme: DocTheme;
  lang: 'en' | 'es';
}

const CopyableBlock: React.FC<CopyableBlockProps> = ({ label, code, isProse = false, isTableContent, theme, lang }) => {
  const [copied, setCopied] = useState(false);
  const isCSV = label === 'CSV' || isTableContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-thinklab-border bg-[#0d0d0d] shadow-2xl ring-1 ring-white/5">
      <div className="flex items-center justify-between px-4 py-2 bg-thinklab-surface border-b border-thinklab-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: isProse ? '#ffffff30' : theme.primary }}></div>
          <span className="text-[10px] font-mono font-bold text-thinklab-text uppercase tracking-widest opacity-80">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu text={code.trim()} label={label} isCSV={isCSV} theme={theme} lang={lang} />
          <button onClick={handleCopy} className={`flex items-center gap-1.5 text-[10px] font-mono transition-all px-3 py-1 rounded-full border ${
            copied ? 'bg-green-900/20 border-green-900 text-green-500'
                   : 'bg-black/20 border-white/5 text-thinklab-text hover:bg-white/10 hover:text-white hover:border-white/20'
          }`}>
            {copied ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>{lang === 'es' ? 'COPIADO' : 'COPIED'}</>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5"/>
                </svg>
                {lang === 'es' ? 'COPIAR' : 'COPY'}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 md:p-5 overflow-x-auto">
        {hasTableData(code) ? (
          <div 
            className="prose-content text-thinklab-text font-light leading-relaxed text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: markdownToHTML(code.trim()) }}
          />
        ) : isProse ? (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none font-light leading-relaxed whitespace-pre-wrap text-thinklab-text">
            {code.trim()}
          </div>
        ) : (
          <pre className="font-mono text-sm text-gray-300 leading-7 whitespace-pre-wrap selection:bg-thinklab-highlight selection:text-white">
            {code.trim()}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── MAIN RENDERER ────────────────────────────────────────────────────────────

const OutputRenderer: React.FC<OutputRendererProps> = ({ content, isTableContent, module, preset, uiLanguage = 'en' }) => {
  const theme = getTheme(module);
  const docTitle = generateDocTitle(content, preset, module, uiLanguage);
  const parts = content.split(/```(\w*)\n?([\s\S]*?)```/g);

  const renderParts = () => {
    const elements: React.ReactNode[] = [];

    if (parts.length === 1) {
      return <CopyableBlock key="full-text" label={docTitle} code={content} isTableContent={isTableContent} theme={theme} lang={uiLanguage} />;
    }

    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        const textContent = parts[i];
        if (textContent && textContent.trim()) {
          // First prose block gets the document title; subsequent ones get a section label
          const isFirst = elements.length === 0;
          elements.push(
            <CopyableBlock
              key={`text-${i}`}
              label={isFirst ? docTitle : (uiLanguage === 'es' ? 'CONTEXTO' : 'CONTEXT')}
              code={textContent.trim()}
              isProse={true}
              isTableContent={isTableContent}
              theme={theme}
              lang={uiLanguage}
            />
          );
        }
      } else {
        const codeLang = parts[i] || 'MARKDOWN';
        const code = parts[i + 1];
        if (code && code.trim()) {
          // Code/structured blocks keep their language label (JSON, CSV, etc.)
          const isFirstBlock = elements.length === 0;
          elements.push(
            <CopyableBlock
              key={`code-${i}`}
              label={isFirstBlock ? docTitle : (codeLang.toUpperCase() || (uiLanguage === 'es' ? 'BLOQUE' : 'BLOCK'))}
              code={code}
              isTableContent={isTableContent || codeLang.toLowerCase() === 'csv'}
              theme={theme}
              lang={uiLanguage}
            />
          );
        }
        i += 1;
      }
    }
    return elements;
  };

  return <div className="w-full space-y-4">{renderParts()}</div>;
};

export default OutputRenderer;