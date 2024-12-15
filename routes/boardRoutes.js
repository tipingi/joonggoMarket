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

// 내 게시글 페이지 (GET /myBoardList)
router.get('/myBoard', async (req, res) => {
    try {
        const user = req.session.user; 
        const boardPosts = await getBoardById(user.id);
        res.render('myBoardList', { boardPosts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 게시글 등록 페이지
router.get('/boards/new', async (req, res) => {
    try {
        const user = req.session.user; 
        res.render('newBoard', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 게시글 등록 (POST /boards)
router.post('/boards', async (req, res) => {
    const { title, writer_id, content, board_type } = req.body;
    try {
        const newBoardId = await createBoard({ title, writer_id, content, board_type });
        res.redirect('/boards');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 특정 게시글 상세 페이지 (GET /boards/:id)
router.get('/boards/:id', async (req, res) => {
    const boardId = req.params.id;
    try {
        const board = await getBoardById(boardId);
        if (!board) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }
        res.render('boardDetail', { board });
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
            return res.status(404).send('수정할 게시글을 찾을 수 없습니다.');
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
