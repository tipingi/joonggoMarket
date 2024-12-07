const pool = require('../config/db');

exports.createTransaction = async (req, res) => {
    const { buyer_id, seller_id, product_id } = req.body;

    try {
        const query = `INSERT INTO tbl_transaction (buyer_id, seller_id, product_id) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(query, [buyer_id, seller_id, product_id]);

        res.status(201).json({ message: 'Transaction created successfully!', transactionId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
