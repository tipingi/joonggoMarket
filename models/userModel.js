const pool = require('../config/db');

// 사용자 인증 (이메일과 비밀번호로 확인)
exports.getUserByCredentials = async (id, password) => {
    try {
        const [rows] = await pool.query(
            'SELECT user_id, id, name, email FROM tbl_user WHERE id = ? AND password = ?',
            [id, password]
        );
        return rows[0]; // 일치하는 사용자 반환 (없으면 undefined)
    } catch (error) {
        throw error;
    }
};
