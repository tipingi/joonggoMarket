const express = require('express');
const router = express.Router();
const { insertReview, getProductById, getTransactionById, getReviewsByMe, getReviewsByOthers} = require('../models/reviewModel');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// 내가 쓴 리뷰 목록 페이지 (GET /myReviews)
router.get('/myReviews', isAuthenticated, async (req, res) => {
    const writer_id = req.session.user.id; // 세션에 저장된 현재 로그인 사용자 ID
    try {
        const reviews = await getReviewsByMe(writer_id);
        res.render('myReviews', { reviews, writer_id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 내가 판매한 상품에 대한 리뷰 페이지 (GET /sellerReviews)
router.get('/sellerReviews', isAuthenticated, async (req, res) => {
    const seller_id = req.session.user.id; // 로그인한 사용자를 seller_id로 가정
    try {
        const reviews = await getReviewsByOthers(seller_id);
        res.render('sellerReviews', { reviews, seller_id });
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
