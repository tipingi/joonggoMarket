const pool = require('../config/db');

// 모든 게시글 목록 조회
async function getAllBoards() {
    const [rows] = await pool.query(
        'SELECT board_id, board_type, writer_id, title, content, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") AS created_at '
        + 'FROM tbl_board inner join tbl_user on tbl_user.id = tbl_board.writer_id '
        + 'ORDER BY created_at DESC'
    );
    return rows;
}

// 특정게시글 상세 조회
async function getBoardById(boardId) {
    const [rows] = await pool.query(
        'SELECT board_id, title, content, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at '
        + 'FROM tbl_board WHERE board_id = ?'
        , [boardId]);
    return rows[0];
}

// 상품 등록
async function createBoard({ board_type, writer_id, title, content }) {
    const [result] = await pool.query(
        'INSERT INTO tbl_board (title, writer_id, content, board_type, created_at) VALUES (?, ?, ?, ?, NOW())'
        , [title, writer_id, content, board_type]);
    return result.insertId;
}

// 상품 수정
async function updateBoard(boardId, { title, content, board_type }) {
    const [result] = await pool.query(
        'UPDATE tbl_board SET title = ?, content = ?, board_type = ? '
        + 'WHERE board_id = ? '
        , [title, content, board_type, boardId]);
    return result.affectedRows; // 업데이트된 행 수
}


module.exports = {
    getAllBoards,
    getBoardById,
    createBoard,
    updateBoard
};