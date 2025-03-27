// app/api/process-document/route.ts
import { NextResponse } from 'next/server'
import { DocumentProcessorServiceClient } from '@google-cloud/documentai'
import path from 'path'

export const dynamic = 'force-dynamic'

async function getCredentials() {
  // Option 1: Use direct environment variables (recommended)
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_CLIENT_SECRET) {
    return {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_CLIENT_SECRET.replace(/\\n/g, '\n')
    }
  }

  // Option 2: Fallback to credentials file
  try {
    const credentialsPath = process.env.VERCEL
      ? path.join(process.cwd(), 'taskflow_keys.json') // Vercel path
      : path.join(process.cwd(), 'taskflow_keys.json') // Local path

    const { readFile } = await import('fs/promises')
    const fileContents = await readFile(credentialsPath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    throw new Error('Failed to load credentials from either env vars or file')
  }
}

export async function POST(request: Request) {
  try {
    const credentials = await getCredentials()
    
    // Initialize client
    const client = new DocumentProcessorServiceClient({
      credentials,
      apiEndpoint: `${process.env.NEXT_PUBLIC_DOCAI_LOCATION}-documentai.googleapis.com`,
      projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID
    })

    // Process document...
    const formData = await request.formData()
    const file = formData.get('file') as File
    const buffer = await file.arrayBuffer()
    
    const [result] = await client.processDocument({
      name: `projects/${process.env.NEXT_PUBLIC_GCP_PROJECT_ID}/locations/${process.env.NEXT_PUBLIC_DOCAI_LOCATION}/processors/${process.env.NEXT_PUBLIC_DOCAI_PROCESSOR_ID}`,
      rawDocument: {
        content: new Uint8Array(buffer),
        mimeType: file.type,
      },
    })

    return NextResponse.json({
      text: result.document?.text || '',
      confidence: result.document?.pages?.[0]?.confidence || 0,
      pages: result.document?.pages?.length || 0,
    })

  } catch (error: any) {
    console.error('Document processing error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: {
          projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
          processorId: process.env.NEXT_PUBLIC_DOCAI_PROCESSOR_ID,
          location: process.env.NEXT_PUBLIC_DOCAI_LOCATION
        }
      },
      { status: 500 }
    )
  }
}