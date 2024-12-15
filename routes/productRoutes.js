const express = require('express');
const router = express.Router();

const {
    getAllCategories
} = require('../models/categoryModel');

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductStatus
} = require('../models/productModel');

const { insertTransaction } = require('../models/transactionModel');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/'); // 로그인 페이지로 리디렉션
}

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

// 상품 등록 페이지
router.get('/products/new', async (req, res) => {
    try {
        const categories = await getAllCategories();
        const user = req.session.user;
        res.render('newProduct', { user, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// 상품 등록 (POST /products)
router.post('/products', async (req, res) => {
    const { name, category_id, seller_id, price, description } = req.body;
    try {
        const newProductId = await createProduct({ name, category_id, seller_id, price, description });
        res.redirect('/products');
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

// 구매 처리 라우트 (POST /purchase)
router.post('/purchase', isAuthenticated, async (req, res) => {
    const { product_id } = req.body;    
    const user = req.session.user.id;

    try {
        // 상품 상태 업데이트 (status_id = 3)
        const updated = await updateProductStatus(product_id, 3);
        if (updated === 0) {
            return res.status(404).send('상품을 찾을 수 없습니다.');
        }

        // 거래 완료 (status_id = 3)
        await insertTransaction(user, product_id, 1);

        res.redirect('/mypage');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
