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

const MOCK_PENSION_TOTAL = PENSION_ITEMS.reduce((sum, item) => sum + item.amount, 0)
const TARGET_EXPENSE = 230
const TOTAL_ASSET = ASSET_ITEMS.reduce((sum, item) => sum + item.amount, 0)
const REPLACEMENT_RATE_MIN = 40
const REPLACEMENT_RATE_MAX = 60

function FinanceDashboard() {
  const location = useLocation()
  const displayName = location.state?.name?.trim() || '회원'

  const userPension = Number(location.state?.pension)
  const hasUserPension = Number.isFinite(userPension) && userPension > 0
  const pensionTotal = hasUserPension ? userPension : MOCK_PENSION_TOTAL
  const coverageRate = Math.round((pensionTotal / TARGET_EXPENSE) * 100)

  const preRetirementIncome = Number(location.state?.preRetirementIncome)
  const hasReplacementInputs =
    hasUserPension && Number.isFinite(preRetirementIncome) && preRetirementIncome > 0
  const replacementRate = hasReplacementInputs
    ? Math.round((pensionTotal / preRetirementIncome) * 100)
    : null
  const replacementVerdict = hasReplacementInputs
    ? replacementRate < REPLACEMENT_RATE_MIN
      ? '권장 범위보다 낮습니다'
      : replacementRate > REPLACEMENT_RATE_MAX
        ? '권장 범위보다 높습니다'
        : '권장 범위 안에 있습니다'
    : null

  return (
    <div className="page">
      <div className="container interview">
        <Link to="/interview" className="back-link">
          ← 인터뷰로 돌아가기
        </Link>

        <div className="card">
          <h1>{displayName}님의 자산관리 대시보드</h1>
          <p>
            {hasUserPension ? (
              <>인터뷰에서 직접 입력하신 연금 정보를 반영했습니다. 자산 구성은 아직 <strong>목데이터 미리보기</strong>입니다.</>
            ) : (
              <>자서전 인터뷰 답변을 바탕으로 만든 <strong>목데이터 미리보기</strong>입니다. 인터뷰 마지막의 "구체적인 사실" 단계에서 연금 정보를 입력하면 실제 숫자로 채워집니다.</>
            )}
          </p>
        </div>

        <div className="card">
          <h2>예상 월 연금 수입</h2>
          {hasUserPension ? (
            <div className="dash-row">
              <div className="dash-row__label">
                <span>인터뷰에서 입력한 예상 연금</span>
                <span>{pensionTotal}만원</span>
              </div>
            </div>
          ) : (
            PENSION_ITEMS.map((item) => (
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
            ))
          )}
          <p className="dash-total">
            합계 <strong>{pensionTotal}만원 / 월</strong>
          </p>
        </div>

        <div className="card">
          <h2>소득대체율</h2>
          {hasReplacementInputs ? (
            <>
              <p className="dash-formula">
                계산식: 예상 월 연금({pensionTotal}만원) ÷ 은퇴 전 월 소득({preRetirementIncome}
                만원) × 100
              </p>
              <div className="progress-bar progress-bar--large">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${Math.min(replacementRate, 100)}%` }}
                />
              </div>
              <p className="progress-label progress-label--left">
                <strong>{replacementRate}%</strong> — {replacementVerdict}
              </p>
              <p>
                재무설계 업계에서 일반적으로 권장하는 적정 소득대체율은{' '}
                {REPLACEMENT_RATE_MIN}~{REPLACEMENT_RATE_MAX}%입니다. 이 수치는 개인 상황에
                따라 다르게 적용될 수 있는 일반적인 기준이며, 정확한 판단은 전문 재무 상담을
                권장합니다.
              </p>
            </>
          ) : (
            <p>
              인터뷰의 "구체적인 사실" 단계에서 예상 연금과 은퇴 전 월 소득을 모두 입력하면,
              소득대체율(예상 연금 ÷ 은퇴 전 소득 × 100)을 계산해 권장 범위(
              {REPLACEMENT_RATE_MIN}~{REPLACEMENT_RATE_MAX}%)와 비교해 드립니다.
            </p>
          )}
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
            <div className="progress-bar__fill" style={{ width: `${coverageRate}%` }} />
          </div>
          <p className="progress-label progress-label--left">
            예상 연금 {pensionTotal}만원 / 목표 생활비 {TARGET_EXPENSE}만원 →{' '}
            <strong>{coverageRate}%</strong> 충당
          </p>
          <p>
            {pensionTotal >= TARGET_EXPENSE ? (
              <>현재 예상 연금이 목표 생활비를 넘어섭니다. 여유 자금 {pensionTotal - TARGET_EXPENSE}만원을 어떻게 활용할지 계획해 보세요.</>
            ) : (
              <>현재 예상 연금으로는 목표 생활비의 {coverageRate}%까지 충당됩니다. 부족분{' '}
              {TARGET_EXPENSE - pensionTotal}만원에 대한 추가 소득이나 자산 계획이 필요합니다.</>
            )}
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
