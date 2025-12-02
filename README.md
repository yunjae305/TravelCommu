# Travel App

Firebase Realtime Database 기반의 여행 커뮤니티 Express 앱입니다.

## 빠른 시작
1. 의존성 설치  
   `npm install`
2. 환경 변수 설정  
   `.env.sample`를 복사해 `.env`를 만들고 값을 채우세요.
   - `FIREBASE_DATABASE_URL`: Firebase RTDB URL
   - `GOOGLE_APPLICATION_CREDENTIALS`: 서비스 계정 키 파일 경로 (로컬에 `servicekey.json` 준비 후 경로 지정)
3. 서비스 계정 키 배치  
   Firebase 콘솔에서 발급한 JSON 키를 `.gitignore`된 위치(예: 프로젝트 루트의 `servicekey.json`)에 둡니다.
4. 개발 서버 실행  
   `npm start` (기본 포트 3000)

## 클라이언트 Firebase 설정
`public/firebase-client.js`에 웹 SDK용 Firebase 설정이 들어 있습니다. 필요 시 본인 프로젝트 키로 교체하세요.

## 배포/공유 시 주의
- `.env`와 `servicekey.json`은 커밋하지 말고 팀원에게 별도 채널(예: 비밀관리 서비스)로 전달하세요.
- `node_modules`는 포함하지 않습니다. 필요 시 `npm install`로 복원합니다.
