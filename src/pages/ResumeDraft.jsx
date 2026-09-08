import { Link, useLocation } from 'react-router-dom'
import './pages.css'

function ResumeDraft() {
  const location = useLocation()
  const displayName = location.state?.name?.trim() || '회원'
  const jobTitle = (location.state?.jobTitle ?? '').trim()
  const years = (location.state?.years ?? '').trim()
  const careerBullets = location.state?.careerBullets ?? []
  const careerFacts = location.state?.careerFacts ?? []

  const hasJobInfo = jobTitle.length > 0
  const bullets = careerBullets.length > 0 ? careerBullets : careerFacts

  function handleDownload() {
    const lines = [
      `${displayName}님의 경력기술서 초안`,
      '',
      `최근 직장·직무: ${jobTitle}`,
      years ? `재직 연차: ${years}년` : null,
      '',
      '경력 하이라이트',
      ...(bullets.length > 0 ? bullets.map((b) => `- ${b}`) : [`- ${jobTitle}로 근무한 경력`]),
    ].filter(Boolean)
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${displayName}의_경력기술서_초안.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <div className="container interview">
        <Link to="/interview" className="back-link">
          ← 인터뷰로 돌아가기
        </Link>

        {hasJobInfo ? (
          <div className="card">
            <h1>{displayName}님의 경력기술서 초안</h1>
            <div className="dash-row">
              <div className="dash-row__label">
                <span>최근 직장·직무</span>
                <span>{jobTitle}</span>
              </div>
            </div>
            {years && (
              <div className="dash-row">
                <div className="dash-row__label">
                  <span>재직 연차</span>
                  <span>{years}년</span>
                </div>
              </div>
            )}
            <h2>경력 하이라이트</h2>
            <ul className="dash-legend">
              {(bullets.length > 0 ? bullets : [`근무 경력: ${jobTitle}`]).map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="assets-caption">
              이 초안은 인터뷰에서 확인한 사실을 바탕으로 자동 조립한 것으로, 실제 이력서
              제출 전에는 세부 내용을 직접 보완해 주세요.
            </p>
            <button type="button" className="btn btn--secondary" onClick={handleDownload}>
              텍스트 다운로드
            </button>
          </div>
        ) : (
          <div className="card">
            <h1>경력기술서 초안이 아직 없습니다</h1>
            <p>
              인터뷰의 "구체적인 사실" 단계에서 최근 직장·직무를 입력하면 경력기술서 초안을
              만들어 드립니다.
            </p>
            <Link to="/interview" className="btn btn--primary btn--large">
              인터뷰로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeDraft
