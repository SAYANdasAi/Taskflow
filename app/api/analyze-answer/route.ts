// app/api/analyze-answer/route.ts
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'

// Supported model names
const SUPPORTED_MODELS = {
  FLASH: 'gemini-1.5-flash-latest',
  PRO: 'gemini-1.5-pro-latest'
}

export async function POST(request: Request) {
  try {
    // 1. Verify and parse request
    const { studentAnswer, referenceAnswer } = await request.json()
    
    if (!studentAnswer || !referenceAnswer) {
      throw new Error('Both studentAnswer and referenceAnswer are required')
    }

    // 2. Verify API key exists
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key in environment variables')
    }

    // 3. Initialize client with proper configuration
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: SUPPORTED_MODELS.FLASH, // Using latest flash model
      apiVersion: 'v1beta'
    })

    // 4. Construct the analysis prompt
    const prompt = `
    Analyze this student answer against the reference answer. Provide a detailed analysis with:
    1. Overall score (0-100)
    2. Category scores (Keywords, Grammar, Content Accuracy, Completeness) with maxScore 100 each
    3. List of missing concepts
    4. Constructive feedback
    5. List of strengths
    6. List of improvements
    7. Content breakdown (matched, missing, extra percentages)
    
    Return as valid JSON with this exact structure:
    {
      "score": number,
      "categoryScores": [
        {"category": "Keywords", "score": number, "maxScore": 100},
        {"category": "Grammar", "score": number, "maxScore": 100},
        {"category": "Content Accuracy", "score": number, "maxScore": 100},
        {"category": "Completeness", "score": number, "maxScore": 100}
      ],
      "missingConcepts": string[],
      "feedback": string,
      "strengths": string[],
      "improvements": string[],
      "contentBreakdown": {
        "matched": number,
        "missing": number,
        "extra": number
      }
    }
    
    STUDENT ANSWER:
    ${studentAnswer}
    
    REFERENCE ANSWER:
    ${referenceAnswer}
    `

    // 5. Make the API request
    const result = await model.generateContent({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })

    // 6. Process and validate the response
    const response = await result.response
    const text = response.text()
    
    // Clean and parse the response
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()
    
    try {
      const analysisResult = JSON.parse(cleanText)
      
      // Validate the response structure
      if (!analysisResult.score || !analysisResult.categoryScores) {
        throw new Error('Invalid analysis result structure')
      }

      return NextResponse.json({
        success: true,
        ...analysisResult
      })
    } catch (parseError) {
      throw new Error(`Failed to parse API response: ${cleanText}`)
    }

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        solution: [
          "1. Verify your API key is valid at https://aistudio.google.com/",
          "2. Check you're using supported model names:",
          `   - ${SUPPORTED_MODELS.FLASH}`,
          `   - ${SUPPORTED_MODELS.PRO}`,
          "3. Ensure billing is enabled in Google Cloud Console",
          "4. Check API quotas at https://console.cloud.google.com/iam-admin/quotas"
        ].join('\n')
      },
      { status: error.status || 500 }
    )
  }
}