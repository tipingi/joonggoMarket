const express = require('express');
const router = express.Router();

// 인증 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // 로그인 상태라면 다음 미들웨어 실행
    }
    res.redirect('/'); // 로그인 화면으로 리디렉션
}

// 대시보드 화면 (GET /dashboard)
router.get('/dashboard', isAuthenticated, (req, res) => {
    // 세션에서 사용자 정보 가져오기
    const user = req.session.user;

    // DashBoard.ejs 렌더링, 사용자 정보 전달
    res.render('DashBoard', { user });
});

module.exports = router;
