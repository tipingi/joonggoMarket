const pool = require('../config/db');

async function insertReview({ transaction_id, product_id, writer_id, score, content }) {
    const [result] = await pool.query(
        'INSERT INTO tbl_review (transaction_id, product_id, writer_id, score, content) ' +
        'SELECT ttr.transaction_id, ttr.product_id, ?, ?, ? ' +
        'FROM tbl_transaction ttr ' +
        'WHERE ttr.transaction_id = ? AND ttr.product_id = ?;',
        [writer_id, score, content, transaction_id, product_id]
    );
    return result.insertId;
}


// 리뷰 조회
async function getReviewsById(seller_id) {
    const [rows] = await pool.query(
        'SELECT tre.product_id, tpr.name as product_name, tre.writer_id, tre.score, tre.content, DATE_FORMAT(tre.created_at, "%Y-%m-%d %H:%i:%s") as created_at FROM tbl_review tre ' +
        'inner join tbl_product tpr on tre.product_id = tpr.product_id ' +
        'WHERE tre.seller_id = ? ORDER BY tre.created_at DESC',
        [seller_id]
    );
    return rows;
}





module.exports = {
    insertReview,
    getReviewsById,
};
