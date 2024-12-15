const pool = require('../config/db');

// 모든 게시글 목록 조회
async function getAllBoardPosts() {
    const [rows] = await pool.query(
        'SELECT board_id, title, writer_id, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") AS created_at '
        + 'FROM tbl_board ORDER BY created_at DESC'
    );
    return rows;
}

module.exports = {
    getAllBoardPosts
};
