const pool = require('../config/db');

async function insertTransaction(buyer_id, product_id, status) {
    const [result] = await pool.query(
        'INSERT INTO tbl_transaction (buyer_id, product_id, transaction_at, status) VALUES (?, ?, NOW(), ?)',
        [buyer_id, product_id, status]
    );
    return result.insertId;
}

module.exports = {
    insertTransaction
};
