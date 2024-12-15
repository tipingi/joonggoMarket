const express = require('express');
const pool = require('../config/db'); // 데이터베이스 연결
const router = express.Router();

// 인증 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/'); // 로그인 페이지로 리디렉션
}

// 대시보드 화면 (GET /dashboard)
router.get('/dashboard', isAuthenticated, async (req, res) => {
    const user = req.session.user;

    try {
        const [boardPosts] = await pool.query(
            'SELECT board_id, board_type, writer_id, title, content, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") AS created_at '
            + 'FROM tbl_board inner join tbl_user on tbl_user.id = tbl_board.writer_id '
            + 'ORDER BY created_at DESC LIMIT 7');

        const [popularProducts] = await pool.query('SELECT tca.name as category_name, tpr.name as product_name, tpr.view_count ' +
            'FROM tbl_product tpr ' +
            'inner join tbl_category tca on tpr.category_id = tca.category_id ORDER BY view_count DESC LIMIT 6');

        const [recentProducts] = await pool.query('SELECT tpr.name as product_name, DATE_FORMAT(tpr.created_at, "%Y-%m-%d %H:%i:%s")  AS created_at ' +
            'FROM tbl_product tpr ' +
            'ORDER BY created_at DESC LIMIT 6');

        const [recentTransactions] = await pool.query('SELECT tpr.name as product_name,  DATE_FORMAT(ttr.transaction_at, "%Y-%m-%d %H:%i:%s")  AS transaction_at ' +
            'FROM tbl_transaction ttr ' +
            'inner join tbl_product tpr on ttr.product_id = tpr.product_id ORDER BY transaction_at DESC LIMIT 6');

        res.render('dashboard', {
            user,
            boardPosts,
            popularProducts,
            recentTransactions,
            recentProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;