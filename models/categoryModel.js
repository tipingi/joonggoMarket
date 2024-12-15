const pool = require('../config/db');

async function getAllCategories() {
    const [rows] = await pool.query('SELECT category_id, name FROM tbl_category ORDER BY category_id ASC');
    return rows;
}

module.exports = {
    getAllCategories
};
