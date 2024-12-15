const pool = require('../config/db');

// 사용자 정보 조회 (ID만으로)
async function getUserById(id) {
    const [rows] = await pool.query(
        'SELECT user_id, id, name, email, phone_no as phone, post_code, address FROM tbl_user WHERE id = ?',
        [id]
    );
    return rows[0];
}

// 사용자 인증 확인 (ID + Password)
async function getUserByCredentials(id, password) {
    const [rows] = await pool.query(
        'SELECT user_id, id, name, email FROM tbl_user WHERE id = ? AND password = ?',
        [id, password]
    );
    return rows[0]; // 일치하는 사용자 반환 (없으면 undefined)
}

// 사용자 정보 업데이트
async function updateUserInfo({ id, password, name, phone, email, address, post_code }) {
    const fields = [];
    const values = [];

    if (password && password.trim() !== '') {
        // TODO: bcrypt 해싱 로직 추가
        fields.push('password = ?');
        values.push(password);
    }

    if (name) {
        fields.push('name = ?');
        values.push(name);
    }

    if (phone) {
        fields.push('phone_no = ?');
        values.push(phone);
    }

    if (email) {
        fields.push('email = ?');
        values.push(email);
    }

    if (address) {
        fields.push('address = ?');
        values.push(address);
    }

    if (post_code) {
        fields.push('post_code = ?');
        values.push(post_code);
    }

    if (fields.length === 0) return 0;

    const sql = `UPDATE tbl_user SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query(sql, values);
    return result.affectedRows;
}

module.exports = {
    getUserById,
    getUserByCredentials,
    updateUserInfo
};
