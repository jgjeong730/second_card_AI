# second-card-local-server

배포하지 않는 로컬 전용 서버다. `PHASE2_AI_PIPELINE.md`의 4단계 파이프라인(검수자 → 자서전 작가 → 자산 추출가 → 포맷터)을 실행해 실제 Claude API로 자서전을 생성한다.

**배포된 GitHub Pages 데모는 이 서버 없이도 항상 정적 템플릿 로직으로 동작한다.** 이 서버는 심사위원 대면 시연 등 실제 AI 동작을 보여줘야 할 때만 발표자 본인 PC에서 띄운다. Cloudflare 등 별도 인프라나 배포 계정이 필요 없다.

## 사용법

```bash
cd server
cp .env.example .env      # .env를 열어 실제 ANTHROPIC_API_KEY 입력 (커밋되지 않음)
npm start                 # http://localhost:8787
```

프론트엔드(`npm run dev`, 별도 터미널)를 함께 띄우면 인터뷰 완료 화면에서 이 서버가 자동으로 감지되어 실제 AI 생성 결과가 표시된다. 서버가 꺼져 있으면(예: 시연 없이 그냥 데모만 볼 때) 자동으로 기존 정적 조립 로직으로 대체된다.

## 테스트

```bash
curl -X POST http://localhost:8787/api/manuscript \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"name":"홍길동","answers":["...","...","...","...","..."]}'
```
