const express = require('express');
const router = express.Router();
const { insertReview, getProductById, getTransactionById, getReviewsByMe, getReviewsByOthers} = require('../models/reviewModel');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// 리뷰 조회 페이지 (GET /reviews)
router.get('/reviewList', isAuthenticated, async (req, res) => {
    const userId = req.session.user.id; // 세션에 저장된 사용자 ID
    try {
        const reviews = await getReviewsById(sellerId);
        res.render('review', { reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 리뷰 작성 페이지
router.get('/reviews/new/:transaction_id/:product_id', async (req, res) => {
    const { transaction_id, product_id } = req.params;
    const product = await getProductById(product_id);
    const transaction = await getTransactionById(transaction_id);
    const buyerId = req.session.user.id;

    try {
        res.render('newReview', { buyerId, transaction, product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 리뷰 작성 (POST /reviews)
router.post('/reviews', async (req, res) => {
    const { transaction_id, product_id, buyer_id, score, content } = req.body;

    console.log(req.body);

    try {
        const newReviewId = await insertReview({ transaction_id, product_id, buyer_id, score, content });
        res.redirect('/mypage');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
