import http from 'node:http'
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

try {
  process.loadEnvFile(new URL('.env', import.meta.url))
} catch {
  // .env is optional locally if the variable is already exported in the shell
}

const PORT = process.env.PORT || 8787
const FAST_MODEL = 'claude-haiku-4-5-20251001'
const QUALITY_MODEL = 'claude-sonnet-5'

// Only ever runs on the presenter's own machine during a live demo. Vite
// picks a different port if the default is busy, so any localhost/127.0.0.1
// port is allowed (no security downside — this server never runs anywhere
// but localhost) plus the deployed GitHub Pages origin.
const DEPLOYED_ORIGIN = 'https://jgjeong730.github.io'
const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/

function isAllowedOrigin(origin) {
  return origin === DEPLOYED_ORIGIN || LOCALHOST_ORIGIN.test(origin)
}

function corsHeaders(origin) {
  return {
    'access-control-allow-origin': isAllowedOrigin(origin) ? origin : 'null',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  }
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || ''
  const headers = corsHeaders(origin)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }

  if (req.url !== '/api/manuscript' || req.method !== 'POST') {
    res.writeHead(404, headers)
    res.end('Not found')
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    sendJSON(res, 500, headers, { error: 'Missing ANTHROPIC_API_KEY (see server/.env.example)' })
    return
  }

  let body
  try {
    body = JSON.parse(await readBody(req))
  } catch {
    sendJSON(res, 400, headers, { error: 'Invalid JSON body' })
    return
  }

  const name = (body.name || '회원').trim() || '회원'
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, 5) : []
  while (answers.length < 5) answers.push('')

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    const reviewed = await callClaudeJSON(apiKey, {
      model: FAST_MODEL,
      system: REVIEWER_SYSTEM,
      userContent: reviewerUserContent(answers),
      maxTokens: 1024,
    })

    const ghostwritten = await callClaudeJSON(apiKey, {
      model: QUALITY_MODEL,
      system: GHOSTWRITER_SYSTEM,
      userContent: ghostwriterUserContent(name, reviewed.answers ?? answers),
      maxTokens: 1536,
    })

    const extracted = await callClaudeJSON(apiKey, {
      model: FAST_MODEL,
      system: EXTRACTOR_SYSTEM,
      userContent: extractorUserContent(reviewed.answers ?? answers),
      maxTokens: 768,
    })

    const chapters = ghostwritten.chapters ?? CHAPTER_TITLES.map((title) => ({ title, body: '' }))

    const formatted = await callClaudeJSON(apiKey, {
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

    sendJSON(res, 200, headers, {
      chapters,
      manuscript: formatted.manuscript ?? '',
      career_bullets: formatted.career_bullets ?? [],
      card_tagline_options: formatted.card_tagline_options ?? [],
      career_facts: extracted.career_facts ?? [],
      identity_keywords: extracted.identity_keywords ?? [],
      finance_mentions: extracted.finance_mentions ?? [],
      flagged: reviewed.flagged ?? [],
    })
  } catch (err) {
    sendJSON(res, 502, headers, { error: err.message })
  }
})

server.listen(PORT, () => {
  console.log(`Second Card local AI server listening on http://localhost:${PORT}`)
})

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function sendJSON(res, status, headers, data) {
  res.writeHead(status, { ...headers, 'content-type': 'application/json' })
  res.end(JSON.stringify(data))
}
