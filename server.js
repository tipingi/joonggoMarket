const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

app.use(express.json()); // JSON 요청 파싱

// 기본 라우트 (API 테스트용)
app.get('/api', (req, res) => {
    res.send('API is RUNNING');
});

// 사용자 라우트
app.use('/user', userRoutes);

// React 빌드 파일 제공
app.use(express.static(path.join(__dirname, 'build')));

// 모든 기타 요청을 React 앱으로 전달
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
