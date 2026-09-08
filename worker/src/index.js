import { callClaudeJSON } from './claude.js'
import {
  CHAPTER_TITLES,
  REVIEWER_SYSTEM,
  GHOSTWRITER_SYSTEM,
  EXTRACTOR_SYSTEM,
  FORMATTER_SYSTEM,
  reviewerUserContent,
  ghostwriterUserContent,
  extractorUserContent,
  formatterUserContent,
} from './prompts.js'

const ALLOWED_ORIGINS = new Set([
  'https://jgjeong730.github.io',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
])

const FAST_MODEL = 'claude-haiku-4-5-20251001'
const QUALITY_MODEL = 'claude-sonnet-5'

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'null'
  return {
    'access-control-allow-origin': allowOrigin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || ''
    const headers = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers })
    }

    const url = new URL(request.url)
    if (url.pathname !== '/api/manuscript' || request.method !== 'POST') {
      return new Response('Not found', { status: 404, headers })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400, headers)
    }

    const name = (body.name || '회원').trim() || '회원'
    const answers = Array.isArray(body.answers) ? body.answers.slice(0, 5) : []
    while (answers.length < 5) answers.push('')

    if (!env.ANTHROPIC_API_KEY) {
      return jsonResponse({ error: 'Server misconfigured: missing API key' }, 500, headers)
    }

    try {
      const reviewed = await callClaudeJSON(env.ANTHROPIC_API_KEY, {
        model: FAST_MODEL,
        system: REVIEWER_SYSTEM,
        userContent: reviewerUserContent(answers),
        maxTokens: 1024,
      })

      const ghostwritten = await callClaudeJSON(env.ANTHROPIC_API_KEY, {
        model: QUALITY_MODEL,
        system: GHOSTWRITER_SYSTEM,
        userContent: ghostwriterUserContent(name, reviewed.answers ?? answers),
        maxTokens: 1536,
      })

      const extracted = await callClaudeJSON(env.ANTHROPIC_API_KEY, {
        model: FAST_MODEL,
        system: EXTRACTOR_SYSTEM,
        userContent: extractorUserContent(reviewed.answers ?? answers),
        maxTokens: 768,
      })

      const chapters = ghostwritten.chapters ?? CHAPTER_TITLES.map((title) => ({ title, body: '' }))

      const formatted = await callClaudeJSON(env.ANTHROPIC_API_KEY, {
        model: FAST_MODEL,
        system: FORMATTER_SYSTEM,
        userContent: formatterUserContent(
          name,
          chapters,
          extracted.career_facts ?? [],
          extracted.identity_keywords ?? [],
        ),
        maxTokens: 1024,
      })

      return jsonResponse(
        {
          chapters,
          manuscript: formatted.manuscript ?? '',
          career_bullets: formatted.career_bullets ?? [],
          card_tagline_options: formatted.card_tagline_options ?? [],
          finance_mentions: extracted.finance_mentions ?? [],
          flagged: reviewed.flagged ?? [],
        },
        200,
        headers,
      )
    } catch (err) {
      return jsonResponse({ error: err.message }, 502, headers)
    }
  },
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'content-type': 'application/json' },
  })
}
