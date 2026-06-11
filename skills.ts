
import { ModuleType } from "./types";

// --- IMPORT WORKFLOWS ---
// Each workflow is imported from its dedicated file for isolation and robustness.
import { CONTENT_GENERATION_WORKFLOW } from "./workflow_code";
import { SMART_CALENDAR_WORKFLOW } from "./workflow_design";
import { SEO_GROWTH_WORKFLOW } from "./workflow_seo";
import { VOICE_TO_STRUCTURE_WORKFLOW } from "./workflow_structure";
import { PRO_REFINEMENT_WORKFLOW } from "./workflow_writing";
import { TABLE_ENGINE_WORKFLOW } from "./workflow_tables";
import { UNIVERSAL_PROMPT_WORKFLOW } from "./workflow_prompt";
import { BRAINSTORMING_WORKFLOW } from "./workflow_ideation";

// Re-export type for compatibility
export interface AgentSkill {
    name: string;
    description: string;
    version: string;
    content: string;
}

// --- MACRO FALLBACK ---
export const MACRO_ENGINEER_WORKFLOW: AgentSkill = {
    name: "macro-engineer",
    description: "Fallback Workflow.",
    version: "3.0.0",
    content: "You are a General Engineer Assistant. If no workflow is specified, act with general logic."
};

// --- CENTRAL WORKFLOW REGISTRY (ORCHESTRATOR) ---
// This Registry acts as the "Switchboard". It maps the App's ModuleTypes
// to the specific English-named Workflows requested.
export const WORKFLOW_REGISTRY: Record<ModuleType, AgentSkill> = {
    [ModuleType.CODE]: CONTENT_GENERATION_WORKFLOW,
    [ModuleType.DESIGN]: SMART_CALENDAR_WORKFLOW,
    [ModuleType.SEO]: SEO_GROWTH_WORKFLOW,
    [ModuleType.STRUCTURE]: VOICE_TO_STRUCTURE_WORKFLOW,
    [ModuleType.WRITING]: PRO_REFINEMENT_WORKFLOW,
    [ModuleType.TABLES]: TABLE_ENGINE_WORKFLOW,
    [ModuleType.PROMPT]: UNIVERSAL_PROMPT_WORKFLOW,
    [ModuleType.IDEATION]: BRAINSTORMING_WORKFLOW
};

// --- ROBUST ORCHESTRATION FUNCTION ---
/**
 * Retrieves the specific workflow configuration for a given module.
 * This ensures that every function call is routed through the correct
 * high-level orchestrator before hitting specific skills.
 */
export const getSkillForModule = (module: ModuleType): AgentSkill => {
    const workflow = WORKFLOW_REGISTRY[module];
    
    if (!workflow) {
        console.warn(`[Orchestrator] Warning: No workflow found for module ${module}. Falling back to MACRO_ENGINEER.`);
        return MACRO_ENGINEER_WORKFLOW;
    }
    
    return workflow;
};
