const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../models/productModel');

// 상품 목록 페이지 (GET /products)
router.get('/products', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.render('productList', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 특정 상품 상세 페이지 (GET /products/:id)
router.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).send('상품을 찾을 수 없습니다.');
        }
        res.render('productDetail', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 상품 등록 (POST /products)
router.post('/products', async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const newProductId = await createProduct({ name, price, description });
        res.json({ success: true, product_id: newProductId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 상품 수정 (PUT /products/:id)
router.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, price, description } = req.body;
    try {
        const updatedCount = await updateProduct(productId, { name, price, description });
        if (updatedCount === 0) {
            return res.status(404).send('수정할 상품을 찾을 수 없습니다.');
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 상품 삭제 (DELETE /products/:id)
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedCount = await deleteProduct(productId);
        if (deletedCount === 0) {
            return res.status(404).send('삭제할 상품을 찾을 수 없습니다.');
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
