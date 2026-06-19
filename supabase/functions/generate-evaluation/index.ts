import { createClient } from "npm:@supabase/supabase-js@2.39.3"
import { OpenAIEmbeddings, ChatOpenAI } from "npm:@langchain/openai@0.0.14"
import { SupabaseVectorStore } from "npm:@langchain/community@0.0.32/vectorstores/supabase"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Recibimos el tema del frontend (la pregunta del usuario o el título del PDF)
    const { context } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Convertimos el tema en un vector para poder buscarlo
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // 2. Activamos el Radar SQL para buscar en la tabla
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: 'documents',
      queryName: 'match_documents',
    })

    // 3. ¡LA CLAVE! Buscamos los 4 fragmentos que coincidan con la pregunta/tema
    const relevantDocs = await vectorStore.similaritySearch(context, 4)

    // Si por algún motivo no hay nada en la BD, abortamos para no inventar
    if (relevantDocs.length === 0) {
      throw new Error("No hay suficiente información en los documentos para este tema.")
    }

    // Unimos los textos reales encontrados
    const contextText = relevantDocs.map(doc => doc.pageContent).join("\n\n")

    // 4. Le ordenamos a la IA que arme el examen basándose ESTRICTAMENTE en esos textos
    const llm = new ChatOpenAI({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo',
      temperature: 0.2, // Temperatura baja para que sea muy riguroso
    })

    const prompt = `Eres un evaluador corporativo experto. 
Basándote ÚNICAMENTE en el siguiente texto extraído de los manuales, genera un examen de 3 preguntas de opción múltiple.
El tema central a evaluar es: "${context}".

TEXTO DE REFERENCIA:
${contextText}

Debes devolver ÚNICAMENTE un objeto JSON válido con esta estructura estricta, sin texto adicional:
{
  "questions": [
    {
      "id": "1",
      "text": "¿Pregunta?",
      "options": { "A": "Opción 1", "B": "Opción 2", "C": "Opción 3", "D": "Opción 4" },
      "correctAnswer": "A"
    }
  ]
}`

    const response = await llm.invoke(prompt)

    // Limpiamos la respuesta de la IA por si añade comillas de Markdown (```json)
    const jsonString = response.content.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsedData = JSON.parse(jsonString)

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error en generate-evaluation:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})