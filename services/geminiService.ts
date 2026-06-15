
import { GoogleGenAI } from "@google/genai";
import { ModuleType, PresetType, OutputFormat, TargetLanguage, ChatMessage } from "../types";
import { THINKLAB_ORCHESTRATOR_PROMPT, LANGUAGES } from "../constants";
import { getSkillForModule } from "../skills";

// Helper to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (result) {
          const base64 = result.split(',')[1];
          resolve(base64);
      } else {
          reject(new Error("Error converting blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- VALIDATION UTILITY ---
export const validateGeminiConnection = async (geminiKey?: string): Promise<boolean> => {
    const apiKey = geminiKey || process.env.API_KEY;
    if (!apiKey) return false;
    try {
        const ai = new GoogleGenAI({ apiKey });
        await ai.models.countTokens({
            model: 'gemini-3.5-flash',
            contents: { parts: [{ text: 'ping' }] }
        });
        return true;
    } catch (e) {
        console.error("Gemini Validation Failed", e);
        return false;
    }
};

export const generateSessionTitle = async (
    modelId: string,
    userText: string,
    aiText: string,
    geminiKey?: string
): Promise<string> => {
    try {
        const apiKey = geminiKey || process.env.API_KEY;
        if (!apiKey) return "Session";
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash', 
            contents: [{
                role: 'user',
                parts: [{ text: `Generate an extremely concise title (max 5 words) summarizing the topic of this interaction.
                OUTPUT ONLY THE TITLE. NO quotes. NO prefixes. Match the language of the user's input.
                
                User: ${userText.slice(0, 500) || "[Multimodal/Image/Audio Input]"}
                AI: ${aiText.slice(0, 500)}...` }]
            }]
        });
        return response.text?.trim() || "Session";
    } catch (e) {
        return "Session";
    }
};

export const processContent = async (
  modelId: string, 
  text: string,
  audioBlob: Blob | null,
  images: string[], 
  history: ChatMessage[],
  module: ModuleType,
  preset: PresetType,
  language: TargetLanguage,
  format: OutputFormat,
  geminiKey?: string
): Promise<string> => {
  try {
    const apiKey = geminiKey || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("Missing Google Gemini API Key. Add it in the settings panel.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. SKILL LOADING (Virtual File System Read)
    const activeSkill = getSkillForModule(module);
    
    const contextInjection = `
    
    [[CONTEXT INJECTION: ACTIVE SKILL]]
    >> SKILL NAME: ${activeSkill.name}
    >> VERSION: ${activeSkill.version}
    >> DESCRIPTION: ${activeSkill.description}
    
    --- START OF SKILL.MD ---
    ${activeSkill.content}
    --- END OF SKILL.MD ---

    [[RUNTIME PARAMETERS — CRITICAL OVERRIDES]]
    - ⚠️ OUTPUT LANGUAGE: ${language !== 'AUTO' ? `FORCE OUTPUT IN ${LANGUAGES[language]} — regardless of the user input language` : "AUTO-DETECT: You MUST detect the language the user wrote in and output EVERYTHING — all labels, headers, content, tables, and text — in that EXACT SAME language. English input → English output. Spanish input → Spanish output. This is a HARD CONSTRAINT."}
    - OUTPUT FORMAT: ${format}
    - ACTIVE PRESET: ${preset}
    
    [[INSTRUCTION FOR MODEL]]
    If an image is provided, analyze its layout, composition, and colors deeply. Use this analysis to inform the structure you generate.
    `;

    // 2. Build Message History for Gemini
    const contents: any[] = [];

    // Add History
    history.forEach(msg => {
        const parts: any[] = [];
        
        if (msg.images && msg.images.length > 0) {
            msg.images.forEach(imgBase64 => {
                const match = imgBase64.match(/^data:(.*?);base64,(.*)$/);
                if (match) {
                    parts.push({
                        inlineData: {
                            mimeType: match[1],
                            data: match[2]
                        }
                    });
                }
            });
        }

        parts.push({ text: msg.content });

        contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: parts
        });
    });

    // 3. Add Current User Input
    const currentParts: any[] = [];
    
    if (images && images.length > 0) {
        images.forEach(imgBase64 => {
            const match = imgBase64.match(/^data:(.*?);base64,(.*)$/);
            if (match) {
                currentParts.push({
                    inlineData: {
                        mimeType: match[1],
                        data: match[2]
                    }
                });
            }
        });
    }

    if (audioBlob) {
      const audioBase64 = await blobToBase64(audioBlob);
      currentParts.push({
        inlineData: {
          mimeType: audioBlob.type || 'audio/webm',
          data: audioBase64
        }
      });
    }

    // Combine Orchestrator + Skill + User Input
    const finalText = text 
        ? `${text}\n\n${contextInjection}` 
        : `[MULTIMODAL INPUT]\n\n${contextInjection}`;
        
    currentParts.push({ text: finalText });

    contents.push({ role: 'user', parts: currentParts });

    const generationConfig: any = {
        systemInstruction: THINKLAB_ORCHESTRATOR_PROMPT,
        temperature: module === ModuleType.WRITING || module === ModuleType.CODE ? 0.2 : 0.8,
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
    };

    // ENABLE THINKING MODE FOR DESIGN & CODE
    // This allows the model to "reason" about layout coordinates before outputting JSON
    if (module === ModuleType.DESIGN || module === ModuleType.CODE) {
        generationConfig.thinkingConfig = { includeThoughts: true };
    }

    if (format === 'JSON') {
        generationConfig.responseMimeType = 'application/json';
    }

    const response = await ai.models.generateContent({
      model: modelId || 'gemini-3.5-flash',
      contents: contents,
      config: generationConfig
    });

    if (!response || !response.text) {
        throw new Error("The AI returned no content.");
    }

    // CLEANUP: If thinking blocks are included in the response text (despite config), strip them out if we asked for JSON.
    // Sometimes 'responseMimeType: application/json' might conflict with 'includeThoughts: true' in output format.
    // We assume .text returns the final answer, but let's be safe.
    let finalOutput = response.text;
    
    // Remove potential thinking blocks if they leak into text
    finalOutput = finalOutput.replace(/<thought>[\s\S]*?<\/thought>/g, '').trim();

    return finalOutput;

  } catch (error) {
    console.error("Error processing with Gemini:", error);
    throw error;
  }
};
