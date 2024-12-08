const express = require('express');
const router = express.Router();

// 인증 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // 로그인 상태라면 다음으로
    }
    res.redirect('/'); // 로그인 화면으로 리디렉션
}

// 쪽지 페이지 (GET /messages)
router.get('/messages', isAuthenticated, (req, res) => {
    const user = req.session.user; // 로그인된 사용자 정보
    res.render('messages', { user }); // messages.ejs 렌더링
});

module.exports = router;
