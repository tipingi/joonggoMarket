const express = require('express');
const pool = require('../config/db'); // 데이터베이스 연결
const { getUserById, updateUserInfo } = require('../models/userModel');
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

    try {
        // 현재 로그인한 사용자 정보
        const [userInfo] = await pool.query(
            'SELECT id, name, email, phone_no, post_code, address, DATE_FORMAT(init_at, "%Y-%m-%d %H:%i:%s") AS init_at ' +
            'FROM tbl_user WHERE id = ?', [user.id]);

        // 판매 중인 내역 5개
        const [sellHistory] = await pool.query(
            'SELECT tpr.name as product_name, DATE_FORMAT(tpr.created_at, "%Y-%m-%d %H:%i:%s") AS created_at ' +
            'FROM tbl_product tpr inner join tbl_user tur on tpr.seller_id = tur.id ' +
            'where tpr.status_id = 1 and tpr.seller_id = ? ORDER BY tpr.created_at DESC LIMIT 5', [user.id]);

        // 구매 내역 5개
        const [buyHistory] = await pool.query(
            'SELECT tpr.name as product_name, DATE_FORMAT(ttr.transaction_at, "%Y-%m-%d %H:%i:%s") AS transaction_at ' +
            'FROM tbl_transaction ttr inner join tbl_user tur on ttr.buyer_id = tur.id ' +
            'inner join tbl_product tpr on ttr.product_id = tpr.product_id ' +
            'where ttr.status = 1 and tur.id = ? ORDER BY ttr.transaction_at DESC LIMIT 5', [user.id]);

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

// GET /editInfo - 정보 수정 페이지 렌더링
router.get('/editInfo', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const userInfo = await getUserById(userId);

        console.log(userId);
        console.log(userInfo);

        res.render('editInfo', { userInfo });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /editInfo - 정보 수정 처리
router.post('/editInfo', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { password, name, phone, email, address, post_code } = req.body;

        const result = await updateUserInfo({
            id: userId,
            password,
            name,
            phone,
            email,
            address,
            post_code
        });

        if (result > 0) {
            // 정보 업데이트 후 페이지 리프레시나 다른 페이지로 이동
            res.redirect('/dashboard');
        } else {
            res.send('업데이트할 정보가 없습니다.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;