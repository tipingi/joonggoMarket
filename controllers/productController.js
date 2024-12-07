const pool = require('../config/db');

exports.getProducts = async (req, res) => {
    try {
        const query = `
            SELECT p.product_id, p.name, p.price, p.status_id, p.created_at, 
                   c.name AS category_name, u.name AS seller_name 
            FROM tbl_product p
            JOIN tbl_category c ON p.category_id = c.category_id
            JOIN tbl_user u ON p.seller_id = u.user_id
            WHERE p.status_id = 1`;
        const [products] = await pool.query(query);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
