import React, { useState, useRef } from 'react';

interface OutputRendererProps {
  content: string;
  isTableContent?: boolean;
  module?: string;
  preset?: string;
}

// ─── SMART TITLE ENGINE ──────────────────────────────────────────────────────
// Layer 1: First H1/H2 heading extracted from AI output
// Layer 2: Content pattern detection (detects structures like tables, scripts, schemas)
// Layer 3: Preset → predefined professional title
// Layer 4: Module default

// L3 — Preset lookup table
const PRESET_TITLES: Record<string, string> = {
  // Content Generation
  SOCIAL_REEL:            'Script de Reel',
  SOCIAL_CAROUSEL:        'Carrusel de Contenido',
  SOCIAL_POST_COPY:       'Post + Caption',
  CONTENT_EDUCATIONAL:    'Contenido Educativo',
  CONTENT_ADVERTISING:    'Contenido Publicitario',
  CONTENT_PERSONAL_BRAND: 'Marca Personal',
  CONTENT_CREATOR:        'Guín de Creador',
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
  CONTENT_CALENDAR: 'Calendario de Contenidos',
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
  // General
  GENERAL: 'Documento',
};

// L4 — Module default titles
const MODULE_TITLES: Record<string, string> = {
  CODE:      'Contenido Generado',
  DESIGN:    'Calendario',
  SEO:       'Análisis SEO',
  STRUCTURE: 'Estructura de Datos',
  WRITING:   'Documento de Texto',
  TABLES:    'Tabla de Datos',
  PROMPT:    'Prompt',
  IDEATION:  'Sesión de Ideación',
};

// L2 — Detect document type from content patterns
const detectFromContent = (content: string): string | null => {
  // Calendar / planning tables
  if (/\|\s*(Semana|Week|Lunes|Monday|Martes|Tuesday)/i.test(content))  return 'Calendario de Contenidos';
  if (/\|\s*(Sprint|Fase|Phase|Entregable|Deliverable)/i.test(content)) return 'Calendario de Proyecto';
  if (/\|\s*(Prioridad|Priority|GTD|Contexto|@computadora)/i.test(content)) return 'Plan de Tareas GTD';
  if (/Pre-lanzamiento|Pre-launch|Checklist de Lanzamiento/i.test(content)) return 'Plan de Lanzamiento';
  if (/Bloque Horario|Deep Work|Intenciones de la Semana/i.test(content)) return 'Planificación Semanal';
  // Content formats
  if (/\b(HOOK|GANCHO)\b[:\s]|\bCTA\b[:\s]/i.test(content))            return 'Script de Reel';
  if (/Slide\s+\d+|Diapositiva\s+\d+|SLIDE\s+\d+/i.test(content))     return 'Carrusel de Contenido';
  if (/\bCaption\b[:\s]|\bCAPTION\b[:\s]/i.test(content))              return 'Post + Caption';
  // Financial / data
  if (/P&amp;L|Revenue|EBITDA|Unit Economics|LTV|CAC/i.test(content))  return 'Modelo Financiero';
  if (/\|\s*(Keyword|Palabra Clave).*\|\s*(Volume|Vol\.)/i.test(content)) return 'Estrategia de Keywords';
  if (/\b(CTR|ROAS|CPM|CPA)\b/i.test(content))                         return 'Campaña Publicitaria';
  if (/\|\s*(Precio|Price|Plan|Tier)/i.test(content))                   return 'Tabla de Precios';
  if (/\|\s*(Tarea|Hito|Milestone|Task)/i.test(content))               return 'Roadmap de Producto';
  // Technical / structure
  if (/"type"\s*:\s*"object"|"properties"\s*:|"\$schema"/i.test(content)) return 'Esquema JSON';
  if (/Action Item|Acuerdos|DECISIONES|Próximos Pasos/i.test(content)) return 'Actas de Reunión';
  if (/\[\[.*?\]\]|#\w+.*?\|\|/i.test(content))                       return 'Grafo de Conocimiento';
  // Prompts
  if (/--ar\s+\d+:\d+|--style|--chaos|--seed/i.test(content))          return 'Prompt de Imagen';
  if (/\[SYSTEM\]|<system>|<assistant>|\[INST\]/i.test(content))       return 'System Instruction';
  return null;
};

// Main title resolver
const generateDocTitle = (content: string, preset?: string, module?: string): string => {
  // L1: First heading in AI output
  const heading = content.match(/^#{1,2}\s+(.+)$/m);
  if (heading) {
    const cleaned = heading[1].trim().replace(/[*_`#]/g, '').slice(0, 80);
    if (cleaned.length > 3) return cleaned;
  }
  // L2: Content pattern detection
  const detected = detectFromContent(content);
  if (detected) return detected;
  // L3: Preset lookup
  if (preset && PRESET_TITLES[preset] && PRESET_TITLES[preset] !== 'Documento') {
    return PRESET_TITLES[preset];
  }
  // L4: Module default
  if (module && MODULE_TITLES[module]) return MODULE_TITLES[module];
  return 'Documento';
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
const formatDate = () => new Date().toLocaleDateString('es-ES', {
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

const buildDocumentHTML = (content: string, label: string, theme: DocTheme, forPrint = false): string => {
  const body = markdownToHTML(content);
  const printScript = forPrint
    ? `<script>window.addEventListener('load',()=>{setTimeout(()=>{window.print();window.onafterprint=()=>window.close();},800);});<\/script>`
    : '';
  return `<!DOCTYPE html>
<html lang="es">
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
    <div class="doc-workflow">Ideation Engine · ${theme.label}</div>
    <div class="doc-title">${label}</div>
    <div class="doc-dateline">${formatDate()}</div>
  </div>
  <div class="doc-body">${body}</div>
  <div class="doc-footer">
    <div class="doc-footer-brand">
      <span class="doc-footer-dot"></span>
      Ideation Engine
    </div>
    <span>${new Date().toLocaleString('es-ES')}</span>
  </div>
</div>
</body>
</html>`;
};

const buildWordHTML = (content: string, label: string, theme: DocTheme): string => {
  const body = markdownToHTML(content);
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40" lang="es">
<head>
  <meta charset="utf-8"/>
  <title>${label}</title>
  <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
  <style>${buildWordCSS(theme)}</style>
</head>
<body>
<div class="page">
  <div class="doc-header">
    <div class="doc-workflow">Ideation Engine · ${theme.label}</div>
    <div class="doc-title">${label}</div>
    <div class="doc-dateline">${formatDate()}</div>
  </div>
  <div class="doc-body">${body}</div>
  <div class="doc-footer">
    <span>Ideation Engine</span>
    <span>${new Date().toLocaleString('es-ES')}</span>
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

const exportPDF = (text: string, label: string, theme: DocTheme) => {
  const win = window.open('', '_blank');
  if (!win) { alert('Activa las ventanas emergentes para exportar PDF.'); return; }
  win.document.write(buildDocumentHTML(text, label, theme, true));
  win.document.close();
};

const exportDOC = (text: string, label: string, theme: DocTheme) => {
  const html = buildWordHTML(text, label, theme);
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

interface ExportMenuProps { text: string; label: string; isCSV?: boolean; theme: DocTheme; }

const ExportMenu: React.FC<ExportMenuProps> = ({ text, label, isCSV, theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const showCSV = isCSV || hasTableData(text);

  const options = [
    ...(showCSV ? [{ id: 'csv', ext: 'CSV', name: 'Excel / Google Sheets', color: 'text-emerald-400', hover: 'hover:bg-emerald-900/20', fn: () => exportCSV(text, safeLabel) }] : []),
    { id: 'pdf', ext: 'PDF', name: 'Documento PDF', color: 'text-red-400', hover: 'hover:bg-red-900/20', fn: () => exportPDF(text, label, theme) },
    { id: 'doc', ext: 'DOC', name: 'Word (.doc)', color: 'text-blue-400', hover: 'hover:bg-blue-900/20', fn: () => exportDOC(text, label, theme) },
    { id: 'md', ext: 'MD', name: 'Markdown (.md)', color: 'text-violet-400', hover: 'hover:bg-violet-900/20', fn: () => exportMarkdown(text, safeLabel, theme) },
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
        EXPORT
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
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Exportar · {theme.label}</span>
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
}

const CopyableBlock: React.FC<CopyableBlockProps> = ({ label, code, isProse = false, isTableContent, theme }) => {
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
          <ExportMenu text={code.trim()} label={label} isCSV={isCSV} theme={theme} />
          <button onClick={handleCopy} className={`flex items-center gap-1.5 text-[10px] font-mono transition-all px-3 py-1 rounded-full border ${
            copied ? 'bg-green-900/20 border-green-900 text-green-500'
                   : 'bg-black/20 border-white/5 text-thinklab-text hover:bg-white/10 hover:text-white hover:border-white/20'
          }`}>
            {copied ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>COPIADO</>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5"/>
                </svg>
                COPIAR
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 md:p-5 overflow-x-auto">
        {isProse ? (
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

const OutputRenderer: React.FC<OutputRendererProps> = ({ content, isTableContent, module, preset }) => {
  const theme = getTheme(module);
  const docTitle = generateDocTitle(content, preset, module);
  const parts = content.split(/```(\w*)\n?([\s\S]*?)```/g);

  const renderParts = () => {
    const elements: React.ReactNode[] = [];

    if (parts.length === 1) {
      return <CopyableBlock key="full-text" label={docTitle} code={content} isTableContent={isTableContent} theme={theme} />;
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
              label={isFirst ? docTitle : 'CONTEXTO'}
              code={textContent.trim()}
              isProse={true}
              isTableContent={isTableContent}
              theme={theme}
            />
          );
        }
      } else {
        const lang = parts[i] || 'MARKDOWN';
        const code = parts[i + 1];
        if (code && code.trim()) {
          // Code/structured blocks keep their language label (JSON, CSV, etc.)
          const isFirstBlock = elements.length === 0;
          elements.push(
            <CopyableBlock
              key={`code-${i}`}
              label={isFirstBlock ? docTitle : lang.toUpperCase() || 'BLOQUE'}
              code={code}
              isTableContent={isTableContent || lang.toLowerCase() === 'csv'}
              theme={theme}
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