import { useState } from 'react'
import { Link } from 'react-router-dom'
import './pages.css'

const TRACKS = [
  {
    id: 'career',
    title: '제2커리어',
    emoji: '💼',
    summary: '경력을 정리해 새 이력서와 명함 문구로 재구성합니다.',
    preview: {
      heading: '경력기술서 미리보기',
      body: '15년차 마케팅 팀장 → "브랜드 스토리텔링 컨설턴트"',
      tag: '#경력자산화',
    },
  },
  {
    id: 'finance',
    title: '자산관리',
    emoji: '💰',
    summary: '연금·저축·지출을 한눈에 보는 은퇴 재무 대시보드를 만듭니다.',
    preview: {
      heading: '연금 대시보드 미리보기',
      body: '국민연금 + 개인연금 예상 월수령액: 187만원',
      tag: '#재무설계',
    },
  },
  {
    id: 'legacy',
    title: '기록·유산',
    emoji: '📖',
    summary: 'AI 인터뷰로 나의 이야기를 자서전으로 남깁니다.',
    preview: {
      heading: 'AI 인터뷰 자서전 미리보기',
      body: '"첫 직장에 출근하던 날, 저는..." — 5개의 질문으로 완성',
      tag: '#자서전',
    },
  },
  {
    id: 'community',
    title: '모임·창업',
    emoji: '🤝',
    summary: '비슷한 경력의 동료들과 모임을 만들거나 소규모 창업을 준비합니다.',
    preview: {
      heading: '모임 매칭 미리보기',
      body: '"은퇴 교사 독서모임" 외 근처 모임 3개 발견',
      tag: '#커뮤니티',
    },
  },
]

function Home() {
  const [selectedId, setSelectedId] = useState(TRACKS[0].id)
  const selected = TRACKS.find((t) => t.id === selectedId)

  return (
    <div className="page">
      <header className="hero container">
        <p className="eyebrow">2026 AI·디지털 사회문제 해결 챌린지 · 아이디어 발굴</p>
        <h1>퇴직하면, 명함이 없어집니다.</h1>
        <p className="lead">
          은퇴 후 사라지는 것은 명함 한 장이 아니라 &quot;나는 이런 사람이다&quot;를 증명할
          사회적 언어입니다. Second Card는 AI와의 대화로 그 언어를 되찾아 드립니다.
        </p>
      </header>

      <section className="tracks container" aria-labelledby="tracks-heading">
        <h2 id="tracks-heading">어떤 이야기부터 시작할까요?</h2>
        <div className="track-grid">
          {TRACKS.map((track) => (
            <button
              key={track.id}
              type="button"
              className={
                'track-card' + (track.id === selectedId ? ' track-card--active' : '')
              }
              aria-pressed={track.id === selectedId}
              onClick={() => setSelectedId(track.id)}
            >
              <span className="track-emoji" aria-hidden="true">
                {track.emoji}
              </span>
              <span className="track-title">{track.title}</span>
              <span className="track-summary">{track.summary}</span>
            </button>
          ))}
        </div>

        <div className="track-preview" role="region" aria-live="polite">
          <span className="track-preview__tag">{selected.preview.tag}</span>
          <h3>{selected.preview.heading}</h3>
          <p className="track-preview__body">{selected.preview.body}</p>
        </div>
      </section>

      <section className="cta container">
        <h2>지금, 나의 두 번째 명함을 만들어보세요</h2>
        <p>5개의 질문에 답하면 AI가 이야기를 자서전과 경력 자산으로 정리해 드립니다.</p>
        <Link to="/interview" className="btn btn--primary btn--large">
          내 두 번째 명함 만들기 →
        </Link>
      </section>
    </div>
  )
}

export default Home
