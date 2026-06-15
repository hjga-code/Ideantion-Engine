
import { ModuleType, PresetType, OutputFormat, TargetLanguage, ChatMessage } from "../types";
import { THINKLAB_ORCHESTRATOR_PROMPT, LANGUAGES } from "../constants";
import { getSkillForModule } from "../skills";

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

export const validateOpenRouterConnection = async (apiKey: string): Promise<boolean> => {
    if (!apiKey) return false;
    try {
        const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
          method: "GET",
          headers: { "Authorization": `Bearer ${apiKey}` }
        });
        return response.ok;
    } catch (e) {
        console.error("OpenRouter Validation Failed", e);
        return false;
    }
};

export const generateSessionTitleOpenRouter = async (
    apiKey: string,
    model: string,
    userText: string,
    aiText: string
): Promise<string> => {
    if (!apiKey) return "Session";
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "ThinkLab Ideation Engine",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free", // Use a cheap/free model for titles
            messages: [{
                role: "user",
                content: `Generate an extremely concise title (max 5 words) summarizing the topic of this interaction. OUTPUT ONLY THE TITLE. NO quotes. NO prefixes. Match the language of the user's input.\n\nUser: ${userText.slice(0, 500) || "[Multimodal]"}\nAI: ${aiText.slice(0, 500)}...`
            }],
            temperature: 0.5,
          })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || "Session";
    } catch (e) {
        return "Session";
    }
};

export const processContentOpenRouter = async (
  apiKey: string,
  model: string,
  text: string,
  audioBlob: Blob | null,
  images: string[],
  history: ChatMessage[],
  module: ModuleType,
  preset: PresetType,
  language: TargetLanguage,
  format: OutputFormat
): Promise<string> => {
  try {
    if (!apiKey) throw new Error("Missing OpenRouter API Key.");

    // 1. LOAD SKILL
    const activeSkill = getSkillForModule(module);
    const skillContext = `
    [[ACTIVE SKILL: ${activeSkill.name} v${activeSkill.version}]]
    ${activeSkill.content}
    
    [[RUNTIME PARAMETERS — CRITICAL OVERRIDES]]
    - ⚠️ OUTPUT LANGUAGE: ${language !== 'AUTO' ? `FORCE OUTPUT IN ${LANGUAGES[language]} — regardless of the user input language` : "AUTO-DETECT: You MUST detect the language the user wrote in and output EVERYTHING — all labels, headers, content, tables, and text — in that EXACT SAME language. English input → English output. Spanish input → Spanish output. This is a HARD CONSTRAINT."}
    - OUTPUT FORMAT: ${format}
    - ACTIVE PRESET: ${preset}
    `;

    const systemContent = `${THINKLAB_ORCHESTRATOR_PROMPT}\n\n${skillContext}`;

    // 2. Build Messages
    const messages: any[] = [
        { role: "system", content: systemContent }
    ];

    history.forEach(msg => {
        let contentPayload: any = msg.content;
        if (msg.images && msg.images.length > 0) {
            contentPayload = [
                { type: "text", text: msg.content }
            ];
            msg.images.forEach(img => {
                 contentPayload.push({ type: "image_url", image_url: { url: img } });
            });
        }
        messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: contentPayload
        });
    });

    // 3. Current Turn
    const userContent: any[] = [];
    if (text.trim()) {
        userContent.push({ type: "text", text: text });
    } else if (audioBlob || images.length > 0) {
        userContent.push({ type: "text", text: "Process the attached input using the active Skill." });
    }

    if (audioBlob) {
        const base64 = await blobToBase64(audioBlob);
        userContent.push({
            type: "image_url", // Generic multimodal mapping
            image_url: { url: `data:${audioBlob.type};base64,${base64}` }
        });
    }

    if (images.length > 0) {
        images.forEach(img => {
            userContent.push({
                type: "image_url",
                image_url: { url: img }
            });
        });
    }

    if (userContent.length > 0) {
        messages.push({ role: "user", content: userContent });
    } else {
        throw new Error("No content to process");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "ThinkLab Ideation Engine",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: module === ModuleType.IDEATION ? 0.9 : 0.3,
      })
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `OpenRouter Error`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response.";

  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw error;
  }
};
