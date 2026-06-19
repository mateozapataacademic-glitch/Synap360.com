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
    const { query } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Generamos el vector de la pregunta del usuario
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // 2. Conectamos con tu tabla para hacer la búsqueda de similitud
    const vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: 'documents',
      queryName: 'match_documents', // Esta es la función clave de búsqueda
    })

    // 3. Extraemos los 4 fragmentos del PDF que mejor respondan la pregunta
    const relevantDocs = await vectorStore.similaritySearch(query, 4)

    if (relevantDocs.length === 0) {
       return new Response(JSON.stringify({ answer: "Lo siento, no encontré coincidencia en los manuales para esta pregunta." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Unimos los textos encontrados
    const contextText = relevantDocs.map(doc => doc.pageContent).join("\n\n---\n\n")

    // 4. Le pasamos el contexto a la IA para que redacte la respuesta
    const llm = new ChatOpenAI({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo',
      temperature: 0.3,
    })

    const prompt = `Eres Synap 360, un tutor IA experto en los manuales de la empresa.
Responde a la pregunta del usuario basándote ÚNICAMENTE en el contexto proporcionado abajo.
Si la respuesta no está en el contexto, di exactamente: "Lo siento, no tengo información sobre eso en los manuales actuales." No inventes información.

CONTEXTO:
${contextText}

PREGUNTA DEL USUARIO:
${query}

RESPUESTA:`

    const response = await llm.invoke(prompt)

    return new Response(JSON.stringify({ answer: response.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error en chat-ia:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})