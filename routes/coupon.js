import express from 'express';
import { allCouponsFromDB, generateCoupons, generateQRFromText, getOutputCouponJson, getQR, saveCouponsInDB } from '../controllers/couponController.js';

const router = express.Router();

router.get('/getqr', getQR);

router.get('/getCouponCodes', getOutputCouponJson);

router.get('/generate-codes', generateCoupons);

router.get('/save', saveCouponsInDB);

router.get('/get-coupons-with-qr', allCouponsFromDB);

router.post("/scan", generateQRFromText);

export default router;
// discount-code-gen -i /path-to-code-data/input.json -o /path-to-write-data/output.json -q 3 -l 9 -p FOO