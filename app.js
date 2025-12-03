const path = require('path');
const express = require('express');
const morgan = require('morgan');

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
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

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