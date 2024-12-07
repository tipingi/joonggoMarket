const express = require('express');
const userModel = require('../models/userModel'); // 사용자 인증 모델
const router = express.Router();

// 로그인 화면 (GET /)
router.get('/', (req, res) => {
    res.render('login', { error: null }); // 에러 메시지 초기값
});

// 로그인 처리 (POST /login)
router.post('/login', async (req, res) => {
    const { id, password } = req.body;

    try {
        // 데이터베이스에서 사용자 확인
        const user = await userModel.getUserByCredentials(id, password);

        if (!user) {
            return res.render('login', { error: 'Invalid ID or password' });
        }

        // 사용자 세션에 정보 저장
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        // 인증 성공 시 대시보드로 리디렉션
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 로그아웃 처리 (GET /logout)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/'); // 로그인 화면으로 리디렉션
    });
});

module.exports = router;
