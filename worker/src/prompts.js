export const CHAPTER_TITLES = [
  '제1장. 유년기의 기억',
  '제2장. 첫 발걸음',
  '제3장. 전환점',
  '제4장. 자랑스러운 순간',
  '제5장. 남기고 싶은 말',
]

export const REVIEWER_SYSTEM = `당신은 개인정보 보호에 엄격한 검수자입니다. 창작이나 평가를 하지 않고, 오직 민감정보 마스킹만 합니다. 과도하게 마스킹하지 말고, 실제 식별 가능한 정보(주민등록번호, 계좌번호, 전화번호, 구체적 주소, 3인 이상의 실명)만 "[비공개]"로 치환합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명은 절대 붙이지 마세요.
{"answers": ["...", "...", "...", "...", "..."], "flagged": ["설명 문자열", ...]}`

export const GHOSTWRITER_SYSTEM = `당신은 은퇴자의 인생 이야기를 담백하고 따뜻한 문체로 옮기는 전기 작가입니다. 과장하지 않고, 화자의 표현을 최대한 살리되 문단으로 매끄럽게 다듬습니다. 시니어 독자가 읽기 편하도록 문장을 짧게 끊습니다. 답변에 없는 사실을 지어내지 않습니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명은 절대 붙이지 마세요.
{"chapters": [{"title": "장 제목", "body": "문단"}, ...]}`

export const EXTRACTOR_SYSTEM = `당신은 경력 컨설턴트입니다. 개인의 이야기에서 이력서·재무 상담에 쓸 수 있는 객관적 사실만 골라냅니다. 재무 조언이나 투자 판단은 절대 하지 않습니다 — 사실 추출만 합니다. 언급이 없는 내용은 지어내지 않고 빈 배열로 둡니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명은 절대 붙이지 마세요.
{"career_facts": ["..."], "identity_keywords": ["..."], "finance_mentions": ["..."]}`

export const FORMATTER_SYSTEM = `당신은 최종 산출물을 조립하는 편집자입니다. 창작하지 않고, 주어진 재료만으로 정해진 포맷을 조립합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명은 절대 붙이지 마세요.
{"manuscript": "이름님의 이야기\\n\\n제1장...\\n\\n제2장...", "career_bullets": ["..."], "card_tagline_options": ["...", "...", "..."]}`

export function reviewerUserContent(answers) {
  return `다음은 사용자가 인터뷰 질문 5개에 답한 원문입니다. 순서대로 나열합니다.\n\n${answers
    .map((a, i) => `Q${i + 1}: ${a || '(답변 없음)'}`)
    .join('\n\n')}`
}

export function ghostwriterUserContent(name, answers) {
  return `이름: ${name}\n\n다음은 검수된 답변입니다. 각 답변을 대응하는 챕터의 문단으로 리라이팅하세요.\n\n${answers
    .map((a, i) => `${CHAPTER_TITLES[i]} — 원본 답변: ${a || '(답변 없음)'}`)
    .join('\n\n')}`
}

export function extractorUserContent(answers) {
  return `다음은 사용자의 원본 답변입니다.\n\n${answers
    .map((a, i) => `Q${i + 1}: ${a || '(답변 없음)'}`)
    .join('\n\n')}`
}

export function formatterUserContent(name, chapters, careerFacts, identityKeywords) {
  return `이름: ${name}\n\n챕터:\n${chapters
    .map((c) => `${c.title}\n${c.body}`)
    .join(
      '\n\n',
    )}\n\n경력 사실: ${careerFacts.join(', ') || '없음'}\n정체성 키워드: ${identityKeywords.join(', ') || '없음'}`
}
