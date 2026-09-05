import { Link, useLocation } from 'react-router-dom'
import './pages.css'

const PENSION_ITEMS = [
  { label: '국민연금', amount: 98, max: 100 },
  { label: '개인연금', amount: 52, max: 100 },
  { label: '퇴직연금(IRP)', amount: 37, max: 100 },
]

const ASSET_ITEMS = [
  { label: '거주 부동산', amount: 4.2, percent: 71 },
  { label: '예금·적금', amount: 0.9, percent: 15 },
  { label: '투자자산(주식·펀드)', amount: 0.5, percent: 9 },
  { label: '기타', amount: 0.3, percent: 5 },
]

const PENSION_TOTAL = PENSION_ITEMS.reduce((sum, item) => sum + item.amount, 0)
const TARGET_EXPENSE = 230
const COVERAGE_RATE = Math.round((PENSION_TOTAL / TARGET_EXPENSE) * 100)
const TOTAL_ASSET = ASSET_ITEMS.reduce((sum, item) => sum + item.amount, 0)

function FinanceDashboard() {
  const location = useLocation()
  const displayName = location.state?.name?.trim() || '회원'

  return (
    <div className="page">
      <div className="container interview">
        <Link to="/interview" className="back-link">
          ← 인터뷰로 돌아가기
        </Link>

        <div className="card">
          <h1>{displayName}님의 자산관리 대시보드</h1>
          <p>
            자서전 인터뷰 답변을 바탕으로 만든 <strong>목데이터 미리보기</strong>입니다. 실제
            연금·자산 정보는 향후 마이데이터 연동을 통해 채워질 예정입니다.
          </p>
        </div>

        <div className="card">
          <h2>예상 월 연금 수입</h2>
          {PENSION_ITEMS.map((item) => (
            <div key={item.label} className="dash-row">
              <div className="dash-row__label">
                <span>{item.label}</span>
                <span>{item.amount}만원</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${(item.amount / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <p className="dash-total">
            합계 <strong>{PENSION_TOTAL}만원 / 월</strong>
          </p>
        </div>

        <div className="card">
          <h2>총자산 구성 (약 {TOTAL_ASSET.toFixed(1)}억원)</h2>
          <div className="stacked-bar">
            {ASSET_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className={`stacked-bar__segment stacked-bar__segment--${i}`}
                style={{ width: `${item.percent}%` }}
              />
            ))}
          </div>
          <ul className="dash-legend">
            {ASSET_ITEMS.map((item, i) => (
              <li key={item.label}>
                <span className={`legend-swatch legend-swatch--${i}`} aria-hidden="true" />
                {item.label} — {item.amount}억원 ({item.percent}%)
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>생활비 충당률</h2>
          <div className="progress-bar progress-bar--large">
            <div className="progress-bar__fill" style={{ width: `${COVERAGE_RATE}%` }} />
          </div>
          <p className="progress-label progress-label--left">
            예상 연금 {PENSION_TOTAL}만원 / 목표 생활비 {TARGET_EXPENSE}만원 →{' '}
            <strong>{COVERAGE_RATE}%</strong> 충당
          </p>
          <p>
            현재 예상 연금으로는 목표 생활비의 {COVERAGE_RATE}%까지 충당됩니다. 부족분{' '}
            {TARGET_EXPENSE - PENSION_TOTAL}만원에 대한 추가 소득이나 자산 계획이 필요합니다.
          </p>
        </div>

        <div className="card cta-card">
          <h2>더 정확한 진단이 필요하신가요?</h2>
          <p>전문 재무 상담사와 함께 나의 연금·자산 현황을 자세히 점검해 보세요.</p>
          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={() => alert('재무 상담 신청 기능은 준비 중입니다.')}
          >
            재무 상담 신청하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinanceDashboard
