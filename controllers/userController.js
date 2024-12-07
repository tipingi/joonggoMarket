const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// 로그인
exports.loginUser = async (req, res) => {
    const { id, password } = req.body;

    try {
        // DB에서 사용자 검색
        const [rows] = await pool.query('SELECT * FROM tbl_user WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Invalid ID or password' });
        }

        const user = rows[0];

        // 비밀번호 검증 (여기서는 단순 비교로 처리, 실제로는 bcrypt를 사용 권장)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid ID or password' });
        }

        // JWT 생성
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 로그인 유저 조회
exports.getUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const [rows] = await pool.query(
            'SELECT id, name, email, phone_no, post_code, address FROM tbl_user WHERE user_id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 사용자 등록
exports.registerUser = async (req, res) => {
    const { id, name, password, email, phone_no, post_code, address } = req.body;

    if (!id || !name || !password || !email || !phone_no || !post_code || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = `INSERT INTO tbl_user 
            (id, name, password, email, phone_no, post_code, address) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(query, [id, name, password, email, phone_no, post_code, address]);
        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
