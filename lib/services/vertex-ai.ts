export async function extractTextFromDocument(file: File): Promise<ProcessedDocument> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/process-document', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return await response.json()
}

export async function analyzeAnswer(
  studentAnswer: string,
  referenceAnswer: string
): Promise<AnswerAnalysis> {
  const response = await fetch('/api/analyze-answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentAnswer, referenceAnswer }),
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return await response.json()
}