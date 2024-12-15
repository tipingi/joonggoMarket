const express = require('express');
const router = express.Router();
const { getAllBoardPosts } = require('../models/boardModel');

// 게시글 목록 페이지 (GET /boards)
router.get('/boards', async (req, res) => {
    try {
        const boardPosts = await getAllBoardPosts();
        res.render('boardList', { boardPosts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
