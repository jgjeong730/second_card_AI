const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

export async function callClaudeJSON(apiKey, { model, system, userContent, maxTokens = 1024 }) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''
  return parseJSONLoose(text)
}

function parseJSONLoose(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : text
  try {
    return JSON.parse(candidate.trim())
  } catch (err) {
    throw new Error(`Failed to parse model output as JSON: ${err.message}\n---\n${text}`)
  }
}
