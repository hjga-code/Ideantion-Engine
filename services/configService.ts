
import { AIProvider, UserInput } from "../types";

// Definición de la estructura del CSV
const CSV_HEADER = "SERVICE,API_KEY,MODEL_ID";

export interface AppSettings {
  provider: AIProvider;
  openRouterKey: string;
  openRouterModel: string;
  geminiModel: string;
}

// --- GESTIÓN DE ARCHIVOS CSV (El "Script" de Lectura/Escritura) ---

export const exportSettingsToCSV = (currentInput: UserInput) => {
  // Obtenemos el modelo de Gemini seleccionado
  const geminiModelExport = currentInput.geminiModel || "gemini-3-flash-preview";

  const rows = [
    CSV_HEADER,
    `OPENROUTER,${currentInput.openRouterKey || ''},${currentInput.openRouterModel || ''}`,
    `GEMINI,,${geminiModelExport}` // No exportamos key de Gemini
  ];

  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "thinklab_keys.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseSettingsFromCSV = async (file: File): Promise<Partial<UserInput>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/);
        
        const updates: Partial<UserInput> = {};
        
        // Ignoramos la cabecera (i=0) y procesamos las líneas
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const [service, key, model] = line.split(',');
          
          if (service === 'OPENROUTER') {
            if (key) updates.openRouterKey = key.trim();
            if (model) updates.openRouterModel = model.trim();
          } else if (service === 'GEMINI') {
             // Ya no cargamos Key de Gemini
             if (model) {
                 updates.geminiModel = model.trim();
             }
          }
        }
        
        resolve(updates);
      } catch (error) {
        reject(new Error("Error al procesar el archivo CSV."));
      }
    };
    
    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader.readAsText(file);
  });
};
