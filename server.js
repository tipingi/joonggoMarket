const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); // 로그인 관련 라우트
const dashboardRoutes = require('./routes/dashboardRoutes'); // 대시보드 라우트

const app = express();

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// Body parser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 세션 설정
app.use(
    session({
        secret: 'your-secret-key', // 임의의 비밀키 설정
        resave: false,
        saveUninitialized: true,
    })
);

// 라우트 설정
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
