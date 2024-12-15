const pool = require('../config/db');

// 모든 상품 조회
async function getAllProducts() {
    const [rows] = await pool.query(
        'SELECT product_id, name, price, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at '
        + 'FROM tbl_product WHERE status_id = 1 ORDER BY created_at DESC');
    return rows;
}

// 특정 상품 상세 조회
async function getProductById(productId) {
    const [rows] = await pool.query(
        'SELECT product_id, name, price, description, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at '
        + 'FROM tbl_product WHERE product_id = ? AND status_id = 1'
        , [productId]);
    return rows[0];
}

// 상품 등록
async function createProduct({ name, price, description }) {
    const [result] = await pool.query(
        'INSERT INTO tbl_product (name, price, description, status_id, created_at) VALUES (?, ?, ?, 1, NOW())'
        , [name, price, description]);
    return result.insertId; // 새로 추가된 상품의 id 반환
}

// 상품 수정
async function updateProduct(productId, { name, price, description }) {
    const [result] = await pool.query(
        'UPDATE tbl_product SET name = ?, price = ?, description = ? '
        + 'WHERE product_id = ? AND status_id = 1 '
        , [name, price, description, productId]);
    return result.affectedRows; // 업데이트된 행 수
}

// 상품 삭제 (status_id를 비활성화 하는 식으로 처리할 수도 있음)
async function deleteProduct(productId) {
    const [result] = await pool.query(
        'UPDATE tbl_product SET status_id = 0 WHERE product_id = ?'
        , [productId]);
    return result.affectedRows;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
