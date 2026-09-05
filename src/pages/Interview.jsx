import { useState } from 'react'
import { Link } from 'react-router-dom'
import './pages.css'

const QUESTIONS = [
  {
    prompt: '어린 시절 가장 기억에 남는 장면은 무엇인가요?',
    chapter: '제1장. 유년기의 기억',
    tag: '#가치관',
  },
  {
    prompt: '첫 직장에 출근하던 날, 무슨 생각을 하셨나요?',
    chapter: '제2장. 첫 발걸음',
    tag: '#첫직장경험',
  },
  {
    prompt: '인생에서 가장 큰 전환점이 있었다면 언제였나요?',
    chapter: '제3장. 전환점',
    tag: '#회복탄력성',
  },
  {
    prompt: '지금까지 가장 자랑스러웠던 순간은 언제인가요?',
    chapter: '제4장. 자랑스러운 순간',
    tag: '#성과경험',
  },
  {
    prompt: '후대에게 꼭 남기고 싶은 한마디는 무엇인가요?',
    chapter: '제5장. 남기고 싶은 말',
    tag: '#정체성선언',
  },
]

function Interview() {
  const [step, setStep] = useState('start')
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(''))
  const [questionIndex, setQuestionIndex] = useState(0)

  const displayName = name.trim() || '회원'

  function handleAnswerChange(value) {
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = value
      return next
    })
  }

  function handleNext() {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1)
    } else {
      setStep('done')
    }
  }

  function handleDownload() {
    const text = buildManuscript(displayName, answers)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${displayName}의_이야기.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const foundTags = QUESTIONS.filter((_, i) => answers[i].trim().length > 0).map(
    (q) => q.tag,
  )

  return (
    <div className="page">
      <div className="container interview">
        <Link to="/" className="back-link">
          ← 처음으로
        </Link>

        {step === 'start' && (
          <div className="card">
            <h1>{displayName}님의 이야기를 들려주세요</h1>
            <p>5개의 질문에 답하면 자서전과 경력 자산이 함께 만들어집니다.</p>
            <label htmlFor="name-input" className="field-label">
              이름
            </label>
            <input
              id="name-input"
              type="text"
              className="text-input"
              placeholder="이름을 입력해 주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="button"
              className="btn btn--primary btn--large"
              onClick={() => setStep('questions')}
            >
              시작하기
            </button>
          </div>
        )}

        {step === 'questions' && (
          <div className="card">
            <div className="progress-bar" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length}>
              <div
                className="progress-bar__fill"
                style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <p className="progress-label">
              {questionIndex + 1} / {QUESTIONS.length}
            </p>
            <h2>{QUESTIONS[questionIndex].prompt}</h2>
            <textarea
              className="text-input textarea"
              rows={5}
              value={answers[questionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="편하게 이야기해 주세요"
            />
            <button type="button" className="btn btn--primary btn--large" onClick={handleNext}>
              다음
            </button>
          </div>
        )}

        {step === 'done' && (
          <>
            <div className="card manuscript">
              <h1>{displayName}님의 이야기</h1>
              {QUESTIONS.map((q, i) => (
                <div key={q.chapter} className="chapter">
                  <h2>{q.chapter}</h2>
                  <p>{answers[i].trim() || '(답변 없음)'}</p>
                </div>
              ))}
              <button type="button" className="btn btn--secondary" onClick={handleDownload}>
                텍스트 다운로드
              </button>
            </div>

            <div className="card assets">
              <h2>당신의 이야기에서 이런 자산이 발견되었습니다</h2>
              <div className="tag-list">
                {foundTags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="assets-caption">
                이 키워드들이 당신의 경력기술서, 재무 대시보드, 명함 문구의 재료가 됩니다
              </p>
              <div className="asset-actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => alert('경력기술서 만들기 기능은 준비 중입니다.')}
                >
                  경력기술서 만들기 →
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => alert('재무 대시보드 만들기 기능은 준비 중입니다.')}
                >
                  재무 대시보드 만들기 →
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => alert('명함 문구 만들기 기능은 준비 중입니다.')}
                >
                  명함 문구 만들기 →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function buildManuscript(name, answers) {
  return (
    `${name}님의 이야기\n\n` +
    QUESTIONS.map((q, i) => `${q.chapter}\n${answers[i].trim() || '(답변 없음)'}`).join(
      '\n\n',
    )
  )
}

export default Interview
