const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getMyProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

router.get('/', getProducts);
router.get('/:id', getProduct);

router.get('/seller/my-products', protect, authorize('farmer', 'processor', 'admin'), getMyProducts);
router.post('/', protect, authorize('farmer', 'processor'), upload.array('images', 5), createProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/reviews', protect, authorize('customer'), upload.array('images', 3), addReview);

module.exports = router;