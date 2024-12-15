const express = require('express');
const pool = require('../config/db'); // 데이터베이스 연결
const router = express.Router();

// 인증 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // 로그인 상태라면 다음으로
    }
    res.redirect('/'); // 로그인 화면으로 리디렉션
}

// 마이 페이지 (GET /mypage)
router.get('/mypage', isAuthenticated, async (req, res) => {
    const user = req.session.user; // 로그인된 사용자 정보

    console.log(user);
    try {
        // 현재 로그인한 사용자 정보
        const [userInfo] = await pool.query(
            'SELECT id, name, email, phone_no, post_code, address, DATE_FORMAT(init_at, "%Y-%m-%d %H:%i:%s") AS init_at ' +
            'FROM tbl_user WHERE user_id = ?', [user.user_id]);

        // 판매 중인 내역 5개
        const [sellHistory] = await pool.query(
            'SELECT tpr.name as product_name, DATE_FORMAT(tpr.created_at, "%Y-%m-%d %H:%i:%s") AS created_at ' +
            'FROM tbl_product tpr inner join tbl_user tur on tpr.seller_id = tur.user_id ' +
            'where tpr.status_id = 1 and tpr.seller_id = ? ORDER BY tpr.created_at DESC LIMIT 5', [user.user_id]);

        // 구매 내역 5개
        const [buyHistory] = await pool.query(
            'SELECT tpr.name as product_name, DATE_FORMAT(ttr.transaction_at, "%Y-%m-%d %H:%i:%s") AS transaction_at ' +
            'FROM tbl_transaction ttr inner join tbl_user tur on ttr.buyer_id = tur.user_id ' +
            'inner join tbl_product tpr on ttr.product_id = tpr.product_id ' +
            'where ttr.status = 1 and tur.user_id = ? ORDER BY ttr.transaction_at DESC LIMIT 5', [user.user_id]);

        res.render('mypage', {
            user,
            userInfo: userInfo[0],
            sellHistory,
            buyHistory
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
