import express from 'express';
import { generateQRFromText } from '../controllers/couponController.js';

const router = express.Router();

router.post("/scan", generateQRFromText);

export default router;
// discount-code-gen -i /path-to-code-data/input.json -o /path-to-write-data/output.json -q 3 -l 9 -p FOO
