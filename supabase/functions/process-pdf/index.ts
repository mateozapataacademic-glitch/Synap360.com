import { createClient } from "npm:@supabase/supabase-js@2.39.3"
import { RecursiveCharacterTextSplitter } from "npm:langchain@0.1.28/text_splitter"
import { OpenAIEmbeddings } from "npm:@langchain/openai@0.0.14"

import pdfParse from "npm:pdf-parse@1.1.1"
import { Buffer } from "node:buffer"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recordId, storagePath, fileName } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Descargamos el PDF del Storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('documents')
      .download(storagePath)

    if (downloadError) throw downloadError

    // 2. Extraemos el texto del PDF
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const pdfData = await pdfParse(buffer)
    
    let cleanText = (pdfData.text || "").replace(/\n/g, ' ').replace(/\0/g, '')

    if (cleanText.trim().length === 0) {
      throw new Error("El documento no contiene texto extraíble.")
    }

    // 3. Picamos el texto en fragmentos (Chunks)
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    
    const splitDocs = await textSplitter.createDocuments(
      [cleanText], 
      [{ document_id: recordId, source: fileName }]
    )

    // 4. Generamos los vectores (Embeddings) con OpenAI
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    const textsToEmbed = splitDocs.map(d => d.pageContent)
    const embeddingsList = await embeddings.embedDocuments(textsToEmbed)

    // 5. 🚀 INSERCIÓN BLINDADA: Llenamos manualmente cada columna para evitar el NULL
    const rowsToInsert = splitDocs.map((doc, index) => ({
      title: fileName,               // ¡Ya no será NULL!
      content: doc.pageContent,
      embedding: embeddingsList[index],
      metadata: doc.metadata,
      storage_path: storagePath      // ¡Ya no será NULL!
    }))

    const { error: insertError } = await supabaseClient
      .from('documents')
      .insert(rowsToInsert)

    if (insertError) throw insertError

    // 6. Actualizamos el registro de control original para marcar éxito
    await supabaseClient
      .from('documents')
      .update({ content: 'Procesado y vectorizado correctamente' })
      .eq('id', recordId)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error crítico en process-pdf:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})