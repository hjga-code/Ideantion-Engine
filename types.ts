
export enum ModuleType {
  CODE = 'CODE',           // Workflow #1: Content Generation
  DESIGN = 'DESIGN',       // Workflow #2: Smart Calendar
  SEO = 'SEO',             // Workflow #3: SEO & Growth
  STRUCTURE = 'STRUCTURE', // Workflow #4: Voice to Structure
  WRITING = 'WRITING',     // Workflow #5: Pro Refinement
  TABLES = 'TABLES',       // Workflow #6: Table Engine
  PROMPT = 'PROMPT',       // Workflow #7: Universal Prompt
  IDEATION = 'IDEATION',   // Workflow #8: Brainstorming
}

export type PresetType = 
  // GENERAL
  | 'GENERAL' 

  // WRITING (High Level 2026)
  | 'EMAIL' 
  | 'COPYWRITING' 
  | 'FOUNDER_MODE'     // Terse, high impact, no fluff
  | 'UX_MICROCOPY'     // Button text, empty states, toasts
  | 'STORYTELLING_MASTER' // Pixar/Hero's Journey frameworks
  
  // PROMPTING (Agentic)
  | 'PROMPT' 
  | 'SYSTEM_PROMPT' 
  | 'SUPER_AGENT_SYSTEM' // Complex agents with tools/constraints
  | 'VIDEO_GEN_SCRIPT'   // Sora/Veo/Runway specific
  | 'COT_OPTIMIZATION'   // Chain of Thought injected prompts
  
  // STRUCTURE (Intelligence)
  | 'NOTES'
  | 'JSON_SCHEMA'
  | 'KNOWLEDGE_GRAPH'    // Obsidian/Roam interconnectivity
  | 'MEETING_INTEL'      // Sentiment analysis + Action items
  | 'LEGAL_EXTRACT'      // Contract clause extraction
  
  // SMART CALENDAR (slot DESIGN)
  | 'CALENDAR_CONTENT'       // Calendario de contenidos para RRSS
  | 'CALENDAR_TASKS'         // Calendario de tareas / GTD
  | 'CALENDAR_PROJECT'       // Calendario de proyecto / sprints
  | 'CALENDAR_LAUNCH'        // Calendario de lanzamiento de producto
  | 'CALENDAR_WEEKLY'        // Planificación semanal personal

  // TABLES (Complex Data)
  | 'DATA_TABLE'
  | 'PRICING_TABLE'
  | 'FINANCIAL_MODEL'         // P&L, Unit Economics
  | 'PRODUCT_ROADMAP'         // RICE scoring, Gantt prep
  | 'COMPARISON_MATRIX'       // Weighted decision matrix
  | 'DATA_ANALYSIS'           // Data insights & cleaning
  | 'PRODUCT_INVENTORY'       // Stock, SKU, pricing
  | 'FORMULA_INTELLIGENCE'    // Complex Excel/Sheets formulas & regex
  | 'DATA_VISUALIZATION'      // Chart configurations / bulk plots
  | 'BUDGET_PLANNER'          // Budgets, cost tracking & forecasting
  | 'DATABASE_DESIGN'         // Relational schemas, SQL & collections

  // SEO (Growth Hacking)
  | 'SEO_AUDIT'
  | 'AD_CAMPAIGN'
  | 'KEYWORD_STRATEGY'
  | 'LANDING_COPY'
  | 'GEO_OPTIMIZATION'        // For AI Overviews (Google SGE)
  | 'LINKEDIN_AUTHORITY'      // Personal brand architecture
  | 'PROGRAMMATIC_SEO_STRUCT' // Scalable page generation

  // CONTENT GENERATION (slot CODE)
  | 'SOCIAL_REEL'             // Reels / TikTok: Hook + Script + Caption
  | 'SOCIAL_CAROUSEL'         // Carrusel multi-slide + caption
  | 'SOCIAL_POST_COPY'        // Post estático + caption persuasivo
  | 'CONTENT_EDUCATIONAL'     // Contenido educativo (tips, tutoriales)
  | 'CONTENT_ADVERTISING'     // Contenido publicitario (ads, campañas)
  | 'CONTENT_PERSONAL_BRAND'  // Marca personal (autoridad, storytelling)
  | 'CONTENT_CREATOR'         // Para creadores (YouTube, Podcast, Newsletter)

  // IDEATION (Strategy)
  | 'BLUE_OCEAN'         // Strategic Canvas
  | 'STARTUP_VALIDATION' // Mom Test / MVP definition
  | 'PRE_MORTEM';        // Risk analysis

export type OutputFormat = 'MARKDOWN' | 'JSON' | 'PLAIN_TEXT' | 'XML' | 'CODE' | 'CSV';

export type TargetLanguage = 'AUTO' | 'ES' | 'EN' | 'FR' | 'DE' | 'IT' | 'PT';

export type AIProvider = 'GEMINI' | 'OPENROUTER';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  audioUrl?: string | null; 
  images?: string[]; 
}

export interface Session {
  id: string;
  title: string;
  timestamp: number;
  lastModified: number;
  messages: ChatMessage[];
  module: ModuleType;
  preset: PresetType;
  language: TargetLanguage;
  format: OutputFormat;
  provider: AIProvider;
  modelUsed: string;
}

export interface GlobalSettings {
  id: string; 
  provider: AIProvider;
  geminiKey: string;
  openRouterKey: string;
  openRouterModel: string;
  geminiModel: string;
  providerName: string;
  tourCompleted?: boolean;
}

export interface ProcessingState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

export interface AudioState {
  blob: Blob | null;
  url: string | null;
}

export interface UserInput {
  text: string;
  audio: AudioState;
  images: string[]; 
  preset: PresetType;
  language: TargetLanguage;
  format: OutputFormat;
  provider: AIProvider;
  geminiKey: string;
  openRouterKey: string;
  openRouterModel: string;
  geminiModel: string;
}
