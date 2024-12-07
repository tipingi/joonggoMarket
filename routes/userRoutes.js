const express = require('express');
const { getUser, registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 현재 로그인한 사용자 정보 조회
router.get('/info', authMiddleware, getUser);

// 사용자 등록 (회원가입)
router.post('/register', registerUser);

// 사용자 로그인
router.post('/login', loginUser);

module.exports = router;
