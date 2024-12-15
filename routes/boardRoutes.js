const express = require('express');
const router = express.Router();
const {
    getAllBoards,
    getBoardById,
    createBoard,
    updateBoard
} = require('../models/boardModel');

// 게시글 목록 페이지 (GET /boards)
router.get('/boards', async (req, res) => {
    try {
        const boardPosts = await getAllBoards();
        res.render('boardList', { boardPosts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/boards/new', (req, res) => {
    const user = req.session.user;
    res.render('newBoard', { user });
});

// 게시글 등록 (POST /boards)
router.post('/boards', async (req, res) => {
    const { title, writer_id, content, board_type } = req.body;
    try {
        await createBoard({ board_type, writer_id, title, content });

        res.redirect('/boards');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// 게시글 수정 (PUT /boards/:id)
router.put('/boards/:id', async (req, res) => {
    const boardId = req.params.id;
    const { title, content, board_type } = req.body;
    try {
        const updatedCount = await updateBoard(boardId, { title, content, board_type, boardId });
        if (updatedCount === 0) {
            return res.status(404).send('수정할 상품을 찾을 수 없습니다.');
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
