import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './pages.css'

function CardTagline() {
  const location = useLocation()
  const displayName = location.state?.name?.trim() || '회원'
  const jobTitle = (location.state?.jobTitle ?? '').trim()
  const taglineOptions = location.state?.taglineOptions ?? []
  const keywords = location.state?.keywords ?? []

  const options =
    taglineOptions.length > 0
      ? taglineOptions
      : keywords.slice(0, 3).map((k) => `${k} — 다시 시작하는 사람`)

  const [copiedIndex, setCopiedIndex] = useState(null)

  function handleCopy(text, index) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex((i) => (i === index ? null : i)), 1500)
      })
      .catch(() => {})
  }

  return (
    <div className="page">
      <div className="container interview">
        <Link to="/interview" className="back-link">
          ← 인터뷰로 돌아가기
        </Link>

        {options.length > 0 ? (
          <div className="card">
            <h1>{displayName}님의 명함 문구</h1>
            <p className="assets-caption">
              인터뷰에서 발견된 키워드를 바탕으로 만든 제안입니다. 마음에 드는 문구를 골라
              명함에 사용해 보세요.
            </p>
            {options.map((text, i) => (
              <div key={text} className="business-card">
                <div className="business-card__name">{displayName}</div>
                <div className="business-card__tagline">{text}</div>
                {jobTitle && <div className="business-card__job">{jobTitle}</div>}
                <button
                  type="button"
                  className="btn btn--outline btn--small"
                  onClick={() => handleCopy(text, i)}
                >
                  {copiedIndex === i ? '복사됨' : '문구 복사'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <h1>명함 문구가 아직 없습니다</h1>
            <p>인터뷰 질문에 답변하시면 발견된 키워드로 명함 문구를 만들어 드립니다.</p>
            <Link to="/interview" className="btn btn--primary btn--large">
              인터뷰로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardTagline
