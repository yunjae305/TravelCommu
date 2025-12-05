const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// 통합된 라우터 불러오기
const travelRoutes = require('./routes/travelRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 간단한 오류 핸들러에서 스택을 노출하지 않도록 환경 구분
const isProd = process.env.NODE_ENV === 'production';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

//모든 요청에 대해 쿠키를 확인하고, 로그인된 유저 정보를 req.user와 res.locals.user에 심어줌
app.use((req, res, next) => {
    const userCookie = req.cookies.user;
    if (userCookie) 
    {
      try 
      {
        const user = JSON.parse(userCookie);
        req.user = user; // 컨트롤러에서 사용 (req.user)
        res.locals.user = user; // EJS에서 바로 사용 (<%= user.name %>)
      } 
      catch(error) 
      {
        console.error("쿠키 파싱 에러", error);
        req.user = null;
        res.locals.user = null;
      }
    } 
    else 
    {
        req.user = null;
        res.locals.user = null;
    }
    next();
});

app.use('/', travelRoutes);

app.use((err, req, res, _next) => {
  console.error(err);
  if (res.headersSent) return;
  const status = err.status || 500;
  res.status(status).send(isProd ? '서버 오류가 발생했습니다.' : err.message);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});