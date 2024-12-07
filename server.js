const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

// 라우트 파일 가져오기
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

// 환경 변수 설정
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 라우트 설정
app.use('/products', productRoutes);
app.use('/users', userRoutes);

// 메인 페이지 라우트
app.get('/', (req, res) => {
    res.render('index', { title: 'Used Market' });
});

// 서버 실행
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
