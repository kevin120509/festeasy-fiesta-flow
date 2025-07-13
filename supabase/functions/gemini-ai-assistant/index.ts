import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { budget, location, eventType, providers } = await req.json();

    const prompt = `
    Eres un asistente experto en planificación de eventos. Tu tarea es recomendar un paquete de proveedores para un evento basándote en los siguientes parámetros:

    Presupuesto: $${budget} MXN
    Ubicación del evento: ${location}
    Tipo de evento: ${eventType || 'Fiesta general'}

    Lista de proveedores disponibles:
    ${JSON.stringify(providers, null, 2)}

    INSTRUCCIONES:
    1. Selecciona EXACTAMENTE un proveedor de cada categoría (Comida, Música, Decoración)
    2. El costo total NO debe exceder el presupuesto de $${budget} MXN
    3. Prioriza proveedores con mejor rating y menor distancia
    4. Responde ÚNICAMENTE en formato JSON con esta estructura exacta:

    {
      "recommendations": [
        {
          "id": "id_del_proveedor",
          "name": "nombre_del_proveedor",
          "category": "categoría",
          "price": precio_numerico,
          "rating": rating_numerico,
          "reason": "razón_breve_de_selección"
        }
      ],
      "totalCost": costo_total_numerico,
      "summary": "resumen_breve_del_paquete_recomendado"
    }

    NO incluyas texto adicional, solo el JSON.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON response
    let aiResponse;
    try {
      aiResponse = JSON.parse(generatedText);
    } catch (parseError) {
      // If parsing fails, return a fallback response
      console.error('Failed to parse AI response:', generatedText);
      aiResponse = {
        recommendations: providers.slice(0, 3).map((provider: any) => ({
          id: provider.id,
          name: provider.name,
          category: provider.category,
          price: provider.price,
          rating: provider.rating,
          reason: "Selección automática basada en disponibilidad"
        })),
        totalCost: providers.slice(0, 3).reduce((sum: number, p: any) => sum + p.price, 0),
        summary: "Paquete básico seleccionado automáticamente"
      };
    }

    return new Response(JSON.stringify(aiResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al generar recomendaciones',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});