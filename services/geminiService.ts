
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VehicleData, DesignPreferences, DesignConcept, AspectRatio, ImageSize } from "../types";

export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isOverloaded = error?.message?.includes("503") || error?.message?.includes("overloaded");
    const isRateLimited = error?.message?.includes("429");
    
    if ((isOverloaded || isRateLimited) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const getVehicleSilhouettePrompt = (vehicle: VehicleData) => {
  const isTruckOrSUV = ['Truck', 'SUV', 'Van'].includes(vehicle.type);
  const anatomy = isTruckOrSUV 
    ? "High ground clearance, vertical grille, boxy proportions, massive silhouette."
    : "Low aerodynamic profile, sleek sports car curves.";
  
  return `EXACT VEHICLE: ${vehicle.year || ''} ${vehicle.manufacturer} ${vehicle.model} (${vehicle.type}). 
  BODY CHARACTERISTICS: ${anatomy} 
  STRICT CONSTRAINT: Maintain body lines of the ${vehicle.manufacturer} ${vehicle.model} precisely. No generic shapes. 3M Professional Wrap Finish.`;
};

export const generateDesignConcepts = async (
  vehicle: VehicleData,
  design: DesignPreferences,
  hasImage: boolean
): Promise<DesignConcept[]> => {
  return withRetry(async () => {
    const ai = getAI();
    const isSolid = design.style.includes("Solid Color");
    
    const vehicleDesc = hasImage 
      ? "the vehicle shown in the user's photo" 
      : `${vehicle.year || ''} ${vehicle.manufacturer} ${vehicle.model}`;

    const prompt = `
      Analyze this vehicle: ${vehicleDesc}. Create 3 creative automotive wrap design concepts.
      Style: ${design.style}
      3M Color Palette: ${design.colors.join(", ")}
      ${!isSolid ? `Theme: ${design.theme}` : ""}
      Return JSON with name, description, and rationale. Use Pro-level design thinking.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              rationale: { type: Type.STRING }
            },
            required: ["name", "description", "rationale"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  });
};

export const generateProImage = async (
  prompt: string,
  vehicle: VehicleData,
  aspectRatio: AspectRatio = "16:9",
  imageSize: ImageSize = "1K",
  base64Image?: string
): Promise<string> => {
  return withRetry(async () => {
    const ai = getAI();
    const parts: any[] = [];
    const silhouette = getVehicleSilhouettePrompt(vehicle);

    if (base64Image) {
      const mimeType = base64Image.split(';')[0].split(':')[1];
      const data = base64Image.split(',')[1];
      parts.push({ inlineData: { data, mimeType } });
      parts.push({ 
        text: `STRICT REQUIREMENT: Apply wrap design: ${prompt}. MAINTAIN EXACT SILHOUETTE. Professional 3M finish. ${silhouette}` 
      });
    } else {
      parts.push({ text: `Cinematic 8k automotive studio photography. ${silhouette}. DESIGN: ${prompt}. 3M wrap texture fidelity.` });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: {
        imageConfig: { aspectRatio, imageSize }
      }
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Image generation failed");
  });
};

export const generate360Perspectives = async (
  base64Image: string,
  prompt: string,
  vehicle: VehicleData
): Promise<string[]> => {
  return withRetry(async () => {
    const ai = getAI();
    const angles = ["front 3/4", "side profile", "rear 3/4", "overhead view"];
    const silhouette = getVehicleSilhouettePrompt(vehicle);
    const mimeType = base64Image.split(';')[0].split(':')[1];
    const data = base64Image.split(',')[1];
    
    const anglePromises = angles.map(async (angle) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            { inlineData: { data, mimeType } },
            { text: `Based on this exact vehicle, generate the ${angle} view with the same wrap: ${prompt}. ${silhouette}. COLOR AND TEXTURE CONSISTENCY IS MANDATORY.` }
          ]
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      for (const part of response.candidates?.[0]?.content.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    });

    const additionalFrames = await Promise.all(anglePromises);
    const validFrames = additionalFrames.filter((f): f is string => f !== null);
    
    return [base64Image, ...validFrames];
  });
};

export const editImage = async (
  base64Image: string,
  prompt: string,
  vehicle: VehicleData
): Promise<string> => {
  return withRetry(async () => {
    const ai = getAI();
    const mimeType = base64Image.split(';')[0].split(':')[1];
    const data = base64Image.split(',')[1];
    const silhouette = getVehicleSilhouettePrompt(vehicle);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: `Edit wrap with 3M colors: ${prompt}. ${silhouette}. MAINTAIN EXACT SILHOUETTE.` }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Edit failed");
  });
};

export const chatWithThinking = async (
  message: string,
  history: any[],
  image?: string
) => {
  return withRetry(async () => {
    const ai = getAI();
    const systemPrompt = `You are Agent Zero, an elite 3M Wrap Strategist.
    Goal: Provide hyper-concise, brief, and tactical advice. 
    Constraint: Keep responses under 3 sentences unless specifically asked for detail.
    Interactive Feature: For every advice given, provide 1-2 specific "Try this" design options. 
    Format suggestions exactly as: [Suggestion: Apply Satin Black with Matte Gold Accents]
    Focus on Arizona durability and vehicle lines.`;

    const parts: any[] = [{ text: systemPrompt }, { text: message }];
    if (image) {
      parts.push({
        inlineData: {
          data: image.split(',')[1],
          mimeType: image.split(';')[0].split(':')[1]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });

    return response.text || "No response";
  });
};
