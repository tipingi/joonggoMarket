const express = require('express');
const router = express.Router();
const { insertReview, getReviewsById } = require('../models/reviewModel');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// 리뷰 페이지 (GET /reviews)
router.get('/reviewList', isAuthenticated, async (req, res) => {
    const sellerId = req.session.user.id; // 세션에 저장된 사용자 ID
    try {
        const reviews = await getReviewsById(sellerId);
        res.render('review', { reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 리뷰 작성 페이지
router.get('/reviews/new', async (req, res) => {
    try {
        const userId = req.session.user;
        res.render('newReview', { userId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// 리뷰 작성 (POST /reviews)
router.post('/reviews', async (req, res) => {
    const { transaction_id, product_id, writer_id, score, content } = req.body;
    try {
        const newBoardId = await insertReview({ transaction_id, product_id, writer_id, score, content });
        res.redirect('/mypage');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
