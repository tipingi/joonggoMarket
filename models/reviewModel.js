const pool = require('../config/db');

async function insertReview({ transaction_id, product_id, buyer_id, score, content }) {
    const [result] = await pool.query(
        'INSERT INTO tbl_review (transaction_id, product_id, writer_id, score, content) ' +
        'VALUES (?, ?, ?, ?, ?)'
        , [transaction_id, product_id, buyer_id, score, content]);
    return result.insertId;
}

// 내가 쓴 리뷰 조회
async function getReviewsByMe(writer_id) {
    const [rows] = await pool.query(
        'SELECT tre.product_id, tpr.name as product_name, tre.writer_id, tre.score, tre.content, DATE_FORMAT(tre.created_at, "%Y-%m-%d %H:%i:%s") as created_at ' +
        'FROM tbl_review tre ' +
        'inner join tbl_product tpr on tre.product_id = tpr.product_id ' +
        'WHERE tre.writer_id = ? ORDER BY tre.created_at',
        [writer_id]
    );
    return rows;
}


// 내가 판 목록에 대한 리뷰 조회
async function getReviewsByOthers(seller_id) {
    const [rows] = await pool.query(
        'SELECT tpr.seller_id, ttr.transaction_id, tre.product_id, tpr.name AS product_name, ' +
        'tre.writer_id, tre.score, tre.content, ' +
        'DATE_FORMAT(tre.created_at, "%Y-%m-%d %H:%i:%s") AS created_at ' +
        'FROM tbl_review tre ' +
        'INNER JOIN tbl_product tpr ON tre.product_id = tpr.product_id ' +
        'INNER JOIN tbl_transaction ttr ON tre.transaction_id = ttr.transaction_id ' +
        'WHERE tpr.product_id IN ( ' +
        'SELECT product_id ' +
        'FROM tbl_product ' +
        'WHERE seller_id = ?)  ' +
        'ORDER BY tre.created_at ',
        [seller_id]
    );
    return rows;
}


async function getProductById(product_id) {
    const [rows] = await pool.query(
        'SELECT * from tbl_product where product_id = ?',
        [product_id]
    );
    return rows[0];
}

async function getTransactionById(transaction_id) {
    const [rows] = await pool.query(
        'SELECT * from tbl_transaction where transaction_id = ?',
        [transaction_id]
    );
    return rows[0];
}


module.exports = {
    insertReview,
    getProductById,
    getTransactionById,
    getReviewsByMe,
    getReviewsByOthers
};
