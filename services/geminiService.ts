import { GoogleGenAI, Type } from "@google/genai";
import { Expense, FrequencyLabels } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeExpenses = async (expenses: Expense[]) => {
  try {
    const expenseText = expenses.map(e => 
      `- ${e.name}: €${e.amount} (${FrequencyLabels[e.frequency]})`
    ).join('\n');

    const prompt = `Analizza queste spese ricorrenti personali e fornisci un breve consiglio finanziario per risparmiare.
    Inoltre, calcola quale categoria di spesa sembra essere la più impattante.
    
    Lista Spese:
    ${expenseText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
              description: "Un consiglio pratico e amichevole per risparmiare, in Italiano.",
            },
            dominantCategory: {
              type: Type.STRING,
              description: "La categoria di spesa che impatta di più (es. Intrattenimento, Cibo, Salute).",
            },
            potentialSavings: {
              type: Type.STRING,
              description: "Una stima testuale di quanto si potrebbe risparmiare ottimizzando (es. 'Circa 100€ all'anno').",
            }
          },
          required: ["advice", "dominantCategory", "potentialSavings"]
        }
      }
    });

    return response.text ? JSON.parse(response.text) : null;

  } catch (error) {
    console.error("Errore analisi AI:", error);
    throw error;
  }
};