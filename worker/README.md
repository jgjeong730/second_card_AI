# second-card-api (Cloudflare Worker)

프론트엔드(GitHub Pages, 정적 호스팅)에서 Claude API 키를 직접 노출하지 않기 위한 프록시. `PHASE2_AI_PIPELINE.md`에 정의된 4단계 파이프라인(검수자 → 자서전 작가 → 자산 추출가 → 포맷터)을 순차 호출한다.

## 최초 설정 (한 번만)

```bash
cd worker
npm install
npx wrangler login          # 브라우저에서 Cloudflare 계정 로그인
npx wrangler secret put ANTHROPIC_API_KEY   # 프롬프트에서 실제 API 키 입력 (커밋되지 않음)
```

## 로컬 개발

`worker/.dev.vars` 파일에 (커밋되지 않음, `.dev.vars.example` 참고):

```
ANTHROPIC_API_KEY=sk-ant-...
```

```bash
npm run dev   # http://127.0.0.1:8787
```

테스트:

```bash
curl -X POST http://127.0.0.1:8787/api/manuscript \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"name":"홍길동","answers":["...","...","...","...","..."]}'
```

## 배포

```bash
npm run deploy
```

배포되면 `https://second-card-api.<your-subdomain>.workers.dev`에 엔드포인트가 생긴다. 이 URL을 프론트엔드(`src/pages/Interview.jsx`)에서 호출하도록 연결해야 한다 (다음 단계).

## CORS

`src/index.js`의 `ALLOWED_ORIGINS`에 허용 origin이 하드코딩되어 있다. 배포 도메인이 바뀌면 여기를 수정한다.
